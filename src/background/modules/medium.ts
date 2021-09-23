import { onMessage } from "webext-bridge";
import { cookies } from "webextension-polyfill";

const clearCookies = async (domain: string, url: string) => {
  const domainCookies = await cookies.getAll({ domain });
  domainCookies.forEach((cookie) => {
    cookies.remove({ name: cookie.name, url });
  });
};

export const registerMediumModule = () => {
  onMessage("medium-blog", ({ data: { domain, url } }) => {
    clearCookies(domain, url);
  });
};
