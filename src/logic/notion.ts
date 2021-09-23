const NOTION_API_BLOCK_ENDPOINT =
  "https://api.notion.com/v1/blocks/{}/children";

const buildEndpoint = (uuid: string) => {
  return NOTION_API_BLOCK_ENDPOINT.replace("{}", uuid);
};

export function addContentToPage(content: string, uuid: string, token: string) {
  const requestBody = {
    children: [
      {
        object: "block",
        type: "bulleted_list_item",
        bulleted_list_item: {
          text: [
            {
              type: "text",
              text: {
                content,
              },
            },
          ],
        },
      },
    ],
  };
  const endpoint = buildEndpoint(uuid);
  return fetch(endpoint, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "Notion-Version": "2021-08-16",
    },
    body: JSON.stringify(requestBody),
  });
}
