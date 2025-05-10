export {};

declare global {
  interface Window {
    __content_in_process__?: boolean;
  }
}
