export const oracleIdlFactory = ({ IDL }) => {
  const CreateRequestInput = IDL.Record({
    'url' : IDL.Text,
    'method' : IDL.Text,
    'owner' : IDL.Text,
    'headers' : IDL.Vec(IDL.Text),
  });
  const ApiError = IDL.Variant({
    'InterCanisterCallError' : IDL.Text,
    'InsufficientCyclesReceived' : IDL.Text,
    'RequestNotFound' : IDL.Null,
    'InternalError' : IDL.Null,
  });
  const Result = IDL.Variant({ 'Ok' : IDL.Text, 'Err' : ApiError });
  const Request = IDL.Record({
    'id' : IDL.Text,
    'url' : IDL.Text,
    'method' : IDL.Text,
    'owner' : IDL.Principal,
    'headers' : IDL.Vec(IDL.Text),
  });
  const Result_1 = IDL.Variant({ 'Ok' : Request, 'Err' : ApiError });
  const Result_2 = IDL.Variant({ 'Ok' : IDL.Vec(Request), 'Err' : ApiError });
  const MakeRequestInput = IDL.Record({
    'id' : IDL.Text,
    'body' : IDL.Opt(IDL.Text),
    'headers' : IDL.Opt(IDL.Text),
  });
  return IDL.Service({
    'create_request' : IDL.Func([CreateRequestInput], [Result], []),
    'get_request' : IDL.Func([IDL.Text], [Result_1], ['query']),
    'get_requests' : IDL.Func([IDL.Text], [Result_2], ['query']),
    'make_request' : IDL.Func([MakeRequestInput], [Result], []),
    'name' : IDL.Func([], [IDL.Text], ['query']),
  });
};