// utils/api.js

//const PRODUCTION = 'https://api.kleo.network/api/v1/core';
//const PRODUCTION = 'http://127.0.0.1:5001/api/v1/core';

// General API helper function
//method, endpoint, data, authToken
export default async function apiRequest() {
    console.log("hello world?")
    chrome.storage.local.get('user_id', function(storageData) {
        console.log("storage data", storageData);
    });
    // const apiEndpoint = `${PRODUCTION}/${endpoint}`;
    // const headers = {
    //     'Content-Type': 'application/json',
    // };
    // if (authToken) {
    //     headers['Authorization'] = `${authToken}`;
    // }

    // const options = {
    //     method: method,
    //     headers: headers,
    // };

    // if (data) {
    //     options.body = JSON.stringify(data);
    // }

    // try {
    //     const response = await fetch(apiEndpoint, options);
    //     const responseData = await response.text(); // Or use response.json() if the response is JSON
    //     console.log("response:", responseData);
    //     return responseData;
    // } catch (error) {
    //     console.error("Error in API request:", error);
    //     throw error;
    // }
}
