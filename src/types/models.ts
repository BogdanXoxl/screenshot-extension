export interface IScreenshotData {
  dataUrl: string;
}

export interface IWorkerResponse {
  action: string;
  success: boolean;
  message: string;
}

export interface IServerResponse {
  success: boolean;
  message: string;
  url?: string;
}

export interface ISelectionArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface IApp {
  finish: Promise<void>;
}
