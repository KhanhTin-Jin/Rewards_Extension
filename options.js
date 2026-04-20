/**
 * UI Module: Handles all DOM interactions and UI state.
 */
const UI = {
  init() {
    // Cache all DOM elements
    this.elements = {
      fileInput: document.getElementById('customTopicsFile'),
      saveButton: document.getElementById('save'),
      statusDiv: document.getElementById('status'),
      tabsToOpenInput: document.getElementById('tabsToOpen'),
      delayModeRadios: document.querySelectorAll('input[name="delayMode"]'),
      fixedDelaySettingDiv: document.getElementById('fixedDelaySetting'),
      fixedDelaySecondsInput: document.getElementById('fixedDelaySeconds'),
      customTopicsArea: document.getElementById('customTopicsArea'),
      saveCustomTopicsBtn: document.getElementById('saveCustomTopics'),
      sidebarNav: document.getElementById('sidebar-nav'),
      contentSections: document.querySelectorAll('.content-section'),
      navLinks: document.querySelectorAll('#sidebar-nav a'),
      signatureDiv: document.getElementById('signature'),
      versionDisplay: document.getElementById('version-display'),
      runLogsTable: document.querySelector('#runLogsTable tbody'),
      clearLogsBtn: document.getElementById('clearLogs'),
      resetSeenBtn: document.getElementById('resetSeen'),
    };
  },

  showStatus(message, duration = 3000) {
    this.elements.statusDiv.textContent = message;
    this.elements.statusDiv.style.display = 'block';
    clearTimeout(this.elements.statusDiv.timeoutId);
    this.elements.statusDiv.timeoutId = setTimeout(() => {
      this.elements.statusDiv.style.display = 'none';
      this.elements.statusDiv.textContent = '';
    }, duration);
  },

  displayVersionAndSignature() {
    const manifest = chrome.runtime.getManifest();
    const version = manifest.version;
    const year = new Date().getFullYear();
    const signatureText = `Rewards Helper fork by KhanhTin-Jin (Jin) - original by minibom4 - Version ${version}`;

    if (this.elements.signatureDiv) this.elements.signatureDiv.textContent = signatureText;
    if (this.elements.versionDisplay) this.elements.versionDisplay.textContent = version;
  },

  populateSettings(settings) {
    if (settings.customTopics && Array.isArray(settings.customTopics) && settings.customTopics.length) {
      this.elements.customTopicsArea.value = settings.customTopics.join('\n');
    } else {
      this.elements.customTopicsArea.placeholder = 'Nhập mỗi chủ đề trên một dòng...\nVí dụ:\nLịch sử Việt Nam\nCông thức nấu ăn';
    }

    if (settings.tabsToOpen) this.elements.tabsToOpenInput.value = settings.tabsToOpen;
    if (settings.fixedDelaySeconds) this.elements.fixedDelaySecondsInput.value = settings.fixedDelaySeconds;
    
    const selectedMode = settings.delayMode || 'immediate';
    const radio = document.querySelector(`input[name="delayMode"][value="${selectedMode}"]`);
    if (radio) radio.checked = true;

    this.elements.fixedDelaySettingDiv.style.display = selectedMode === 'fixed' ? 'block' : 'none';
    // scheduleTime removed — scheduling is no longer supported

    // Render run logs if provided
    if (this.elements.runLogsTable && settings.runLogs && Array.isArray(settings.runLogs)) {
      this.renderLogs(settings.runLogs);
    }
  },

  renderLogs(logs) {
    const tbody = this.elements.runLogsTable;
    tbody.innerHTML = '';
    if (!logs || logs.length === 0) {
      const tr = document.createElement('tr');
      tr.innerHTML = '<td colspan="3" style="padding:8px; color:#666">Không có nhật ký trong 7 ngày.</td>';
      tbody.appendChild(tr);
      return;
    }

    // Sort logs descending by time
    const sorted = logs.slice().sort((a,b) => b.time - a.time);
    for (const entry of sorted) {
      const tr = document.createElement('tr');
      const date = new Date(entry.time).toLocaleString();
      const topics = (entry.topics || []).join(', ');
      tr.innerHTML = `<td style="padding:6px; border-bottom:1px solid #f0f0f0">${date}</td><td style="padding:6px; border-bottom:1px solid #f0f0f0">${entry.count}</td><td style="padding:6px; border-bottom:1px solid #f0f0f0">${topics}</td>`;
      tbody.appendChild(tr);
    }
  },

  getGeneralSettings() {
    const tabsToOpen = parseInt(this.elements.tabsToOpenInput.value, 10);
    const delayMode = document.querySelector('input[name="delayMode"]:checked').value;
    const fixedDelaySeconds = parseInt(this.elements.fixedDelaySecondsInput.value, 10);
    return { tabsToOpen, delayMode, fixedDelaySeconds };
  },

  getCustomTopics() {
    return this.elements.customTopicsArea.value.split('\n').map(t => t.trim()).filter(t => t !== '');
  },
  setCustomTopics(text) {
    this.elements.customTopicsArea.value = text;
  },

  switchSection(targetLink) {
    const sectionId = targetLink.getAttribute('data-section');
    this.elements.navLinks.forEach(link => link.classList.remove('active'));
    targetLink.classList.add('active');
    this.elements.contentSections.forEach(section => {
      section.classList.toggle('active', section.id === sectionId);
    });
  },
};

