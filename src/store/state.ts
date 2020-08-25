import { TabInfo } from "@/types";

export interface State {
  selectedTab: TabInfo | null;
}

export const state: State = {
  selectedTab: null,
};
