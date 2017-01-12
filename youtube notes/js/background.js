var opened = false;
var panel = 0;

chrome.browserAction.onClicked.addListener(function() {
    // Allow only one instance
    if (!opened) {
        opened = true;
        chrome.windows.create({
                url: "http://10.1.36.122:8000/vbook/conference/",
                type: "popup",
                focused: true,
                width: 1200,
                height: 150
            },
            function(window) { panel = window.id }
        )
    }

    // Focus on clicking the extension icon
    else if (opened) { chrome.windows.update(panel, { focused: true }) }
    // Remove when remo
    chrome.windows.onRemoved.addListener(function(windowId) {
        if (windowId == panel) {
            panel = 0;
            opened = false;
        }
    });
});
