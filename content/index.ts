import { getPageContent } from './utils/getPageContent';
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
  const script: HTMLScriptElement = document.createElement('script');
  script.setAttribute('type', 'text/javascript');
  script.setAttribute('src', file);

  // Dispatch the event after the script is loaded
  script.onload = (): void => {
    dispatchCustomEvent<ExtensionIdEventDetail>('ExtensionIdEvent', {
      extensionId: chrome.runtime.id,
    });
  };

  document.head.appendChild(script);
}

window.addEventListener('message', function (event: MessageEvent) {
  // Type guard to check if the event data matches our expected format
  const isKleoMessage = (data: any): data is KleoMessage => {
    return data && typeof data.type === 'string';
  };

  if (!isKleoMessage(event.data)) {
    return;
  }

  switch (event.data.type) {
    case 'KLEO_UPLOAD_PREVIOUS_HISTORY':
    case 'UPDATE_NOTIFICATION_COUNTER':
      chrome.runtime.sendMessage(event.data);
      break;
    case 'KLEO_SIGN_IN':
      chrome.storage.local.get('user', (userData) => {
        if (userData.user && userData.user.id && userData.user.token) {
          const response = {
            type: 'KLEO_SIGN_IN_RESPONSE',
            address: userData.user.id,
            token: userData.user.token,
          };
          window.postMessage(response, '*');
        } else {
          console.error('User data not found or incomplete');
          window.postMessage({ type: 'KLEO_SIGN_IN_RESPONSE', error: 'User data not found' }, '*');
        }
      });
      break;
  }
});

chrome.runtime.onMessage.addListener(function (
  request: ChromeMessage,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void,
): void {
  if (request.action === 'getPageContent') {
    getPageContent((content: string) => {
      sendResponse({ content });
    });
  }
});

// Inject the script
injectScript(chrome.runtime.getURL('injectedScript.js'));
