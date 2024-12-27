import { App } from "./app";

export interface openedApp extends App {
  zIndex?: number;
  isMinimized?: boolean;
}
