import { TabInfo } from "@/types";

export interface State {
  selectedTab: TabInfo | null;
  previousTab: TabInfo | null;
  tabs: TabInfo[];
}

export const state: State = {
  selectedTab: null,
  previousTab: null,
  tabs: [] as TabInfo[],
};
