
const PRODUCTION = 'https://api.kleo.network/api/v1/core';
const LOCAL = 'http://127.0.0.1:5001/api/v1/core';

function stringDoesNotContainAnyFromArray(str) {
    const array = ["newtab","localhost"]
    // Check each element in the array to see if it's a substring of 'str'
    for (let i = 0; i < array.length; i++) {
        if (str.includes(array[i])) {
            return false; // 'str' contains an element from the array
        }
    }
    return true; // 'str' does not contain any elements from the array
}
// Function to post data to the API
async function postToAPI(data, authToken) {
    const apiEndpoint = `${LOCAL}/history/upload`;
   
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
        console.log("Data successfully sent:", responseData);

    } catch (error) {
        console.error("Error sending data:", error);
    }
}

// Function to store history for a given day
function storeDayHistory(day) {
    // if(day == 1) create a case separately for this, this right now misalings the data!
    const startTime = (new Date().getTime()) - (day * 24 * 60 * 60 * 1000);
    const endTime = startTime + (24 * 60 * 60 * 1000);

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
                    user_id: storageData.user_id.id,
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
    const numberOfDays = 365;
    for (let i = 1; i <= numberOfDays; i++) {
        storeDayHistory(i);
    }
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type == 'KLEO_UPLOAD_PREVIOUS_HISTORY') {
        //alert("hello");
        //alert("request")
      // Execute the functionality you want here
      // console.log("KLEO UPLOAD HISTORY CALLED?")
    //   chrome.storage.local.get('user_id', function(result) {
    //     if (!result.user_id) {
                console.log("request", request);
                const userData = { 'id': request.address ,'token': request.token };
                chrome.storage.local.set({ user_id: userData });
                
        //     }
        // });
       storeAllPreviousHistory();
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
                    user_id: storageData.user_id.id 
                }, storageData.user_id.token);
            }
        });
    }
});

