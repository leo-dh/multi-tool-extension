export enum MediaStatus {
  PLAYING,
  PAUSED,
}

export interface MediaQueueDetails {
  title: string;
  pageTitle: string;
  favIconUrl: string;
  tabId: number;
  windowId: number;
  status: MediaStatus;
  url: string;
}

export interface NotificationQueueDetails {
  title: string;
  content: string;
  timeout: number;
  timestamp: number;
}

export enum ContextMenusID {
  ADD_TO_NOTION = "add_to_notion",
}
