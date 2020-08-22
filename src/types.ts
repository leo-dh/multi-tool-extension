export enum MessageType {
  INFO,
  POPUP,
  POPUP_CUR_TAB,
}

export interface Message {
  type: MessageType;
  text?: string;
}
