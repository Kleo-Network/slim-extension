
const PRODUCTION = 'https://api.kleo.network/api/v1/core';
// const PRODUCTION = 'http://127.0.0.1:5001/api/v1/core';
function stringDoesNotContainAnyFromArray(str) {
    const array = ["newtab","localhost"]

    for (let i = 0; i < array.length; i++) {
        if (str.includes(array[i])) {
            return false; // 'str' contains an element from the array
        }
    }
    return true; // 'str' does not contain any elements from the array
}

async function postToAPI(data, authToken) {
    const apiEndpoint = `${PRODUCTION}/history/upload`;
   
    try {
        const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${authToken}`
            },
            body: JSON.stringify(data)
        });
      
        const responseData = await response.text();
        console.log("response:", responseData);

    } catch (error) {
        console.error("Error sending data:", error);
    }
}

async function getPendingCardCountForUser(slug, authToken) {
    const apiEndpoint = `${PRODUCTION}/cards/pending/${slug}`;
    try {
        const response = await fetch(apiEndpoint, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${authToken}`
            }
        });
        const data = await response.json()
        return data.length
    } catch (error) {
        console.error("Error fetching pending card count for user: ",slug);
    }
}

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
    console.log("storeAllPreviousHistoryCalled?");
    const numberOfDays = 5;
    storeDayHistory(numberOfDays);
    
}

let notificationCount = 0;

// Function to update badge text
function updateBadge(count) {
    chrome.action.setBadgeBackgroundColor({ color: [255, 255, 255, 255] }); // Set badge background color to white
    chrome.action.setBadgeTextColor({ color: '#8a2be2' });
    chrome.action.setBadgeText({ text: count > 0 ? count.toString() : "" });
}

chrome.runtime.onStartup.addListener(() => {
    chrome.storage.local.get('user_id',async function(storageData) {
        if (storageData.user_id) {
            const count = await getPendingCardCountForUser(storageData.user_id.id, storageData.user_id.token);
            updateBadge(count);
        }
    });
  });

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log(request)
    if (request.type == 'KLEO_UPLOAD_PREVIOUS_HISTORY') {
      // Execute the functionality you want here
      console.log("KLEO UPLOAD HISTORY CALLED?")
      const userData = { 'id': request.address ,'token': request.token };
      chrome.storage.local.set({ 'user_id': userData });
      chrome.storage.local.get(function(result){console.log(result)});
      storeAllPreviousHistory();
    }
    else if(request.type == 'KLEO_SIGN_IN') {
         // Execute the functionality you want here
      const userData = { 'id': request.address ,'token': request.token };
      chrome.storage.local.set({ 'user_id': userData });
      chrome.storage.local.get(function(result){console.log(result)});
    }
    else if(request.type == 'UPDATE_NOTIFICATION_COUNTER') {
        const counter = request.counter;
        updateBadge(counter);
    }
  });


chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete' && tab.url && stringDoesNotContainAnyFromArray(tab.url)) {
       
        chrome.storage.local.get('user_id', function(storageData) {
            if (storageData.user_id) {
                const historyData = {
                    id: tabId.toString(),
                    url: tab.url,
                    title: tab.title || "",
                    lastVisitTime: Date.now(),
                    visitTime: Date.now()
                };
                postToAPI({
                    history: [historyData],
                    slug: storageData.user_id.id 
                }, storageData.user_id.token);
            }
        });
    }
});

