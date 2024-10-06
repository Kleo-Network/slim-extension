// Define interfaces for the window object extensions
// declare global {
//   interface Window {
//       kleoConnect: boolean;
//       kleoUploadHistory: (address: string, token: string) => void;
//       signIn: (address: string, token: string) => void;
//   }
// }

// Define interface for the custom event detail
interface ExtensionIdEventDetail {
  extensionId: string;
}

// Define interface for custom event
interface ExtensionIdEvent extends CustomEvent<ExtensionIdEventDetail> {
  detail: ExtensionIdEventDetail;
}

// Define interfaces for the messages
interface KleoUploadHistoryMessage {
  type: 'KLEO_UPLOAD_PREVIOUS_HISTORY';
  address: string;
  token: string;
}

interface KleoSignInMessage {
  type: 'KLEO_SIGN_IN';
  address: string;
  token: string;
}


// Main event listener
(document as any).addEventListener("ExtensionIdEvent", function(e: ExtensionIdEvent): void {
  const extensionId: string = e.detail.extensionId;
  
  // Set global flag
  (window as any).kleoConnect = true;

  // Define upload history function
  (window as any).kleoUploadHistory = function(address: string, token: string): void {
      try {
          const message: KleoUploadHistoryMessage = {
              type: 'KLEO_UPLOAD_PREVIOUS_HISTORY',
              address,
              token
          };
          window.postMessage(message, "*");
      } catch (error) {
          console.error("Error sending upload history message:", error);
      }
  };

  // Define sign in function
  (window as any).signIn = function(address: string, token: string): void {
      try {
          const message: KleoSignInMessage = {
              type: 'KLEO_SIGN_IN',
              address,
              token
          };
          window.postMessage(message, "*");
      } catch (error) {
          console.error("Error sending sign in message:", error);
      }
  };
});