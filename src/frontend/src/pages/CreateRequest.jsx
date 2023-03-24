import React, { useState } from 'react';
import {
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  Switch,
  Textarea,
  VStack,
  Radio,
  RadioGroup,
  Stack,
  Checkbox,
  HStack,
  IconButton,
  RxCross2
} from "@chakra-ui/react";
import axios from 'axios';
import { Navigate } from "react-router-dom";

const CreateRequest = (props) => {
  const [url, setUrl] = useState(null);
  const [method, setMethod] = useState("GET");
  const [jsonData, setJsonData] = useState(null);
  const [headers, setHeaders] = useState([{ key: "", value: "" }]);
  const [sentRequest, setSentRequest] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [redirectToDashboard, setRedirectToDashboard] = useState(false);

  const onSendRequestClick = async () => {
    const makeRequests = async () => {
      setSentRequest(true);
      setIsLoading(true);
      
      try {
        const createRequestResponse = await props.actor.create_request({
          url,
          method,
          headers: headers.filter(header => header.key != '').map(header => header.key),
          owner: props.principalId
        });
      } catch (error) {
        setIsLoading(false);
        setRedirectToDashboard(true);
      }

      setIsLoading(false);
      setRedirectToDashboard(true);
    };

    await makeRequests();
  }

  const handleHeaderChange = (i, keyOrValue, value) => {
    const newHeaders = [...headers];
    newHeaders[i][keyOrValue] = value;
    setHeaders(newHeaders);
  };

  const handleAddHeader = () => {
    setHeaders([...headers, { key: "", value: "" }]);
  };

  const handleRemoveHeader = (i) => {
    const newHeaders = [...headers];
    newHeaders.splice(i, 1);
    setHeaders(newHeaders);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Here you can handle the form submission, e.g. sending the request
    console.log({ url, method, jsonData, headers });
  };

  return (
    <div>
      {redirectToDashboard ? <Navigate to="/dashboard" /> : <Center h="100vh">
      <Box maxW="md" borderWidth="1px" borderRadius="lg" p={4}>
      <Box as="form" onSubmit={handleSubmit} p={4}>
      <FormControl id="url" isRequired>
        <FormLabel>URL</FormLabel>
        <Input type="url" value={url} onChange={(e) => setUrl(e.target.value)} />
        <FormHelperText>Enter the URL to request</FormHelperText>
      </FormControl>

      <FormControl id="method" mt={4} isRequired>
        <FormLabel>Method</FormLabel>
        <RadioGroup onChange={setMethod} value={method}>
          <Stack direction='row'>
            <Radio value='GET'>GET</Radio>
            <Radio value='POST'>POST</Radio>
          </Stack>
        </RadioGroup>
        <FormHelperText>Select the request method</FormHelperText>
      </FormControl>
      <FormControl id="headers" mt={4}>
        <FormLabel>Headers</FormLabel>
        {headers.map((header, i) => (
          <HStack key={i} alignItems="start" spacing={4} mt={4}>
            <Input
              placeholder="Key"
              value={header.key}
              onChange={(e) => handleHeaderChange(i, "key", e.target.value)}
            />
            <Button onClick={() => handleRemoveHeader(i)}>Remove</Button>
          </HStack>
        ))}
        <Button mt={4} onClick={handleAddHeader}>
          Add header
        </Button>
        <FormHelperText>Enter any headers to include in the request</FormHelperText>
      </FormControl>

      <Button isLoading={isLoading} loadingText='Creating oracle' type="submit" colorScheme="blue" mt={4} onClick={onSendRequestClick}>
        Create oracle
      </Button>
    </Box>
      </Box>
    </Center>}
    </div>
  );
};

export default CreateRequest;