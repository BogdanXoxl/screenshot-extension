// Request settings
export const SERVER_URL = import.meta.env.VITE_API_URL;
export const UPLOAD_DEBOUNCE_INTERVAL = 2000;

// Selectors
export const OVERLAY_ID = "__screenshot_overlay__";
export const SELECTION_BOX_ID = "__screenshot_selection_box__";

// Locale storage keys
export const RECT_STORAGE_KEY = "screenshotLastRect";
export const LOG_STORAGE_KEY = "LOG_STORAGE_KEY";

// Actions
export const TAKE_SCREENSHOT_ACTION = "take-screenshot";
export const CAPTURE_TAB_ACTION = "capture-tab";
export const UPLOAD_SCREENSHOT_ACTION = "upload-screenshot";
export const SHOW_TOAST_ACTION = "show-toast";
