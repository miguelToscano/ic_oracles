import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export type ApiError = { 'InterCanisterCallError' : string } |
  { 'InsufficientCyclesReceived' : string } |
  { 'RequestNotFound' : null } |
  { 'InternalError' : null };
export interface CreateRequestInput {
  'url' : string,
  'method' : string,
  'owner' : string,
  'headers' : Array<string>,
}
export interface MakeRequestInput {
  'id' : string,
  'body' : [] | [string],
  'headers' : [] | [string],
}
export interface Request {
  'id' : string,
  'url' : string,
  'method' : string,
  'owner' : Principal,
  'headers' : Array<string>,
}
export type Result = { 'Ok' : string } |
  { 'Err' : ApiError };
export type Result_1 = { 'Ok' : Request } |
  { 'Err' : ApiError };
export type Result_2 = { 'Ok' : Array<Request> } |
  { 'Err' : ApiError };
export interface _SERVICE {
  'create_request' : ActorMethod<[CreateRequestInput], Result>,
  'get_request' : ActorMethod<[string], Result_1>,
  'get_requests' : ActorMethod<[string], Result_2>,
  'make_request' : ActorMethod<[MakeRequestInput], Result>,
  'name' : ActorMethod<[], string>,
}
