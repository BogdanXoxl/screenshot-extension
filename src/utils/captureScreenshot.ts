import { CAPTURE_TAB_ACTION, UPLOAD_SCREENSHOT_ACTION } from "@/consts";
import { showToast } from "./showToast";

import type { IScreenshotData, ISelectionArea } from "@/types";

// Function to capture screenshot of selected area
export const captureScreenshot = async (area: ISelectionArea | null) => {
  try {
    // Use chrome API to get screenshot of visible area
    const response = await chrome.runtime.sendMessage({
      action: CAPTURE_TAB_ACTION,
    });

    console.log("Got capture-tab response:", response);

    if (chrome.runtime.lastError) {
      console.error("Error in capture-tab:", chrome.runtime.lastError);
      showToast(false, `Error: ${chrome.runtime.lastError.message}`);
      return;
    }

    // Send full screen to background script for upload
    if (!area) {
      chrome.runtime.sendMessage({
        action: UPLOAD_SCREENSHOT_ACTION,
        screenshotData: {
          dataUrl: response.dataUrl,
        } as IScreenshotData,
      });

      return;
    }

    // Get the device pixel ratio to handle high DPI displays
    const devicePixelRatio = window.devicePixelRatio || 1;

    const adjustedArea = {
      x: Math.round(area.x * devicePixelRatio),
      y: Math.round(area.y * devicePixelRatio),
      width: Math.round(area.width * devicePixelRatio),
      height: Math.round(area.height * devicePixelRatio),
    };

    // Create a canvas to crop the screenshot
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      showToast(false, "Failed to create canvas context");
      return;
    }

    console.log("Capturing screenshot for area:", adjustedArea);

    canvas.width = adjustedArea.width;
    canvas.height = adjustedArea.height;

    const img = new Image();

    img.onload = () => {
      // Draw only the selected portion of the screenshot
      ctx.drawImage(
        img,
        adjustedArea.x,
        adjustedArea.y,
        adjustedArea.width,
        adjustedArea.height,
        0,
        0,
        adjustedArea.width,
        adjustedArea.height
      );

      // Convert canvas to data URL
      const dataUrl = canvas.toDataURL("image/png");

      // Send to background script for upload
      chrome.runtime.sendMessage({
        action: UPLOAD_SCREENSHOT_ACTION,
        screenshotData: {
          dataUrl,
        } as IScreenshotData,
      });
    };

    img.src = response.dataUrl;
  } catch (error) {
    showToast(
      false,
      `Error capturing screenshot: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
};
