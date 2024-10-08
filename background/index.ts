console.log("background is working!");
import { initializeUser } from './utils/user.ts'
import { newPage } from './utils/page.ts'

// Get Previous Browsing History for classification.
chrome.runtime.onInstalled.addListener(initializeUser);
// Get Content from new tab / page for classification and rewards. 
//chrome.tabs.onUpdated.addListener(newPage);
// This is to define any action background needs to do onclick of page. 
// chrome.runtime.onMessage.addListener(function(request,sender,sendResponse) {
//     console.log(request);
    
// });




// chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
//     if (changeInfo.status === 'complete' && tab.url && stringDoesNotContainAnyFromArray(tab.url)) {
//       chrome.storage.local.get('user_id', function(storageData) {
//         if (storageData.user_id) {
//           chrome.tabs.sendMessage(tabId, { action: "getPageContent" }, function(response) {
//             if (chrome.runtime.lastError) {
//               console.error("Error sending message to content script:", chrome.runtime.lastError);
//               return;
//             }
//             if (response && response.content !== undefined && response.title !== undefined) {
//               const dataToSend = {
//                 content: response.content,
//                 title: response.title,
//                 url: tab.url,
//                 slug: storageData.user_id.id
//               };
//               // Send the combined data to the API
//               postToAPI(dataToSend, storageData.user_id.token);
//             } else {
//               console.error("Failed to retrieve page content or title.");
//             }
//           });
//         }
//       });
//     }
//   });

  


// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//     console.log(request)
//     if(request.type == 'KLEO_SIGN_IN') {
//       const userData = { 'id': request.address ,'token': request.token };
//       chrome.storage.local.set({ 'user_id': userData });
//       chrome.storage.local.get(function(result){console.log(result)});
//     }
    
//   });


// // chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
// //     if (changeInfo.status === 'complete' && tab.url && stringDoesNotContainAnyFromArray(tab.url)) {
       
// //         chrome.storage.local.get('user_id', function(storageData) {
// //             if (storageData.user_id) {
// //                 const historyData = {
// //                     id: tabId.toString(),
// //                     url: tab.url,
// //                     title: tab.title || "",
// //                     lastVisitTime: Date.now(),
// //                     visitTime: Date.now()
// //                 };
// //                 postToAPI({
// //                     history: [historyData],
// //                     slug: storageData.user_id.id 
// //                 }, storageData.user_id.token);
// //             }
// //         });
// //     }
// // });

