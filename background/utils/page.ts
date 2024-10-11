import { stringDoesNotContainAnyFromArray } from './helpers';
import {postToAPI} from  './user.ts'
interface tabInfo {
    status?: string;
}
interface TabRemoveInfo {
    windowId: number;
    isWindowClosing: boolean;
  }
interface Tab {
    url?: string;
}
interface user {
    address:string;
    token: string;
    points?: number;
}
interface StorageData {
    user?: user
}

interface PageResponse {
    content?: string;
    title?: string;
}

interface DataToSend {
    content?: string;
    title?: string;
    url?: string;
    user?: user;
}

export function newPage(tabId: number, changeInfo: tabInfo, tab: Tab): void {
    if (changeInfo.status === 'complete' && tab.url && stringDoesNotContainAnyFromArray(tab.url)) {
        chrome.storage.local.get('user', function(storageData: StorageData) {
            console.log('storage data', storageData)
            if (storageData.user) {
                console.log("is new page import sucesss?", {tab: tab, change: changeInfo, tabid: tabId})
                chrome.tabs.sendMessage((tab as any).id, { action: "getPageContent" }, function(response: PageResponse) {
                    if (chrome.runtime.lastError) {
                        console.error("Error sending message to content script:", chrome.runtime.lastError);
                        return;
                    }
                    if (response) {
                        console.log("recieved response in background.js", response)
                        const dataToSend: DataToSend = {
                            content: response?.content,
                            title: response.title,
                            url: tab.url!,
                            user: storageData.user
                        };
                        postToAPI(
                            {
                                history: [dataToSend],
                                address: (storageData.user as any).id,
                                signup: false,
                            },
                            (storageData.user as any).token
                        );
                        // Send the combined data to the API
                        console.log("new page content", dataToSend)
                    } else {
                        console.error("Failed to retrieve page content or title.");
                    }
                });
            }
        });
    }
}