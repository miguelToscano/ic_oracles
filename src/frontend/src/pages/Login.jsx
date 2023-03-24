// import { Button, Icon } from "@adobe/react-spectrum";
import React from "react";
import { Actor, HttpAgent } from '@dfinity/agent';
import { AuthClient } from "@dfinity/auth-client";
import { Card, CardHeader, CardBody, CardFooter, Text, Stack, Divider, ButtonGroup, Button, Heading, Box} from '@chakra-ui/react'
import { Navigate } from "react-router-dom";
import { oracleIdlFactory } from '../services/index';

// const ORACLE_CANISTER_ID = "mclie-4aaaa-aaaah-ace6a-cai";
const ORACLE_CANISTER_ID = "r7inp-6aaaa-aaaaa-aaabq-cai";

function Login(props) {
  const onButtonCLick = () => {
    async function login() {
      const client = await AuthClient.create({
          idleOptions: {
              disableDefaultIdleCallback: true,
              disableIdle: true
          }
      })

      await client.login({
          identityProvider: "http://ryjl3-tyaaa-aaaaa-aaaba-cai.localhost:4000/#authorize",
          // identityProvider: "https://identity.ic0.app/#authorize",
          onSuccess: () => {
              props.setIsAuthenticated(true);
              console.log('login successful')
          }
      });

      const identity = await client.getIdentity();
      const principalId = identity.getPrincipal().toText();
      const actor = await Actor.createActor(oracleIdlFactory, {
        agent: new HttpAgent({
          host: "http://localhost:4000",
          // host: "https://ic0.app",
          identity
        }),
        canisterId: ORACLE_CANISTER_ID,
        identity
      });
      props.setActor(actor);
      props.setPrincipalId(principalId);
    }
    login();
  }

  const isAuthenticated = props.isAuthenticated;

  return (
    <div>
      {isAuthenticated ? <Navigate to="/dashboard" /> : <Box
      display='flex'
      alignItems='center'
      justifyContent='center'
      width='100%'
      py={12}
      bgPosition='center'
      bgRepeat='no-repeat'
      mb={2}>
      <Card maxW='sm'>
        <CardBody>
          <Stack mt='6' spacing='3'>
            <Heading size='md'>Argon Oracle Service</Heading>
            <Text>
              The Argon Oracle Service is an open-source application built on the Internet Computer to create oracles.
            </Text>
          </Stack>
        </CardBody>
        <Divider />
        <CardFooter>
          <ButtonGroup spacing='2'>
            <Button variant='solid' colorScheme='blue' onClick={onButtonCLick}>
              Login with Internet Identity
            </Button>
          </ButtonGroup>
        </CardFooter>
      </Card>
      </Box>}
    </div>
  )
}

export default Login;