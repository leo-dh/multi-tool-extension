export enum MessageType {
  POPUP,
  GET_CUR_TAB,
  JUMP_TAB,
}

export interface Message {
  type: MessageType;
  text?: string;
}

export enum PopupMode {
  MULTIPLE_TABS,
  SELECTED_TAB,
}

export interface TabInfo {
  id: number;
  windowId: number;
  favIconUrl?: string;
  title?: string;
}
