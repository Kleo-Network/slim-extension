document.addEventListener("ExtensionIdEvent", function (e) {
  const extensionId = e.detail.extensionId;
  console.log("Received Extension ID:", extensionId);
  window.kleoConnect = true;
  window.kleoUploadHistory = function(address, token) {
      alert("address", address);
      alert("token", token);
      try {
        console.log("KleoUploadHistory Called from Plugin", address);
        console.log("recieved token:", token)
        window.postMessage({ type: 'KLEO_UPLOAD_PREVIOUS_HISTORY', address: address, token: token }, "*");
      } catch (error) {
          console.error("Error sending message:", error);
      }
  };
});