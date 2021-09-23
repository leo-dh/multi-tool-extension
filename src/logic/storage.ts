import { useLocalStorage, debounceFilter } from "@vueuse/core";
import { MediaQueueDetails, NotificationQueueDetails } from "./types";

export const notionToken = useLocalStorage("NOTION_TOKEN", "", {
  eventFilter: debounceFilter(1000),
});
export const notionPages = useLocalStorage<{ uuid: string; title: string }[]>(
  "NOTION_PAGES",
  [{ uuid: "", title: "" }],
  { eventFilter: debounceFilter(1000) }
);

export const mediaQueue = useLocalStorage<number[]>("MEDIA_QUEUE", []);
export const mediaQueueDetails = useLocalStorage<MediaQueueDetails[]>(
  "MEDIA_QUEUE_DETAILS",
  []
);
export const numPlayingTabs = useLocalStorage<number>("NUM_PLAYING_TABS", 0);

export const autoPause = useLocalStorage("AUTO_PAUSE", false);

export const savedTitles = useLocalStorage<string[]>("SAVED_TITLES", []);

export const notificationQueue = useLocalStorage<NotificationQueueDetails[]>(
  "NOTIFICATION_QUEUE",
  []
);
