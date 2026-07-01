chrome.downloads.onCreated.addListener((downloadItem) => {

  const url = downloadItem.url;

  chrome.downloads.cancel(downloadItem.id, () => {
    console.log("Browser download cancelled.");
    console.log("Sending to native host: ", url);

    chrome.runtime.sendNativeMessage(
      "com.quantum.download",
      { url: url },
      (response) => {
        if (chrome.runtime.lastError) {
          console.log("Native host error: ", chrome.runtime.lastError.message);
        } else {
          console.log("Native host response: ", response);
        }
      }
    );

  });

});