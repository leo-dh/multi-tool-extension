const sendInfo = async () => {
  const location = window.location;
  browser.runtime.sendMessage({ type: "info", message: `${location}` });
};
sendInfo();
