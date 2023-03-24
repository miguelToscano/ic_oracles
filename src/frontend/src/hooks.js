import { AuthClient } from "@dfinity/auth-client";
import { useState, useEffect } from "react";

const useAuthClient = () => {
    const [authClient, setAuthClient] = useState(null);
  const [actor, setActor] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasLoggedIn, setHasLoggedIn] = useState(false);

  const login = () => {
    authClient?.login({
      identityProvider: "http://ryjl3-tyaaa-aaaaa-aaaba-cai.localhost:4000/#authorize",
      onSuccess: () => {
        initActor();
        setIsAuthenticated(true);
        setTimeout(() => {
          setHasLoggedIn(true);
        }, 100);
      },
    });
  };

  const initActor = () => {
    const actor = createActor(canisterId, {
      agentOptions: {
        identity: authClient.getIdentity(),
      },
    });
    setActor(actor);
  };

  const logout = () => {
    clear();
    setIsAuthenticated(false);
    setActor(null);
  };

  useEffect(() => {
    AuthClient.create({
      idleOptions: {
        disableDefaultIdleCallback: true,
        disableIdle: true
      }
    }).then(async (client) => {
      const isAuthenticated = await client.isAuthenticated();
      setAuthClient(client);
      setIsAuthenticated(isAuthenticated);
    });
  }, []);

  useEffect(() => {
    if (isAuthenticated) initActor();
  }, [isAuthenticated]);

  return {
    authClient,
    setAuthClient,
    isAuthenticated,
    setIsAuthenticated,
    login,
    logout,
    actor,
    hasLoggedIn,
  };
}

export default useAuthClient;