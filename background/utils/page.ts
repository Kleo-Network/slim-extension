import { stringDoesNotContainAnyFromArray } from './helpers';

interface ChangeInfo {
    status?: string;
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
    content: string;
    title: string;
    url: string;
    user?: user;
}

export function newPage(tabId: number, changeInfo: ChangeInfo, tab: Tab): void {
    if (changeInfo.status === 'complete' && tab.url && stringDoesNotContainAnyFromArray(tab.url)) {
        chrome.storage.local.get('user', function(storageData: StorageData) {
            if (storageData.user) {
                chrome.tabs.sendMessage(tabId, { action: "getPageContent" }, function(response: PageResponse) {
                    if (chrome.runtime.lastError) {
                        console.error("Error sending message to content script:", chrome.runtime.lastError);
                        return;
                    }
                    if (response && response.content !== undefined && response.title !== undefined) {
                        const dataToSend: DataToSend = {
                            content: response.content,
                            title: response.title,
                            url: tab.url!,
                            user: storageData.user
                        };
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