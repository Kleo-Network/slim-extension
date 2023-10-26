window.kleoUploadHistory = function() {
    // Notify the extension that the function was called
    window.postMessage({ type: 'KLEO_UPLOAD_PREVIOUS_HISTORY' }, '*');
  };