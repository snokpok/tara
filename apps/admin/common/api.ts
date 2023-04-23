import { createContext, useContext } from "react";
import { APIClient } from "@tara/api-client-ts";

export const useAPIClient = () => {
    const client = useContext(APIClientContext);
    return client;
}

export const URL = 'http://localhost:3333'
export const apiClient = new APIClient(URL);

export const APIClientContext = createContext<APIClient>(null);