import * as React from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td, Button, Flex, Spinner } from "@chakra-ui/react";

import { Navigate } from "react-router-dom";

function Dashboard(props) {
  const [clickedCreateNewRequest, setClickedCreateNewRequest] = React.useState(false);
  const [requests, setRequests] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function getRequests() {
      const requests = await props.actor.get_requests(props.principalId);
      setRequests(requests['Ok']);
      setIsLoading(false);
    }
    getRequests();
  }, []);

   function onCreateNewRequestClick() {
    setClickedCreateNewRequest(true);
   }

   console.log(requests);

  return (
    <div>
      {clickedCreateNewRequest ? <Navigate to="/create" /> : <Box> 
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Box>Logged in as {props.principalId}</Box>
        <Button colorScheme="blue" onClick={onCreateNewRequestClick}>
          Create new request
        </Button>
      </Flex>
      <Table>
        <Thead>
          <Tr>
            <Th>Id</Th>
            <Th>URL</Th>
            <Th>Method</Th>
            <Th>Headers</Th>
          </Tr>
        </Thead>
        { isLoading ? <Spinner /> :  <Tbody>
          {requests.map((item, index) => (
            <Tr key={index}>
              <Td>{item.id}</Td>
              <Td>{item.url}</Td>
              <Td>{item.method}</Td>
              <Td>{item.headers.join(", ")}</Td>
            </Tr>
          ))}
        </Tbody>}
      </Table>
    </Box>}
    </div>

  );
}

export default Dashboard;