/**
 * Storage Module: Handles communication with chrome.storage and background script.
 */
const Storage = {
  load(keys) {
    return new Promise(resolve => chrome.storage.local.get(keys, resolve));
  },
  save(settings) {
    return new Promise(resolve => chrome.storage.local.set(settings, resolve));
  },
  remove(key) {
    return new Promise(resolve => chrome.storage.local.remove(key, resolve));
  },
  sendMessage(message) {
    chrome.runtime.sendMessage(message);
  },
};

/**
 * App Module: The main controller that wires everything together.
 */
const App = {
  async init() {
    UI.init();
    this.bindEvents();
    UI.displayVersionAndSignature();
    const settings = await Storage.load(['customTopics', 'tabsToOpen', 'delayMode', 'fixedDelaySeconds', 'runLogs']);
    UI.populateSettings(settings);
  },

  bindEvents() {
    UI.elements.saveButton.addEventListener('click', this.handleSaveGeneral.bind(this));
    UI.elements.fileInput.addEventListener('change', this.handleFileSelect.bind(this));
    UI.elements.saveCustomTopicsBtn.addEventListener('click', this.handleSaveCustomTopics.bind(this));
    UI.elements.sidebarNav.addEventListener('click', this.handleSidebarNav.bind(this));
    UI.elements.delayModeRadios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        UI.elements.fixedDelaySettingDiv.style.display = e.target.value === 'fixed' ? 'block' : 'none';
      });
    });

    if (UI.elements.clearLogsBtn) UI.elements.clearLogsBtn.addEventListener('click', this.handleClearLogs.bind(this));
    if (UI.elements.resetSeenBtn) UI.elements.resetSeenBtn.addEventListener('click', this.handleResetSeenTopics.bind(this));
  },

  handleSidebarNav(e) {
    if (e.target.tagName === 'A') {
      e.preventDefault();
      UI.switchSection(e.target);
    }
  },

  async handleSaveGeneral() {
    const { tabsToOpen, delayMode, fixedDelaySeconds } = UI.getGeneralSettings();
    if (tabsToOpen < 1 || tabsToOpen > 100) { // Increased max to 100 as in HTML
      return UI.showStatus('Số lượt tìm kiếm không hợp lệ (phải từ 1 đến 100).', 4000);
    }
    if (delayMode === 'fixed' && fixedDelaySeconds < 1) {
      return UI.showStatus('Số giây delay không hợp lệ (phải lớn hơn 0).', 4000);
    }
    await Storage.save({ tabsToOpen, delayMode, fixedDelaySeconds });
    UI.showStatus('Đã lưu cài đặt chung!');
  },

  handleFileSelect(event) { // FileReader API is event-based, so async/await isn't directly applicable here.
    const file = event.target.files[0];
    if (!file || !file.name.endsWith('.txt')) {
      return UI.showStatus('Vui lòng chọn một tệp .txt.', 3000);
    }
    const reader = new FileReader();
    reader.onload = async (e) => { // Make the onload handler async
      const topics = e.target.result.split(/\r?\n/).filter(line => line.trim() !== '');
      if (topics.length > 0) {
        UI.setCustomTopics(topics.join('\n'));
        await this.handleSaveCustomTopics(); // Await the save operation
        UI.showStatus(`Đã tải lên ${topics.length} chủ đề từ tệp.`, 4000);
      } else {
        UI.showStatus('Tệp không có nội dung hoặc định dạng không đúng.', 3000);
      }
    };
    reader.onerror = () => UI.showStatus('Đã xảy ra lỗi khi đọc tệp.', 3000);
    reader.readAsText(file);
  },

  async handleSaveCustomTopics() {
    const topics = UI.getCustomTopics();
    await Storage.save({ customTopics: topics });
    UI.showStatus('Danh sách chủ đề tùy chỉnh đã được lưu.');
  },

  async handleClearLogs() {
    await Storage.save({ runLogs: [] });
    UI.showStatus('Đã xóa nhật ký.');
    if (UI.elements.runLogsTable) UI.renderLogs([]);
  },

  async handleResetSeenTopics() {
    // Remove seenTopics from storage
    await Storage.remove('seenTopics');
    UI.showStatus('Đã đặt lại danh sách chủ đề đã dùng.');
  },
  
};

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
