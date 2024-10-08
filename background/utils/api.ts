// utils/api.ts

//const PRODUCTION = 'https://api.kleo.network/api/v1/core';
const PRODUCTION = 'http://127.0.0.1:5001/api/v2/core';

// Define types for the parameters
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface RequestOptions extends RequestInit {
    headers: Record<string, string>;
    body?: string;
}

// General API helper function
export async function apiRequest(
    method: HttpMethod,
    endpoint: string,
    data?: unknown,
    authToken?: string
): Promise<string> {
    const apiEndpoint = `${PRODUCTION}/${endpoint}`;
    
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    if (authToken) {
        headers['Authorization'] = `${authToken}`;
    }

    const options: RequestOptions = {
        method,
        headers,
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(apiEndpoint, options);
        const responseData = await response.json(); // Or use response.json() if the response is JSON
        console.log("response:", responseData);
        return responseData;
    } catch (error) {
        console.error("Error in API request:", error);
        throw error;
    }
}