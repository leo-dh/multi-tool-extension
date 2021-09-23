import { sendMessage } from "webext-bridge";
import { tabs } from "webextension-polyfill";
import { notificationQueue } from "@/logic";

export const registerNotificationsModule = () => {
  watch(notificationQueue, async (value, oldValue) => {
    const difference = value.filter(
      (x) => !oldValue.some((y) => x.timestamp === y.timestamp)
    );

    const allTabs = await tabs.query({});
    // difference is a proxy array, the values need to be converted into
    // normal objects for it to be sent to the content scripts.
    const newNotifications = difference.map((v) => ({ ...v }));
    allTabs.forEach((tab) => {
      sendMessage(
        "update-notifications",
        { newNotifications },
        `content-script@${tab.id || 0}`
      );
    });
  });
};
