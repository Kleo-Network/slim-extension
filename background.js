 console.log('Background script running!');

// // Function to generate a UUID
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Function to post data to the API
async function postToAPI(data) {
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
function storeDayHistory(day) {
    const startTime = (new Date().getTime()) - (day * 24 * 60 * 60 * 1000);
    const endTime = startTime + (24 * 60 * 60 * 1000);

    chrome.history.search({
        text: '',
        startTime: startTime,
        endTime: endTime,
        maxResults: 1000
    }, function (results) {
        console.log("results?", results);
        if(results.length > 0){
        chrome.storage.local.get('user_id', function(storageData) {
            if (storageData.user_id) {
                postToAPI({
                    history: results,
                    user_id: storageData.user_id
                });
            }
        });
    }
    });
}

// Function to store all previous history
function storeAllPreviousHistory() {
    const numberOfDays = 365;
    for (let i = 1; i <= numberOfDays; i++) {
        storeDayHistory(i);
    }
}

// Listener for when the extension is installed
chrome.runtime.onInstalled.addListener(function(details) {
    console.log("details", details);
    if (details.reason === "install" || details.reason === "update") {
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

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete' && tab.url) {
        chrome.storage.local.get('user_id', function(storageData) {
            if (storageData.user_id) {
                const historyData = {
                    id: tabId.toString(),
                    url: tab.url,
                    title: tab.title || "",
                    lastVisitTime: Date.now(),
                    typedCount: 0,
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

// chrome.action.onClicked.addListener(function(tab) {
//     chrome.tabs.create({ url: "https://app.kleo.network/" });
// });
