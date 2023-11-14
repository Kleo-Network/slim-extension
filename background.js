//  console.log('Background script running!');
//  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//     console.log("Received message:", request);
// });
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
                    user_id: storageData.user_id
                });
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
    console.log("message sent with request", request);
    console.log("message is sent");
    if (request.type == 'KLEO_UPLOAD_PREVIOUS_HISTORY') {
      // Execute the functionality you want here
      // console.log("KLEO UPLOAD HISTORY CALLED?")
      chrome.storage.local.get('user_id', function(result) {
        if (!result.user_id) {
                console.log("request", request);
                const userId = request.address;
                chrome.storage.local.set({ user_id: userId }, function() {
                    console.log("user_id saved:", userId);
                });
            }
        });
       storeAllPreviousHistory();
    }
  });


chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete' && tab.url && stringDoesNotContainAnyFromArray(tab.url)) {
        console.log("tab url is accessible?", tab.url);
        console.log("tab title is accessible", tab.title);
        chrome.storage.local.get('user_id', function(storageData) {
            if (storageData.user_id) {
                const historyData = {
                    id: tabId.toString(),
                    url: tab.url,
                    title: tab.title || "",
                    lastVisitTime: Date.now(),
                    visitTime: Date.now(),
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

