// Make sure to include ethers.js in your project
// You can include it via CDN in your HTML file or install it via npm
import { ethers } from "ethers";

export async function generateEthereumKeyPair() {
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
export async function encryptPrivateKey(privateKeyHex, password) {
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


// export async function executeTransaction() {
//     // Retrieve the private key from storage
//     chrome.storage.local.get('private_key', async function(storageData) {
//         if (storageData.private_key) {
//             const privateKey = storageData.private_key;

//             // Define the custom network
//             const customNetwork = {
//                 name: 'Vana Moksha Testnet',
//                 chainId: 14800,
//             };

//             // Initialize the provider with your custom RPC URL
//             const provider = new ethers.providers.JsonRpcProvider('YOUR_RPC_URL', customNetwork); // Replace with your RPC URL

//             // Initialize the wallet with the provider
//             const wallet = new ethers.Wallet(privateKey, provider);

//             // Smart contract address and ABI
//             const contractAddress = 'SMART_CONTRACT_ADDRESS'; // Replace with your contract's address
//             const contractABI = [
//                 // Replace with your contract's ABI
//                 // For example, the ABI for the addFile function might look like this:
//                 "function addFile(string memory fileHash) public returns (bool)"
//             ];

//             // Initialize the contract instance
//             const contract = new ethers.Contract(contractAddress, contractABI, wallet);

//             try {
//                 // Call the addFile function
//                 const fileHash = 'YOUR_FILE_HASH'; // Replace with the actual file hash or data
//                 const transactionResponse = await contract.addFile(fileHash, {
//                     gasLimit: ethers.utils.hexlify(100000), // Adjust gas limit as needed
//                     gasPrice: await provider.getGasPrice(),
//                 });
//                 console.log('Transaction sent:', transactionResponse);

//                 // Wait for the transaction to be mined
//                 const receipt = await transactionResponse.wait();
//                 console.log('Transaction mined:', receipt);
//             } catch (error) {
//                 console.error('Error executing transaction:', error);
//             }
//         } else {
//             console.error('Private key not found in storage');
//         }
//     });
// }

