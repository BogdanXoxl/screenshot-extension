import { OVERLAY_ID } from "@/consts";

export const createOverlay = (): HTMLDivElement => {
  const overlay = document.createElement("div");
  overlay.id = OVERLAY_ID;
  document.body.appendChild(overlay);
  return overlay;
};
