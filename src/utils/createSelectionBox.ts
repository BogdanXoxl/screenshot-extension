import { SELECTION_BOX_ID } from "@/consts";

export const createSelectionBox = (x: number, y: number): HTMLDivElement => {
  const box = document.createElement("div");
  box.id = SELECTION_BOX_ID;
  Object.assign(box.style, {
    left: `${x}px`,
    top: `${y}px`,
  });
  document.body.appendChild(box);
  return box;
};
