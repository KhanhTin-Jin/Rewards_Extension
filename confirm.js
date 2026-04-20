document.getElementById('acceptBtn').addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'startScheduledRun' }, () => {
        window.close();
    });
});

document.getElementById('cancelBtn').addEventListener('click', () => {
    window.close();
});
