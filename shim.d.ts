import { ProtocolWithReturn } from "webext-bridge";
import { MediaStatus, NotificationQueueDetails } from "@/logic/types";

declare module "webext-bridge" {
  export interface ProtocolMap {
    // define message protocol types
    // see https://github.com/antfu/webext-bridge#type-safe-protocols
    "medium-blog": { domain: string; url: string };
    "check-media": ProtocolWithReturn<
      {},
      { status: MediaStatus; title: string }
    >;
    "check-title": ProtocolWithReturn<{}, { title: string }>;
    "update-media": { status: MediaStatus; title: string };
    "update-notifications": { newNotifications: NotificationQueueDetails[] };
  }
}
