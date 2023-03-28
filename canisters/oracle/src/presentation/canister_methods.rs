use candid::{Principal, CandidType};
use ic_cdk::api::management_canister::http_request::{
    http_request, CanisterHttpRequestArgument, HttpHeader, HttpMethod, HttpResponse, TransformArgs,
    TransformContext,
};
use ic_kit::candid::{candid_method, export_service};
use ic_kit::ic;
use ic_kit::macros::*;
use ic_kit::*;
use json;
use std::str;
use uuid::Uuid;
use serde::Deserialize;

use crate::domain::requests::{CreateRequestInput, MakeRequestInput, Request};
use crate::errors::ApiError;
use crate::infrastructure::requests::Requests;

const MAKE_REQUEST_FEE : u64 = 4_000_000_000;

#[query]
#[candid_method(query)]
pub fn name() -> String {
    String::from("Oracle canister")
}

pub async fn create_uid() -> Result<String, ApiError> {
    let (bytes,): (Vec<u8>,) = ic::call(Principal::management_canister(), "raw_rand", ())
        .await
        .map_err(|(_, _)| ApiError::InternalError)?;

    let result = Uuid::from_slice(&(bytes)[..16])
        .map_err(|_| ApiError::InternalError)?
        .to_string();

    return Ok(result);
}

#[update]
#[candid_method(update)]
pub async fn create_request(input: CreateRequestInput) -> Result<String, ApiError> {
    let id = create_uid().await?;

    ic::print(format!("{:?}", input.clone()));

    let new_request = Request {
        id,
        url: input.url,
        headers: input.headers,
        method: input.method,
        owner: Principal::from_text(input.owner).unwrap(),
    };
    
    ic::with_mut(|requests_repository: &mut Requests| {
        requests_repository.create(&new_request).map_err(|_| ApiError::InternalError)
    });

    Ok(new_request.id)
}

#[derive(CandidType, Deserialize, Clone)]
pub struct StableStorage {
    requests: Vec<(String, Request)>,
}

#[pre_upgrade]
pub fn pre_upgrade() {
    let requests = ic::with_mut(|requests_repository: &mut Requests| requests_repository.archive());

    let stable_storage = StableStorage { requests };

    match ic::stable_store((stable_storage,)) {
        Ok(_) => (),
        Err(candid_err) => {
            ic::trap(&format!(
                "An error occurred when saving to stable memory (pre_upgrade): {:?}",
                candid_err
            ));
        }
    };
}

#[post_upgrade]
pub fn post_upgrade() {
    if let Ok((stable_storage,)) = ic::stable_restore::<(StableStorage,)>() {
        ic::with_mut(|requests_repository: &mut Requests| {
            requests_repository.load(stable_storage.clone().requests)
        });
    }
}

#[update]
#[candid_method(update)]
pub async fn make_request(input: MakeRequestInput) -> Result<String, ApiError> {
    let available_cycles = ic::msg_cycles_available();

    if available_cycles < MAKE_REQUEST_FEE {
        return Err(ApiError::InsufficientCyclesReceived(format!(
            "Required cycles: {}",
            MAKE_REQUEST_FEE
        )));
    }

    ic::msg_cycles_accept(MAKE_REQUEST_FEE);

    ic::print(format!("{:?}", input));
    let request = ic::with_mut(|requests_repository: &mut Requests| {
        requests_repository.get(input.clone().id)
    });

    if request.is_none() {
        return Err(ApiError::RequestNotFound);
    }

    let request = request.unwrap();

    let request = CanisterHttpRequestArgument {
        url: "https://us-central1-courier-api-proxy.cloudfunctions.net/proxyRequest".to_string(),
        method: HttpMethod::POST,
        body: Some(request.to_body(input).into_bytes()),
        max_response_bytes: None,
        transform: Some(TransformContext::new(transform_send_email, vec![])),
        headers: vec![HttpHeader {
            name: "content-type".to_owned(),
            value: "application/json".to_owned(),
        }],
    };

    match http_request(request).await {
        Ok((_response,)) => {
            let response = _response;

            let mut response_headers: Vec<HttpHeader> = vec![];

            for header in response.headers {
                response_headers.push(HttpHeader {
                    name: header.name,
                    value: header.value,
                });
            }

            let response = HttpResponse {
                status: response.status,
                headers: response_headers,
                body: response.body,
            };

            let stringified_response = json::stringify(String::from_utf8(response.clone().body).unwrap());
            
            return Ok(stringified_response);
        }
        Err((_r, _m)) => {
            ic::print(format!("{:?} ------ {:?}", _r, _m));
            return Err(ApiError::InterCanisterCallError(_m));
        }
    }
}

#[ic_cdk_macros::query]
pub fn transform_send_email(raw: TransformArgs) -> HttpResponse {
    let mut sanitized = raw.response;
    sanitized.headers = vec![];
    sanitized
}

#[query]
#[candid_method(query)]
pub fn get_requests(owner: String) -> Result<Vec<Request>, ApiError> {
    let caller = Principal::from_text(owner).unwrap();
    let mut requests = ic::with(|requests_repository: &Requests| requests_repository.get_all());
    requests = requests.iter().filter(|request| request.owner == caller).cloned().collect();
    Ok(requests)
}

#[query]
#[candid_method(query)]
pub fn get_request(id: String) -> Result<Request, ApiError> {
    let request = ic::with_mut(|requests_repository: &mut Requests| requests_repository.get(id));

    if request.is_none() {
        return Err(ApiError::RequestNotFound);
    }

    Ok(request.unwrap())
}

#[query]
#[candid_method(query)]
pub fn cycles() -> u64 {
    ic::balance()
}

#[query(name = "__get_candid_interface_tmp_hack")]
fn export_candid() -> String {
    export_service!();
    __export_service()
}
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn save_candid() {
        use std::env;
        use std::fs::write;
        use std::path::PathBuf;

        let dir = PathBuf::from(env::var("CARGO_MANIFEST_DIR").unwrap());
        println!("{:?}", dir);
        let dir = dir.parent().unwrap().parent().unwrap().join("candid");
        write(dir.join("oracle.did"), export_candid()).expect("Write failed.");
    }
}
