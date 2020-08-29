export enum MessageType {
  POPUP,
  GET_CUR_TAB,
  JUMP_TAB,
  PLAY_PAUSE,
  CHECK_VIDEO_STATUS,
  SET_VIDEO_STATUS,
}

export interface Message {
  type: MessageType;
  text?: string;
}

export type Tab = browser.tabs.Tab;
