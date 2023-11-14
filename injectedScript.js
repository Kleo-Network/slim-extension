document.addEventListener("ExtensionIdEvent", function (e) {
  const extensionId = e.detail.extensionId;
  console.log("Received Extension ID:", extensionId);

  window.kleoUploadHistory = function(address) {
      console.log("KleoUploadHistory Called from Plugin", address);
      try {
        console.log("KleoUploadHistory Called from Plugin", address);
        window.postMessage({ type: 'KLEO_UPLOAD_PREVIOUS_HISTORY', address: address }, "*");
      } catch (error) {
          console.error("Error sending message:", error);
      }
  };
});