function getPageContent() {
    // Simple example to get body text, customize as needed
    console.log('document body', document.body)
    return document.body.innerText;
}

// chrome.runtime.onMessage.addListener(
//     function(request, sender, sendResponse) {
//         if (request.action === "GET_PAGE_CONTENT") {
//             console.log('hello world')
//             const content = getPageContent();
//             sendResponse({content: content});
//         }
//     }
// );


function dispatchCustomEvent(eventName, detail) {
    document.dispatchEvent(new CustomEvent(eventName, { detail }));
}

function injectScript(file) {
    const script = document.createElement("script");
    script.setAttribute("type", "text/javascript");
    script.setAttribute("src", file);
    document.head.appendChild(script);

    // Dispatch the event after the script is loaded
    script.onload = () => {
        dispatchCustomEvent("ExtensionIdEvent", { extensionId: chrome.runtime.id });
    };
}

window.addEventListener("message", function(event) {
    // We only accept messages from ourselves
    if (event.source != window)
        return;

    if (event.data.type && (event.data.type == "KLEO_UPLOAD_PREVIOUS_HISTORY")) {
        console.log(event.data);
        console.log("Content script received:", event.data);
        chrome.runtime.sendMessage(event.data);
    }
});

injectScript(chrome.runtime.getURL("injectedScript.js"));
