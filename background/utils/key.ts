// Make sure to include ethers.js in your project
// You can include it via CDN in your HTML file or install it via npm

async function checkPrivateKeyAndCreateUser() {
    // Check if private key exists in storage
    chrome.storage.local.get('private_key', async function(storageData) {
        if (storageData.private_key) {
            console.log('Private key exists');
            // Proceed with existing private key
        } else {
            console.log('Private key does not exist, generating a new one');
            // Generate a new private key
            const wallet = ethers.Wallet.createRandom();
            const privateKey = wallet.privateKey;
            const publicKey = wallet.address;

            // Store the private key securely
            chrome.storage.local.set({ 'private_key': privateKey }, function() {
                console.log('Private key stored in storage');
            });

            // Create a new user by hitting the specific API with the public key
            const apiEndpoint = 'YOUR_API_ENDPOINT'; // Replace with your API endpoint

            try {
                const response = await fetch(apiEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        public_key: publicKey
                    })
                });
                const responseData = await response.json();
                console.log('User created:', responseData);
            } catch (error) {
                console.error('Error creating user:', error);
            }
        }
    });
}

async function executeTransaction() {
    // Retrieve the private key from storage
    chrome.storage.local.get('private_key', async function(storageData) {
        if (storageData.private_key) {
            const privateKey = storageData.private_key;

            // Define the custom network
            const customNetwork = {
                name: 'Vana Moksha Testnet',
                chainId: 14800,
            };

            // Initialize the provider with your custom RPC URL
            const provider = new ethers.providers.JsonRpcProvider('YOUR_RPC_URL', customNetwork); // Replace with your RPC URL

            // Initialize the wallet with the provider
            const wallet = new ethers.Wallet(privateKey, provider);

            // Smart contract address and ABI
            const contractAddress = 'SMART_CONTRACT_ADDRESS'; // Replace with your contract's address
            const contractABI = [
                // Replace with your contract's ABI
                // For example, the ABI for the addFile function might look like this:
                "function addFile(string memory fileHash) public returns (bool)"
            ];

            // Initialize the contract instance
            const contract = new ethers.Contract(contractAddress, contractABI, wallet);

            try {
                // Call the addFile function
                const fileHash = 'YOUR_FILE_HASH'; // Replace with the actual file hash or data
                const transactionResponse = await contract.addFile(fileHash, {
                    gasLimit: ethers.utils.hexlify(100000), // Adjust gas limit as needed
                    gasPrice: await provider.getGasPrice(),
                });
                console.log('Transaction sent:', transactionResponse);

                // Wait for the transaction to be mined
                const receipt = await transactionResponse.wait();
                console.log('Transaction mined:', receipt);
            } catch (error) {
                console.error('Error executing transaction:', error);
            }
        } else {
            console.error('Private key not found in storage');
        }
    });
}

