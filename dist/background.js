"use strict";
console.log('Background script running!');
chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension installed!');
});
chrome.action.onClicked.addListener((tab) => {
    console.log('Extension icon clicked in tab:', tab.id);
});
//# sourceMappingURL=background.js.map