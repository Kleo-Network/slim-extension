document.addEventListener("ExtensionIdEvent", function (e) {
  const extensionId = e.detail.extensionId;
  window.kleoConnect = true;
  window.kleoUploadHistory = function(address, token) {
      try {
        window.postMessage({ type: 'KLEO_UPLOAD_PREVIOUS_HISTORY', address: address, token: token }, "*");
      } catch (error) {
          console.error("Error sending message:", error);
      }
  };
  window.signIn = function(address, token) {
    try {
      window.postMessage({ type: 'KLEO_SIGN_IN', address: address, token: token }, "*");
    } catch (error) {
        console.error("Error sending message:", error);
    }
  };
  window.updateCounter = function(count) {
    try {
      window.postMessage({ type: 'UPDATE_NOTIFICATION_COUNTER', counter: count}, "*");
    } catch (error) {
        console.error("Error sending message:", error);
    }
  };
});