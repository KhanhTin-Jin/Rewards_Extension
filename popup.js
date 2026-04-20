
document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('startBtn');
  const stopBtn = document.getElementById('stopBtn');
  const optionsBtn = document.getElementById('optionsBtn');
  const statusDisplay = document.getElementById('statusDisplay');

  // Update UI based on the extension's current state
  const updateUI = (status) => {
    const progressWrap = document.getElementById('progressWrap');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');

    if (status.isRunning) {
      statusDisplay.textContent = `Đang chạy...`;
      startBtn.style.display = 'none';
      stopBtn.style.display = 'block';
      if (typeof status.openedTabs === 'number' && typeof status.totalTabs === 'number') {
        progressWrap.style.display = 'block';
        const pct = status.totalTabs > 0 ? Math.round((status.openedTabs / status.totalTabs) * 100) : 0;
        progressBar.style.width = pct + '%';
        progressText.textContent = `${status.openedTabs}/${status.totalTabs}`;
      }
    } else {
      statusDisplay.textContent = 'Sẵn sàng';
      startBtn.style.display = 'block';
      stopBtn.style.display = 'none';
      progressWrap.style.display = 'none';
      progressBar.style.width = '0%';
      progressText.textContent = '0/0';
    }
  };


  // Get initial status when popup opens
  function requestStatus() {
    chrome.runtime.sendMessage({ action: "getStatus" }, (response) => {
      if (chrome.runtime.lastError) {
          // Background may be inactive; still try again later
          // console.error(chrome.runtime.lastError.message);
          return;
      }
      updateUI(response);
    });
  }

  // Initial request
  requestStatus();

  // Poll every second while popup is open to handle service-worker inactivity
  const pollInterval = 1000; // ms
  const pollId = setInterval(requestStatus, pollInterval);

  // Clear polling when popup unloads
  window.addEventListener('unload', () => clearInterval(pollId));

  // Listen for live status updates from background
  chrome.runtime.onMessage.addListener((msg) => {
    if (msg && msg.type === 'status') {
      updateUI(msg);
    }
  });

  // --- Event Listeners ---
  optionsBtn.addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });

  startBtn.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: "startOpeningTabs" }, (response) => {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message);
            return;
        }
        if (response && response.success) {
            startBtn.disabled = true;
            statusDisplay.textContent = 'Bắt đầu...';
            window.close();
        }
    });
  });

  stopBtn.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: "stopOpeningTabs" }, (response) => {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message);
            return;
        }
        if (response && response.success) {
            stopBtn.disabled = true;
            statusDisplay.textContent = 'Đang dừng...';
            window.close();
        }
    });
  });
});
