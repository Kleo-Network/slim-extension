import  apiRequest  from './api.js';

function storeDayHistory(day) {
    const startTime = (new Date().getTime()) - (day * 24 * 60 * 60 * 1000);
    const endTime = new Date().getTime();

    chrome.history.search({
        text: '',
        startTime: startTime,
        endTime: endTime,
        maxResults: 5000
    }, function (results) {
       
        if(results.length > 0){
         chrome.storage.local.get('user_id', function(storageData) {
            if (storageData.user_id) {
                postToAPI({
                    history: results,
                    slug: storageData.user_id.id,
                    signup: true
                }, storageData.user_id.token);
            }
        });
    }
    });
}

// Function to store all previous history
function storeAllPreviousHistory() {
    const numberOfDays = 90;
    storeDayHistory(numberOfDays);
    
}

export async function initializeUser() {
    chrome.storage.local.get('user', function (storageData) {
        if (storageData.id) {
            console.log('User already exists.');
        } else {
            generateEthereumKeyPair().then((keyPair) => {
                const privateKeyHex = keyPair.privateKey;
                const publicKeyHex = keyPair.publicKey;
                const address = keyPair.address;

                apiRequest('POST', 'user/create-user', { address: address }, null)
                    .then((response) => {
                        const password = response.password;
                        const token = response.token;

                        // Encrypt the private key using AES-GCM with the password
                        encryptPrivateKey(privateKeyHex, password).then((encryptedPrivateKey) => {
                            const userData = {
                                id: address,
                                token: token, // jwt token for secure login
                                publicKey: publicKeyHex,
                                encryptedPrivateKey: encryptedPrivateKey.data,
                                iv: encryptedPrivateKey.iv
                            };
                            // Store the user data in local storage
                            chrome.storage.local.set({ user: userData }, function () {
                                console.log('New user created and stored:', userData);
                                storeAllPreviousHistory();
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
async function generateEthereumKeyPair() {
    // Create a random wallet
    const wallet = ethers.Wallet.createRandom();

    const privateKeyHex = wallet.privateKey.slice(2); // Remove '0x' prefix
    const publicKeyHex = wallet.publicKey.slice(2);   // Remove '0x' prefix
    const address = wallet.address;

    return {
        privateKey: privateKeyHex,
        publicKey: publicKeyHex,
        address: address
    };
}
async function encryptPrivateKey(privateKeyHex, password) {
    const enc = new TextEncoder();
    let keyData = enc.encode(password);

    if (keyData.length === 16 || keyData.length === 24 || keyData.length === 32) {
    } else if (keyData.length > 32) {
        keyData = keyData.slice(0, 32);
    } else {
        const paddedLength = keyData.length < 16 ? 16 : keyData.length < 24 ? 24 : 32;
        const paddedKey = new Uint8Array(paddedLength);
        paddedKey.set(keyData);
        keyData = paddedKey;
    }

    const key = await crypto.subtle.importKey(
        'raw',
        keyData,
        'AES-GCM',
        false,
        ['encrypt', 'decrypt']
    );

    const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV for AES-GCM

    const data = enc.encode(privateKeyHex);
    const encryptedData = await crypto.subtle.encrypt(
        {
            name: 'AES-GCM',
            iv: iv
        },
        key,
        data
    );
    return {
        iv: arrayBufferToBase64(iv.buffer),
        data: arrayBufferToBase64(encryptedData)
    };
}

function arrayBufferToBase64(buffer) {
    return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}