export enum MessageType {
  POPUP,
  GET_CUR_TAB,
  JUMP_TAB,
  GET_ALL_TABS,
}

export interface Message {
  type: MessageType;
  text?: string;
}

export interface TabInfo {
  id: number;
  windowId: number;
  favIconUrl?: string;
  title?: string;
  url?: string;
}
