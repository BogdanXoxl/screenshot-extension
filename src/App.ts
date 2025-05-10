import type { IApp } from "@/types";
import { captureScreenshot, createOverlay, createSelectionBox } from "@/utils";
import { RECT_STORAGE_KEY } from "@/consts";

export class App implements IApp {
  private isDragging = false;
  private startX = 0;
  private startY = 0;

  private currentRect: DOMRect | null = null;
  private selectionBox: HTMLDivElement | null = null;

  public finish: Promise<void>;
  private resolveFinish!: () => void;

  private readonly overlay: HTMLDivElement;

  constructor() {
    this.overlay = createOverlay();

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleFinish = this.handleFinish.bind(this);

    this.overlay.addEventListener("mousedown", this.handleMouseDown);
    this.overlay.addEventListener("mouseup", this.handleMouseUp);
    this.overlay.addEventListener("mousemove", this.handleMouseMove);

    this.finish = new Promise((res) => {
      this.resolveFinish = res;
    });
  }

  private handleMouseDown(e: MouseEvent) {
    this.isDragging = true;
    this.startX = e.clientX;
    this.startY = e.clientY;
    this.selectionBox = createSelectionBox(this.startX, this.startY);
  }

  private handleMouseUp(_e: MouseEvent) {
    this.isDragging = false;
    this.handleFinish();
  }

  private handleMouseMove(e: MouseEvent) {
    if (!this.isDragging || !this.selectionBox) {
      return;
    }

    const x = Math.min(e.clientX, this.startX);
    const y = Math.min(e.clientY, this.startY);
    const width = Math.abs(e.clientX - this.startX);
    const height = Math.abs(e.clientY - this.startY);

    Object.assign(this.selectionBox.style, {
      left: `${x}px`,
      top: `${y}px`,
      width: `${width}px`,
      height: `${height}px`,
    });

    this.currentRect = new DOMRect(x, y, width, height);
  }

  private handleFinish() {
    this.overlay.remove();
    this.selectionBox?.remove();

    if (this.currentRect) {
      localStorage.setItem(RECT_STORAGE_KEY, JSON.stringify(this.currentRect));
    }

    setTimeout(() => {
      const rect = this.loadRect();
      captureScreenshot(rect);
      this.resolveFinish();
    }, 50);
  }

  private loadRect(): DOMRect | null {
    try {
      const stored = localStorage.getItem(RECT_STORAGE_KEY);
      return this.currentRect || (stored ? JSON.parse(stored) : null);
    } catch {
      return null;
    }
  }
}
