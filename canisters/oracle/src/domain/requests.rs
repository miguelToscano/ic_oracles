use candid::{CandidType, Deserialize, Principal};
use ic_cdk::api::management_canister::http_request::HttpHeader;
use serde::Serialize;
use json;


#[derive(CandidType, Serialize, Deserialize, Debug, Clone)]
pub struct Header {
    pub name: String,
    pub value: String,
}

#[derive(CandidType, Serialize, Deserialize, Debug, Clone)]
pub enum Method {
    GET,
    POST,
    PUT,
    DELETE,
}

#[derive(CandidType, Serialize, Deserialize, Debug, Clone)]
pub struct Request {
    pub id: String,
    pub url: String,
    pub headers: Vec<String>,
    pub method: String,
    pub owner: Principal,
}

#[derive(CandidType, Serialize, Deserialize, Debug, Clone)]
pub struct CreateRequestInput {
    pub url: String,
    pub headers: Vec<String>,
    pub method: String,
    pub owner: String,
}

#[derive(CandidType, Serialize, Deserialize, Debug, Clone)]
pub struct MakeRequestInput {
    pub id: String,
    pub headers: Option<String>,
    pub body: Option<String>
}

impl Request {
    pub fn to_body(&self, make_request_input: MakeRequestInput) -> String {
        let mut body = String::from("");
        let mut headers = String::from("");

        if make_request_input.body.is_none() && make_request_input.headers.is_none() {
            return format!("{{ \"url\": \"{}\", \"method\": \"{}\" }}", self.url, self.method);
        }

        if make_request_input.body.is_some() && make_request_input.headers.is_none() {
            body = json::stringify_pretty(make_request_input.body.unwrap(), 2);
            return format!("{{ \"url\": \"{}\", \"method\": \"{}\", \"data\": {} }}", self.url, self.method, body);
        }

        if make_request_input.body.is_none() && make_request_input.headers.is_some() {
            headers = json::stringify_pretty(make_request_input.headers.unwrap(), 2);
            return format!("{{ \"url\": \"{}\", \"method\": \"{}\", \"headers\": {} }}", self.url, self.method, headers);
        }

        if make_request_input.body.is_some() && make_request_input.headers.is_some() {
            body = json::stringify_pretty(make_request_input.body.unwrap(), 2);
            headers = json::stringify_pretty(make_request_input.headers.unwrap(), 2);
            return format!("{{ \"url\": \"{}\", \"method\": \"{}\", \"headers\": {}, \"data\": {} }}", self.url, self.method, headers, body);
        }

        if make_request_input.body.is_some() {
            body = json::stringify_pretty(make_request_input.body.unwrap(), 2);
        }

        if make_request_input.headers.is_some() {
            headers = json::stringify_pretty(make_request_input.headers.unwrap(), 2);
        }
 
        format!("{{ \"url\": \"{}\", \"method\": \"{}\", \"headers\": {}, \"data\": {} }}", self.url, self.method, headers, body)
    }
}

// pub fn get_body(request: Request, input: MakeRequestInput) -> String {
//     let mut body = request.to_body();
//     let mut headers = String::from("\"headers\": [");
//     let mut headers_kept = String::from("\"headers_kept\": [");

//     for header in input.headers {
//         headers.push_str(&format!("{{ \"name\": \"{}\", \"value\": \"{}\" }},", header.name, header.value));
//     }

//     for header in request.headers_kept {
//         headers_kept.push_str(&format!("\"{}\",", header));
//     }

//     headers.push_str("],");
//     headers_kept.push_str("],");

//     body = body.replace("\"headers\": [],", &headers);
//     body = body.replace("\"headers_kept\": [],", &headers_kept);

//     body
// }
