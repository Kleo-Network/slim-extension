
import apiRequest from './utils/api.js';
// import {initializeUser} from './utils/user.js'

function stringDoesNotContainAnyFromArray(str) {
    const array = ["newtab","localhost"]

    for (let i = 0; i < array.length; i++) {
        if (str.includes(array[i])) {
            return false; // 'str' contains an element from the array
        }
    }
    return true; // 'str' does not contain any elements from the array
}





chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete' && tab.url && stringDoesNotContainAnyFromArray(tab.url)) {
      chrome.storage.local.get('user_id', function(storageData) {
        if (storageData.user_id) {
          chrome.tabs.sendMessage(tabId, { action: "getPageContent" }, function(response) {
            if (chrome.runtime.lastError) {
              console.error("Error sending message to content script:", chrome.runtime.lastError);
              return;
            }
            if (response && response.content !== undefined && response.title !== undefined) {
              const dataToSend = {
                content: response.content,
                title: response.title,
                url: tab.url,
                slug: storageData.user_id.id
              };
              // Send the combined data to the API
              postToAPI(dataToSend, storageData.user_id.token);
            } else {
              console.error("Failed to retrieve page content or title.");
            }
          });
        }
      });
    }
  });

  

chrome.runtime.onInstalled.addListener(apiRequest);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log(request)
    if(request.type == 'KLEO_SIGN_IN') {
      const userData = { 'id': request.address ,'token': request.token };
      chrome.storage.local.set({ 'user_id': userData });
      chrome.storage.local.get(function(result){console.log(result)});
    }
    
  });


// chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
//     if (changeInfo.status === 'complete' && tab.url && stringDoesNotContainAnyFromArray(tab.url)) {
       
//         chrome.storage.local.get('user_id', function(storageData) {
//             if (storageData.user_id) {
//                 const historyData = {
//                     id: tabId.toString(),
//                     url: tab.url,
//                     title: tab.title || "",
//                     lastVisitTime: Date.now(),
//                     visitTime: Date.now()
//                 };
//                 postToAPI({
//                     history: [historyData],
//                     slug: storageData.user_id.id 
//                 }, storageData.user_id.token);
//             }
//         });
//     }
// });

