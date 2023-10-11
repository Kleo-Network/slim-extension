console.log('Background script running!');

// Data types

type HistoryBatch = {
    history: chrome.history.HistoryItem[];
    user_id: string;
};

// Function to generate a UUID
function generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Function to post data to the API
async function postToAPI(data: HistoryBatch) {
    const apiEndpoint = 'http://127.0.0.1:5001/api/v1/core/history/upload';

    try {
        const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const responseData = await response.json();
        console.log("Data successfully sent:", JSON.stringify(responseData));

    } catch (error) {
        console.error("Error sending data:", error);
    }
}

// Function to store history for a given day
function storeDayHistory(day: number): void {
    const startTime = (new Date().getTime()) - (day * 24 * 60 * 60 * 1000);
    const endTime = startTime + (24 * 60 * 60 * 1000);

    chrome.history.search({
        text: '',
        startTime: startTime,
        endTime: endTime,
        maxResults: 1000
    },function (results: chrome.history.HistoryItem[]) {
        chrome.storage.local.get('user_id', function(storageData) {
            if (storageData.user_id) {
                postToAPI({
                    history: results.filter(item => item.url && item.title), // Filter out items without url or title
                    user_id: storageData.user_id
                });
            }
        });
    });
}

// Function to store all previous history
function storeAllPreviousHistory(): void {
    const numberOfDays = 365;
    for (let i = 1; i <= numberOfDays; i++) {
        storeDayHistory(i);
    }
}

// Listener for when the extension is installed
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === "install") {
        // Check if user_id is already generated, if not, generate one.
        chrome.storage.local.get('user_id', function(result) {
            if (!result.user_id) {
                const userId = generateUUID();
                chrome.storage.local.set({ user_id: userId }, function() {
                    console.log("user_id saved:", userId);
                });
            }
        });

        storeAllPreviousHistory();
    }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url) {
        chrome.storage.local.get('user_id', function(storageData) {
            if (storageData.user_id) {
                const historyData: chrome.history.HistoryItem = {
                    id: tabId.toString(),
                    url: tab.url,
                    title: tab.title || "",
                    lastVisitTime: Date.now(),
                    typedCount: 0, // These are defaults; you can modify them as needed
                    visitCount: 1
                };

                postToAPI({
                    history: [historyData],
                    user_id: storageData.user_id
                });
            }
        });
    }
});


chrome.action.onClicked.addListener((tab) => {
    chrome.tabs.create({ url: "https://app.kleo.network/" });
});
