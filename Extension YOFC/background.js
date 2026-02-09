// background.js

chrome.action.onClicked.addListener((tab) => {
    if (tab.url.includes("web.whatsapp.com")) {
        chrome.tabs.sendMessage(tab.id, { action: "toggleYOFC" });
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "uploadToDrive") {
        fetch(request.url, {
            method: "POST",
            body: JSON.stringify(request.data)
        })
            .then(response => response.json())
            .then(data => sendResponse({ success: true, result: data }))
            .catch(error => sendResponse({ success: false, error: error.toString() }));

        return true;
    }
});