import {apiRequest} from './api'
import {generateEthereumKeyPair, encryptPrivateKey} from './key'
interface createResponse {
    password: string;
    token: string;
}
export async function initializeUser() {
    chrome.storage.local.get('user', function (storageData) {
        if (storageData.user) {
            console.log('User already exists.');
        } else {
            generateEthereumKeyPair().then((keyPair) => {
                console.log("keypair creation", keyPair)
                const {privateKey, publicKey, address} = keyPair;
                
                apiRequest('POST', 'user/create-user', { address: address })
                    .then((response: unknown) => {
                        const { password, token } = response as createResponse;

                        // Encrypt the private key using AES-GCM with the password
                        encryptPrivateKey(privateKey, password).then((encryptedPrivateKey) => {
                            const userData = {
                                id: address,
                                token: token, // jwt token for secure login
                                publicKey: publicKey,
                                encryptedPrivateKey: encryptedPrivateKey.data,
                                iv: encryptedPrivateKey.iv
                            };
                            // Store the user data in local storage
                            chrome.storage.local.set({ user: userData }, function () {
                                console.log('New user created and stored:', userData);
                                //storeAllPreviousHistory();
                            });
                        });
                    })
                    .catch((error) => {
                        console.error('Error creating user:', error);
                    });
            });
        }
    });
}
// import  apiRequest  from './api.js';

// function storeDayHistory(day) {
//     const startTime = (new Date().getTime()) - (day * 24 * 60 * 60 * 1000);
//     const endTime = new Date().getTime();

//     chrome.history.search({
//         text: '',
//         startTime: startTime,
//         endTime: endTime,
//         maxResults: 5000
//     }, function (results) {
       
//         if(results.length > 0){
//          chrome.storage.local.get('user_id', function(storageData) {
//             if (storageData.user_id) {
//                 postToAPI({
//                     history: results,
//                     slug: storageData.user_id.id,
//                     signup: true
//                 }, storageData.user_id.token);
//             }
//         });
//     }
//     });
// }

// // Function to store all previous history
// function storeAllPreviousHistory() {
//     const numberOfDays = 90;
//     storeDayHistory(numberOfDays);
    
// }


