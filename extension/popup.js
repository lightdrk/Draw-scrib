document.getElementById("activate").addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.runtime.sendMessage({
    action: "inject_canvas",
    tabId: tab.id
  });
});

