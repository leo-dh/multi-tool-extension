import { Tab } from "@/types";

export interface State {
  selectedTab: Tab | null;
  previousTab: Tab | null;
  playingTab: Tab | null;
  tabs: Tab[];
  videoPlaying: boolean | null;
}

export const state: State = {
  selectedTab: null,
  previousTab: null,
  playingTab: null,
  tabs: [] as Tab[],
  videoPlaying: null,
};
