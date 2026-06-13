
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "CAPTURE_SCREEN") {
    console.log(">>> CAPTURE_SCREEN");
    chrome.tabs.captureVisibleTab({ format: "png" }, (dataUrl) => {
      sendResponse(dataUrl);
    });
    return true;
  }

  if (message.type === "PROCESS_CROP_QRCODE") {
    console.log(">>> PROCESS_CROP_QRCODE");
    const currentTabId = sender.tab?.id;
    if (!currentTabId) return true;
    chrome.tabs.sendMessage(currentTabId, {
      type: "END_CROP_QRCODE",
    }).catch(err => console.error(err));
    return true;
  }

  if (message.type === "OPEN_WINDOW") {
    console.log(">>> OPEN_WINDOW");
    chrome.windows.create({
      url: chrome.runtime.getURL("src/popup/index.html"),
      type: "popup",
      width: 400,
      height: 600,
    });
  }
});