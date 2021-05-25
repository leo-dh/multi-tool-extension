export enum MessageType {
  POPUP,
  SET_PINNED_TAB,
  GET_PINNED_TAB,
  GET_NOW_PLAYING,
  GET_TABS,
  GO_TO_PINNED_TAB,
  GO_TO_PLAYING_TAB,
  PLAY_PAUSE,
  CHECK_VIDEO_STATUS,
  SET_VIDEO_STATUS,
  TOAST_SUCCESS,
  TOAST_FAILURE,
}

export interface Message {
  type: MessageType;
  text?: string;
}

export interface Page {
  uuid: string;
  title: string;
}

export type Tab = browser.tabs.Tab;

export enum LocalStorageKeys {
  NOTION_TOKEN = "notionapitoken",
  NOTION_PAGES = "notionpages",
}
