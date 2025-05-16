chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	console.log('running...')
	if (message.action === "inject_canvas" && message.tabId) {
		chrome.scripting.executeScript({
			target: { tabId: message.tabId },
			files: ["./content/main.js"]
		}).catch(err => console.error("script", err));
	}
});
