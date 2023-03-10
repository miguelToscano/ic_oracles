use crate::errors::ApiError;
use candid::Principal;
use ic_cdk::api::management_canister::http_request::{
    http_request, CanisterHttpRequestArgument, HttpHeader, HttpMethod, HttpResponse, TransformArgs,
    TransformContext,
};
use ic_kit::ic;
use uuid::Uuid;

use crate::domain::push::types::{SendPushInput, SendPushToTopicInput};

const COURIER_SEND_URL: &str = "https://api.courier.com/send";

pub async fn send_courier_push(
    api_key: &str,
    push_notification: &SendPushInput,
) -> Result<(), ApiError> {
    let (bytes,): (Vec<u8>,) = ic::call(Principal::management_canister(), "raw_rand", ())
        .await
        .map_err(|(_, _)| ApiError::InternalError)?;

    let idempotency_key = Uuid::from_slice(&(bytes)[..16])
        .map_err(|_| ApiError::InternalError)?
        .to_string();

    let host = String::from(COURIER_SEND_URL);

    let request_headers: Vec<HttpHeader> = vec![
        HttpHeader {
            name: "Authorization".to_owned(),
            value: format!("Bearer {}", api_key),
        },
        HttpHeader {
            name: "Idempotency-Key".to_owned(),
            value: idempotency_key,
        },
    ];

    let request = CanisterHttpRequestArgument {
        url: host,
        method: HttpMethod::POST,
        body: Some(push_notification.to_courier_format().into_bytes()),
        max_response_bytes: None,
        transform: Some(TransformContext::new(transform_send_push, vec![])),
        headers: request_headers,
    };

    match http_request(request).await {
        Ok((_response,)) => Ok(()),
        Err((_r, _m)) => Err(ApiError::InternalError),
    }
}

pub async fn send_courier_topic_push(
    api_key: &str,
    push_notification: &SendPushToTopicInput,
    subscribers: Vec<String>,
) -> Result<(), ApiError> {
    let (bytes,): (Vec<u8>,) = ic::call(Principal::management_canister(), "raw_rand", ())
        .await
        .map_err(|(_, _)| ApiError::InternalError)?;

    let idempotency_key = Uuid::from_slice(&(bytes)[..16])
        .map_err(|_| ApiError::InternalError)?
        .to_string();

    let host = String::from(COURIER_SEND_URL);

    let request_headers: Vec<HttpHeader> = vec![
        HttpHeader {
            name: "Authorization".to_owned(),
            value: format!("Bearer {}", api_key),
        },
        HttpHeader {
            name: "Idempotency-Key".to_owned(),
            value: idempotency_key,
        },
    ];

    let request = CanisterHttpRequestArgument {
        url: host,
        method: HttpMethod::POST,
        body: Some(
            push_notification
                .to_courier_format(subscribers)
                .into_bytes(),
        ),
        max_response_bytes: None,
        transform: Some(TransformContext::new(transform_send_push, vec![])),
        headers: request_headers,
    };

    match http_request(request).await {
        Ok((_response,)) => Ok(()),
        Err((_r, _m)) => Err(ApiError::InternalError),
    }
}

#[ic_cdk_macros::query]
pub fn transform_send_push(raw: TransformArgs) -> HttpResponse {
    let mut sanitized = raw.response;
    sanitized.headers = vec![];
    sanitized
}
