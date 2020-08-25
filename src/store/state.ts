import { PopupMode, TabInfo } from "@/types";

export interface State {
  counter: number;
  popupMode: PopupMode;
  listedTabs: TabInfo[];
  selectedTab: TabInfo | null;
}

export const state: State = {
  listedTabs: [] as TabInfo[],
  counter: 0,
  selectedTab: null,
  popupMode: PopupMode.MULTIPLE_TABS,
};
