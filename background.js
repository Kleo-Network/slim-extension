// Define API endpoints
//const PRODUCTION = 'https://api.kleo.network/api/v1/core';
const LOCAL = 'http://127.0.0.1:5001/api/v1/core';

// Object to store tab information
let tabInfo = {};

function stringDoesNotContainAnyFromArray(str) {
    const array = ["newtab", "localhost"];
    for (let i = 0; i < array.length; i++) {
        if (str.includes(array[i])) {
            return false;
        }
    }
    return true;
}

async function postToAPI(data, authToken) {
    const apiEndpoint = `${LOCAL}/history/upload`;
    try {
        const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authToken
            },
            body: JSON.stringify(data)
        });
        const responseData = await response.text();
        console.log("response:", responseData);
    } catch (error) {
        console.error("Error sending data:", error);
    }
}

function storeDayHistory(day) {
    // Existing implementation for storing day history
    const startTime = (new Date().getTime()) - (day * 24 * 60 * 60 * 1000);
    const endTime = startTime + (24 * 60 * 60 * 1000);
    chrome.history.search({
        text: '',
        startTime: startTime,
        endTime: endTime,
        maxResults: 5000
    }, function (results) {
        if (results.length > 0) {
            chrome.storage.local.get('user_id', function (storageData) {
                if (storageData.user_id) {
                    postToAPI({
                        history: results,
                        user_id: storageData.user_id.id,
                        signup: true
                    }, storageData.user_id.token);
                }
            });
        }
    });
}

function storeAllPreviousHistory() {
    // Existing implementation for storing all previous history
    console.log("storeAllPreviousHistoryCalled?");
    const numberOfDays = 365;
    for (let i = 1; i <= numberOfDays; i++) {
        storeDayHistory(i);
    }
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    // Existing implementation for message listener
    if (request.type == 'KLEO_UPLOAD_PREVIOUS_HISTORY') {
        console.log("KLEO UPLOAD HISTORY CALLED?");
        const userData = { 'id': request.address, 'token': request.token };
        chrome.storage.local.set({ 'user_id': userData });
        chrome.storage.local.get(function(result){console.log(result)});
        storeAllPreviousHistory();
    }
});

// Update tab info when a tab is activated or updated
function updateTabInfo(tabId, isActive) {
    if (!tabInfo[tabId]) {
        tabInfo[tabId] = { activated: 0, duration: 0 };
    }
    if (isActive) {
        tabInfo[tabId].activated = Date.now();
    } else if (tabInfo[tabId].activated !== 0) {
        tabInfo[tabId].duration += Date.now() - tabInfo[tabId].activated;
        tabInfo[tabId].activated = 0;  // Reset activation time
    }
}

// Listen for tab activation and update info
chrome.tabs.onActivated.addListener(activeInfo => {
    Object.keys(tabInfo).forEach(tabId => {
        updateTabInfo(parseInt(tabId), parseInt(tabId) === activeInfo.tabId);
    });
});

// Listen for tab updates and save data if URL changes
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tab.url && stringDoesNotContainAnyFromArray(tab.url)) {
        updateTabInfo(tabId, true);
        setTimeout(() => {
            chrome.tabs.get(tabId, updatedTab => {
                saveTabData(updatedTab);
            });
        }, 1000);
    }
});

// Listen for tab removal and update info
chrome.tabs.onRemoved.addListener(tabId => {
    updateTabInfo(tabId, false);
});

// Save tab data with duration
function saveTabData(tab) {
    setTimeout(() => {
        chrome.tabs.sendMessage(tab.id, {action: "GET_PAGE_CONTENT"}, function(response) {
            console.log('response content', response.content)
            console.log('tabInfo duration', tabInfo[tab.id])
        });
    }, 500);
   
    chrome.storage.local.get('user_id', function(storageData) {
        if (storageData.user_id) { 
            chrome.tabs.sendMessage(tab.id, {action: "GET_PAGE_CONTENT"}, function(response) {
                const historyData = {
                    id: tab.id.toString(),
                    url: tab.url,
                    title: tab.title || "",
                    lastVisitTime: Date.now(),
                    visitTime: Date.now(),
                    duration: tabInfo[tab.id].duration, // Duration in milliseconds
                    content: response.content // This will be the page content
                };
                postToAPI({
                    history: [historyData],
                    user_id: storageData.user_id.id
                }, storageData.user_id.token);
            });
        }
    });
}