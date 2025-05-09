import { UPLOAD_DEBOUNCE_INTERVAL, SERVER_URL } from "@/consts";
import { ScreenshotData, ServerResponse } from "@/types";

let lastUploadTime = 0;

// Function to upload screenshot to server
export async function uploadScreenshot(
  screenshotData: ScreenshotData
): Promise<ServerResponse | undefined> {
  const now = Date.now();

  if (now - lastUploadTime < UPLOAD_DEBOUNCE_INTERVAL) {
    return;
  }

  lastUploadTime = now;

  try {
    const formData = new FormData();

    // Convert data URL to blob
    const blob = await fetch(screenshotData.dataUrl).then((res) => res.blob());

    formData.append("screenshot", blob, "screenshot.png");

    // Replace with your actual server URL
    const response = await fetch(SERVER_URL, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error uploading screenshot:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
