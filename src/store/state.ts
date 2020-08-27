import { TabInfo } from "@/types";

export interface State {
  selectedTab: TabInfo | null;
  tabs: TabInfo[];
}

export const state: State = {
  selectedTab: null,
  tabs: [] as TabInfo[],
};
