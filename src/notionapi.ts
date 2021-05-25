const NOTION_API_BLOCK_ENDPOINT = "https://api.notion.com/v1/blocks/{}/children";

// eslint-disable-next-line import/prefer-default-export
export function addContentToPage(content: string, uuid: string, token: string) {
  const requestBody = {
    children: [
      {
        object: "block",
        type: "bulleted_list_item",
        // eslint-disable-next-line @typescript-eslint/camelcase
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
  return fetch(NOTION_API_BLOCK_ENDPOINT.replace("{}", uuid), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(requestBody),
  });
}
