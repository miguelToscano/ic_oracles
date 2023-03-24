use ic_kit::candid::CandidType;
use serde::*;

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub enum ApiError {
    InternalError,
    RequestNotFound,
    InterCanisterCallError(String),
    InsufficientCyclesReceived(String),
}
