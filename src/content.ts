console.log("content");
(async () => {
  const res = await chrome.runtime.sendMessage({ action: "capture-tab" });
  chrome.runtime.sendMessage({
    action: "upload-screenshot",
    screenshotData: {
      dataUrl: res.dataUrl,
    },
  });
})();
