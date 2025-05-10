import { App } from "@/App";
import { showToast } from "@/utils";
import { SHOW_TOAST_ACTION } from "@/consts";

import type { IWorkerResponse } from "@/types";

(async () => {
  console.log("[content] script loaded");

  if (window.__content_in_process__) {
    console.warn("Already injected. Skipping.");
    return;
  }

  window.__content_in_process__ = true;

  console.log("content");

  const handleShowToast = (message: IWorkerResponse) => {
    console.log("Message received in content script:", message);
    if (message.action === SHOW_TOAST_ACTION) {
      showToast(message.success, message.message);
    }
  };
  chrome.runtime.onMessage.addListener(handleShowToast);

  const app = new App();
  await app.finish;

  window.__content_in_process__ = false;
})();
