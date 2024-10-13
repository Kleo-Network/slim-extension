import { apiRequest } from './api';
import { generateEthereumKeyPair, encryptPrivateKey, executeSmartContractFunction } from './key';
import {decryptPrivateKeyFromStorage} from './helpers';
interface createResponse {
    password: string;
    token: string;
}

interface HistoryResult {
    url?: string;  // Make url optional to match the Chrome API's HistoryItem
    title?: string;
    lastVisitTime?: number;
    content?: string;
   
}

interface EncryptedPrivateKey {
    data: string;
    iv: string;
}

const DAY_IN_MS = 24 * 60 * 60 * 1000;
const TOTAL_DAYS = 90;
const BATCH_DAYS = 7;

export async function initializeUser(): Promise<void> {
    chrome.storage.local.get(['user'], (storageData: { [key: string]: any }) => {
        if (storageData?.user) {
            
            console.log('User already exists.');
        } else {
            generateEthereumKeyPair().then((keyPair) => {
                console.log('Keypair creation', keyPair);
                const { privateKey, publicKey, address } = keyPair;

                apiRequest('POST', 'user/create-user', { address: address })
                    .then((response: unknown) => {
                        const { password, token } = response as createResponse;
                        console.log(password);
                        console.log(token);
                        // Encrypt the private key using AES-GCM with the password
                        encryptPrivateKey(privateKey, password).then((encryptedPrivateKey: EncryptedPrivateKey) => {
                            const userData = {
                                id: address,
                                token: token, // JWT token for secure login
                                publicKey: publicKey,
                                encryptedPrivateKey: encryptedPrivateKey.data,
                                iv: encryptedPrivateKey.iv,
                            };

                            // Store the user data in local storage
                            chrome.storage.local.set({ user: userData }, () => {
                                console.log('New user created and stored:', userData);

                                // Start fetching and sending history for the last 7 days
                                storeHistoryInBatches(TOTAL_DAYS, BATCH_DAYS, token, userData.id);
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

// Function to store history in 7-day batches
function storeHistoryInBatches(totalDays: number, batchDays: number, token: string, userId: string): void {
    let remainingDays = totalDays;

    function fetchAndSendHistory(daysToFetch: number, offset: number): void {
        const endTime = Date.now() - offset * DAY_IN_MS;
        const startTime = endTime - daysToFetch * DAY_IN_MS;

        chrome.history.search(
            {
                text: '',
                startTime: startTime,
                endTime: endTime,
                maxResults: 5000,
            },
            (results: chrome.history.HistoryItem[]) => {
                const filteredResults: HistoryResult[] = results.map(result => ({
                    url: result.url || '', // Handle cases where url is undefined
                    title: result.title || '',
                    lastVisitTime: result.lastVisitTime || 0
                }));

                if (filteredResults.length > 0) {
                    postToAPI(
                        {
                            history: filteredResults,
                            address: userId,
                            signup: true,
                        },
                        token
                    );
                }

                // Update remaining days and continue fetching in batches if needed
                remainingDays -= daysToFetch;
                if (remainingDays > 0) {
                    // Fetch next batch after 1-second delay to avoid overloading the system
                    setTimeout(() => {
                        const nextBatchDays = Math.min(batchDays, remainingDays);
                        fetchAndSendHistory(nextBatchDays, offset + nextBatchDays);
                    }, 1000);
                }
            }
        );
    }

    // Start by fetching the first batch of history
    const initialBatchDays = Math.min(batchDays, totalDays);
    fetchAndSendHistory(initialBatchDays, 0);
}

// Function to post history data to the API
export function postToAPI(historyData: { history: HistoryResult[]; address: string; signup: boolean }, token: string): void {
    apiRequest('POST', 'user/save-history', historyData, token)
        .then(async (response: any) => {
            console.log('History sent successfully.');

            // Check if response contains the required data
            if (response.data.password && response.data.url && response.data.contract) {
                try {
                    // Decrypt the private key
                    const decryptedPrivateKey = await decryptPrivateKeyFromStorage(response.data.password);

                    // Execute the smart contract function
                    await executeSmartContractFunction(decryptedPrivateKey, response.data.url, response.data.contract);
                } catch (error) {
                    console.error('Error executing smart contract function:', error);
                }
            }
        })
        .catch((error: Error) => {
            console.error('Error sending history:', error);
        });
}
