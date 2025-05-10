import { LOG_STORAGE_KEY } from "@/consts";

const SUCCESS_TOAST_SELECTOR = "screenshot-toast-success";
const ERROR_TOAST_SELECTOR = "screenshot-toast-error";
const TOAST_SELECTOR = "screenshot-toast";

export function showToast(success: boolean, message: string): void {
  const raw = localStorage.getItem(LOG_STORAGE_KEY);
  const log: string[] = raw ? JSON.parse(raw) : [];

  log.push(message);
  localStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(log));

  // Remove any existing toast
  const existingToast = document.querySelector(`.${TOAST_SELECTOR}`);
  if (existingToast) {
    existingToast.remove();
  }

  // Create toast element
  const toast = document.createElement("div");
  toast.className = `${TOAST_SELECTOR} ${success ? SUCCESS_TOAST_SELECTOR : ERROR_TOAST_SELECTOR}`;

  // Add icon
  const icon = document.createElement("span");
  icon.className = "screenshot-toast-icon";
  icon.textContent = success ? "✓" : "✕";
  toast.appendChild(icon);

  // Add to document
  document.body.appendChild(toast);

  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (document.body.contains(toast)) {
      toast.classList.add("screenshot-toast-hiding");
      setTimeout(() => {
        if (document.body.contains(toast)) {
          toast.remove();
        }
      }, 300);
    }
  }, 5000);
}
