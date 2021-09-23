import { contextMenus } from "webextension-polyfill";
import {
  addContentToPage,
  notificationQueue,
  notionPages,
  notionToken,
} from "@/logic";
import { ContextMenusID } from "@/logic/types";

const setContextMenu = async () => {
  await contextMenus.removeAll();
  contextMenus.create({
    id: ContextMenusID.ADD_TO_NOTION,
    title: "Add to Notion",
    contexts: ["selection"],
  });
  notionPages.value.forEach((page) => {
    contextMenus.create({
      id: page.uuid,
      title: page.title.length > 0 ? page.title : page.uuid,
      parentId: ContextMenusID.ADD_TO_NOTION,
      contexts: ["selection"],
      onclick: async (info, tab) => {
        if (!info.selectionText) return;
        const string = info.selectionText;
        const response = await addContentToPage(
          string,
          page.uuid,
          notionToken.value
        );
        if (!tab.id) return;
        if (response.status === 200) {
          const trimmedString =
            string.length > 30 ? `${string.substring(0, 30 - 3)}...` : string;
          notificationQueue.value = [
            ...notificationQueue.value,
            {
              title: "Notion",
              timeout: 3000,
              timestamp: Date.now(),
              content: `Added '${trimmedString}' to ${page.title} page`,
            },
          ];
        } else {
          console.log(response);
          notificationQueue.value = [
            ...notificationQueue.value,
            {
              title: "Notion",
              timeout: 3000,
              timestamp: Date.now(),
              content: `Failed to add to ${page.title} page`,
            },
          ];
        }
      },
    });
  });
};

export const registerNotionModule = () => {
  setContextMenu();
  watch([notionToken, notionPages], () => {
    setContextMenu();
  });
};
