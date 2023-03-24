import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import Login from './pages/Login';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from './pages/Dashboard';
import CreateRequest from './pages/CreateRequest';

function App() {
    const [isAuthenticated, setIsAuthenticated] = React.useState(false);
    const [authClient, setAuthClient] = React.useState(null);
    const [actor, setActor] = React.useState(null);
    const [principalId, setPrincipalId] = React.useState(null);

    return (
        <ChakraProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} setPrincipalId={setPrincipalId} setActor={setActor} />} />
                    <Route path="/dashboard" element={<Dashboard principalId={principalId} actor={actor} />} />
                    <Route path="/create" element={<CreateRequest actor={actor} principalId={principalId}/>} />
                </Routes>
            </BrowserRouter>
        </ChakraProvider>
    );
}

export default App;