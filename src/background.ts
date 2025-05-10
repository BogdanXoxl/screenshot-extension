import { uploadScreenshot } from "@/utils";
import {
  CAPTURE_TAB_ACTION,
  SHOW_TOAST_ACTION,
  TAKE_SCREENSHOT_ACTION,
  UPLOAD_SCREENSHOT_ACTION,
} from "@/consts";

import type { IWorkerResponse } from "@/types";

// Listen for the keyboard shortcut
chrome.commands.onCommand.addListener((command) => {
  if (command === TAKE_SCREENSHOT_ACTION) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (activeTab && activeTab.id) {
        void chrome.scripting.executeScript({
          target: { tabId: activeTab.id },
          files: ["content.js"],
          world: "ISOLATED",
        });
        void chrome.scripting.insertCSS({
          target: { tabId: activeTab.id },
          files: ["styles.css"],
        });
      }
    });
  }
});

// Listen for capture-tab message from content script
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.action !== CAPTURE_TAB_ACTION) {
    return;
  }

  console.log("Attempting to capture tab");

  chrome.tabs.captureVisibleTab({ format: "png" }, (dataUrl) => {
    if (chrome.runtime.lastError || !dataUrl) {
      console.error("Error capturing tab:", chrome.runtime.lastError);
      sendResponse({
        error: chrome.runtime.lastError?.message || "Capture failed",
      });
    } else {
      console.log("Tab captured successfully");
      sendResponse({ dataUrl });
    }
  });

  return true;
});

// Listen for upload-screenshot message from content script
chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.action !== UPLOAD_SCREENSHOT_ACTION || !message.screenshotData) {
    return;
  }

  console.log("Received screenshot data for upload");
  uploadScreenshot(message.screenshotData)
    .then((response) => {
      console.log("Upload complete, sending toast notification", response);

      if (sender.tab?.id) {
        chrome.tabs.sendMessage<IWorkerResponse>(sender.tab.id, {
          action: SHOW_TOAST_ACTION,
          success: response?.success ?? true,
          message: response?.message ?? "",
        });
      }
    })
    .catch((error) => {
      console.error("Upload error:", error);
      if (sender.tab?.id) {
        chrome.tabs.sendMessage<IWorkerResponse>(sender.tab.id, {
          action: SHOW_TOAST_ACTION,
          success: false,
          message: `Error: ${error.message}`,
        });
      }
    });

  return true;
});
