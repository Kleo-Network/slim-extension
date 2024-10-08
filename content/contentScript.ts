// Define types for custom events
interface ExtensionIdEventDetail {
    extensionId: string;
}

// Define types for message events
interface KleoMessage {
    type: 'KLEO_UPLOAD_PREVIOUS_HISTORY' | 'KLEO_SIGN_IN' | 'UPDATE_NOTIFICATION_COUNTER';
    [key: string]: any; // For any additional properties in the message
}

// Define type for chrome runtime message
interface ChromeMessage {
    action: string;
    [key: string]: any;
}

function dispatchCustomEvent<T>(eventName: string, detail: T): void {
    document.dispatchEvent(new CustomEvent<T>(eventName, { detail }));
}

function injectScript(file: string): void {
    const script: HTMLScriptElement = document.createElement("script");
    script.setAttribute("type", "text/javascript");
    script.setAttribute("src", file);
    
    // Dispatch the event after the script is loaded
    script.onload = (): void => {
        dispatchCustomEvent<ExtensionIdEventDetail>("ExtensionIdEvent", { 
            extensionId: chrome.runtime.id 
        });
    };

    document.head.appendChild(script);
}

window.addEventListener("message", function(event: MessageEvent) {
    // We only accept messages from ourselves
    if (event.source !== window) {
        return;
    }

    // Type guard to check if the event data matches our expected format
    const isKleoMessage = (data: any): data is KleoMessage => {
        return data && typeof data.type === 'string';
    };

    if (!isKleoMessage(event.data)) {
        return;
    }

    switch (event.data.type) {
        case "KLEO_UPLOAD_PREVIOUS_HISTORY":
        case "KLEO_SIGN_IN":
        case "UPDATE_NOTIFICATION_COUNTER":
            console.log(event.data);
            console.log("Content script received:", event.data);
            chrome.runtime.sendMessage(event.data);
            break;
    }
});

chrome.runtime.onMessage.addListener(
    function(request: ChromeMessage, 
             sender: chrome.runtime.MessageSender, 
             sendResponse: (response?: any) => void): void {
        if (request.action === "getPageContent") {
            console.log("received something from background.ts", document)
            sendResponse({content: document.body.innerText});
        }
    }
);

// Inject the script
injectScript(chrome.runtime.getURL("injectedScript.js"));