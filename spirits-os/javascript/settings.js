(() => {
  "use strict";

  const VALID_TABS = new Set(["general", "security", "notifications", "pos", "backup"]);

  document.addEventListener("DOMContentLoaded", initializeSettingsPage);

  function initializeSettingsPage() {
    const STORAGE_KEY = "spirits-os-settings-config";
    const NOTIFICATION_READ_KEY = "spirits-os-settings-notifications-read-at";
    const LAST_BACKUP_KEY = "spirits-os-last-backup-at";

    const elements = {
      liveClock: document.getElementById("liveClock"),
      dayName: document.getElementById("dayName"),
      todayDate: document.getElementById("todayDate"),

      settingsTabs: document.getElementById("settingsTabs"),
      panels: document.querySelectorAll(".settings-panel"),

      saveAllSettingsBtn: document.getElementById("saveAllSettingsBtn"),
      systemHealthMessage: document.getElementById("systemHealthMessage"),
      backupStatusLine: document.getElementById("backupStatusLine"),

      pharmacyNameInput: document.getElementById("pharmacyNameInput"),
      inventoryThresholdInput: document.getElementById("inventoryThresholdInput"),
      receiptFooterInput: document.getElementById("receiptFooterInput"),
      timezoneLabel: document.getElementById("timezoneLabel"),

      sessionTimeoutToggle: document.getElementById("sessionTimeoutToggle"),
      passwordComplexityToggle: document.getElementById("passwordComplexityToggle"),
      twoFactorToggle: document.getElementById("twoFactorToggle"),

      lowStockToggle: document.getElementById("lowStockToggle"),
      expiryToggle: document.getElementById("expiryToggle"),
      salesSummaryToggle: document.getElementById("salesSummaryToggle"),
      adminEmailInput: document.getElementById("adminEmailInput"),

      printerNameInput: document.getElementById("printerNameInput"),
      taxLabelInput: document.getElementById("taxLabelInput"),
      autoPrintToggle: document.getElementById("autoPrintToggle"),
      showSkuToggle: document.getElementById("showSkuToggle"),

      manualBackupBtn: document.getElementById("manualBackupBtn"),
      restoreBackupBtn: document.getElementById("restoreBackupBtn"),

      notificationList: document.querySelector("[data-notification-list]"),
      notificationCount: document.querySelector("[data-notification-count]"),
      markAllReadBtn: document.querySelector("[data-mark-all-read]"),

      toastStack: document.getElementById("toastStack")
    };

    const state = {
      activeTab: getTabFromLocation(),
      settings: readSettings()
    };

    bindEvents();
    fillForm();
    setActiveTab(state.activeTab, { updateHash: false });
    updateClock();
    renderHealth();
    renderNotifications();
    window.setInterval(updateClock, 1000);

    function bindEvents() {
      if (elements.settingsTabs) {
        elements.settingsTabs.addEventListener("click", (event) => {
          const button = event.target.closest(".settings-tab");
          if (!button) return;

          const tab = button.getAttribute("data-tab");
          if (!tab) return;

          setActiveTab(tab);
        });
      }

      if (elements.saveAllSettingsBtn) {
        elements.saveAllSettingsBtn.addEventListener("click", handleSaveAll);
      }

      if (elements.manualBackupBtn) {
        elements.manualBackupBtn.addEventListener("click", () => {
          localStorage.setItem(LAST_BACKUP_KEY, new Date().toISOString());
          renderHealth();
          renderNotifications();
          showToast("success", "Manual backup queued", "A manual backup was recorded successfully.");
        });
      }

      if (elements.restoreBackupBtn) {
        elements.restoreBackupBtn.addEventListener("click", () => {
          window.location.href = "backup-restore.html";
        });
      }

      window.addEventListener("hashchange", () => {
        setActiveTab(getTabFromLocation(), { updateHash: false });
      });

      document.querySelectorAll("[data-inline-action='timezone']").forEach((button) => {
        button.addEventListener("click", () => {
          const next =
            state.settings.timezone === "(GMT+08:00) Manila, Philippines"
              ? "(GMT+08:00) Singapore"
              : "(GMT+08:00) Manila, Philippines";

          state.settings.timezone = next;
          if (elements.timezoneLabel) {
            elements.timezoneLabel.textContent = next;
          }
          showToast("info", "Timezone updated", "Timezone value changed locally. Save to keep changes.");
        });
      });

      if (elements.markAllReadBtn) {
        elements.markAllReadBtn.addEventListener("click", () => {
          localStorage.setItem(NOTIFICATION_READ_KEY, new Date().toISOString());
          renderNotifications();
          showToast("success", "Notifications cleared", "All settings notifications were marked as read.");
        });
      }
    }

    function setActiveTab(tab, options = {}) {
      const safeTab = VALID_TABS.has(tab) ? tab : "general";
      const shouldUpdateHash = options.updateHash !== false;

      state.activeTab = safeTab;

      document.querySelectorAll(".settings-tab").forEach((button) => {
        button.classList.toggle("is-active", button.getAttribute("data-tab") === safeTab);
      });

      elements.panels.forEach((panel) => {
        panel.classList.toggle("is-active", panel.id === `panel-${safeTab}`);
      });

      if (shouldUpdateHash) {
        updateLocationHash(safeTab);
      }
    }

    function getTabFromLocation() {
      const rawHash = String(window.location.hash || "").replace(/^#/, "");
      const tab = rawHash.startsWith("panel-") ? rawHash.slice(6) : rawHash;
      return VALID_TABS.has(tab) ? tab : "general";
    }

    function updateLocationHash(tab) {
      const nextHash = `#panel-${tab}`;

      if (window.location.hash === nextHash) {
        return;
      }

      if (window.history && typeof window.history.replaceState === "function") {
        window.history.replaceState({}, document.title, nextHash);
      } else {
        window.location.hash = nextHash;
      }
    }

    function handleSaveAll() {
      state.settings.pharmacyName = valueOf(elements.pharmacyNameInput);
      state.settings.inventoryThreshold = Number(valueOf(elements.inventoryThresholdInput)) || 60;
      state.settings.receiptFooter = valueOf(elements.receiptFooterInput);
      state.settings.timezone = elements.timezoneLabel?.textContent?.trim() || state.settings.timezone;

      state.settings.sessionTimeout = checked(elements.sessionTimeoutToggle);
      state.settings.passwordComplexity = checked(elements.passwordComplexityToggle);
      state.settings.twoFactor = checked(elements.twoFactorToggle);

      state.settings.lowStockAlerts = checked(elements.lowStockToggle);
      state.settings.expiryAlerts = checked(elements.expiryToggle);
      state.settings.salesSummary = checked(elements.salesSummaryToggle);
      state.settings.adminEmail = valueOf(elements.adminEmailInput);

      state.settings.printerName = valueOf(elements.printerNameInput);
      state.settings.taxLabel = valueOf(elements.taxLabelInput);
      state.settings.autoPrint = checked(elements.autoPrintToggle);
      state.settings.showSku = checked(elements.showSkuToggle);

      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.settings));
      renderHealth();
      renderNotifications();
      showToast("success", "Settings saved", "All configuration changes were saved successfully.");
    }

    function fillForm() {
      if (elements.pharmacyNameInput) elements.pharmacyNameInput.value = state.settings.pharmacyName;
      if (elements.inventoryThresholdInput) elements.inventoryThresholdInput.value = String(state.settings.inventoryThreshold);
      if (elements.receiptFooterInput) elements.receiptFooterInput.value = state.settings.receiptFooter;
      if (elements.timezoneLabel) elements.timezoneLabel.textContent = state.settings.timezone;

      if (elements.sessionTimeoutToggle) elements.sessionTimeoutToggle.checked = state.settings.sessionTimeout;
      if (elements.passwordComplexityToggle) elements.passwordComplexityToggle.checked = state.settings.passwordComplexity;
      if (elements.twoFactorToggle) elements.twoFactorToggle.checked = state.settings.twoFactor;

      if (elements.lowStockToggle) elements.lowStockToggle.checked = state.settings.lowStockAlerts;
      if (elements.expiryToggle) elements.expiryToggle.checked = state.settings.expiryAlerts;
      if (elements.salesSummaryToggle) elements.salesSummaryToggle.checked = state.settings.salesSummary;
      if (elements.adminEmailInput) elements.adminEmailInput.value = state.settings.adminEmail;

      if (elements.printerNameInput) elements.printerNameInput.value = state.settings.printerName;
      if (elements.taxLabelInput) elements.taxLabelInput.value = state.settings.taxLabel;
      if (elements.autoPrintToggle) elements.autoPrintToggle.checked = state.settings.autoPrint;
      if (elements.showSkuToggle) elements.showSkuToggle.checked = state.settings.showSku;
    }

    function renderHealth() {
      const lastBackupAt = localStorage.getItem(LAST_BACKUP_KEY);
      const backupText = lastBackupAt ? `Last backup performed ${formatRelativeTime(lastBackupAt)}.` : "Backup has not been performed yet.";
      const secureText = state.settings.twoFactor
        ? "Two-factor authentication enabled."
        : "Two-factor authentication still optional.";

      if (elements.systemHealthMessage) {
        elements.systemHealthMessage.textContent = `All systems operational. ${backupText} ${secureText}`;
      }

      if (elements.backupStatusLine) {
        elements.backupStatusLine.textContent = lastBackupAt
          ? `Last backup successful: ${formatDateTime(lastBackupAt)}`
          : "Last backup successful: No backup recorded";
      }
    }

    function renderNotifications() {
      if (!elements.notificationList || !elements.notificationCount) return;

      const notifications = buildNotifications();
      const lastReadAt = localStorage.getItem(NOTIFICATION_READ_KEY);

      const unread = notifications.filter((item) => {
        if (!lastReadAt) return true;
        return new Date(item.timestamp).getTime() > new Date(lastReadAt).getTime();
      }).length;

      elements.notificationCount.textContent = String(unread);

      if (!notifications.length) {
        elements.notificationList.innerHTML = `
          <div class="notification-item">
            <div class="notification-item-dot success"></div>
            <div class="notification-item-copy">
              <strong>No configuration alerts</strong>
              <p>Your system settings are stable right now.</p>
            </div>
          </div>
        `;
        return;
      }

      elements.notificationList.innerHTML = notifications
        .map((item) => {
          return `
            <div class="notification-item">
              <div class="notification-item-dot ${escapeHtml(item.tone)}"></div>
              <div class="notification-item-copy">
                <strong>${escapeHtml(item.title)}</strong>
                <p>${escapeHtml(item.message)}</p>
                <span>${escapeHtml(formatDateTime(item.timestamp))}</span>
              </div>
            </div>
          `;
        })
        .join("");
    }

    function buildNotifications() {
      const items = [];
      const now = new Date().toISOString();
      const lastBackupAt = localStorage.getItem(LAST_BACKUP_KEY);

      items.push({
        tone: "success",
        title: "Settings workspace ready",
        message: `${state.settings.pharmacyName} preferences loaded successfully.`,
        timestamp: now
      });

      if (lastBackupAt) {
        items.push({
          tone: "info",
          title: "Backup status",
          message: `Most recent backup was ${formatRelativeTime(lastBackupAt).toLowerCase()}.`,
          timestamp: lastBackupAt
        });
      }

      if (!state.settings.twoFactor) {
        items.push({
          tone: "warning",
          title: "Security recommendation",
          message: "Enable two-factor authentication for stronger administrator protection.",
          timestamp: now
        });
      }

      return items.slice(0, 5);
    }

    function readSettings() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const saved = raw ? JSON.parse(raw) : {};
        return {
          pharmacyName: saved.pharmacyName || "Spirit's Drugstore",
          inventoryThreshold: Number(saved.inventoryThreshold) || 60,
          receiptFooter: saved.receiptFooter || "Thank you for your trust!",
          timezone: saved.timezone || "(GMT+08:00) Manila, Philippines",

          sessionTimeout: saved.sessionTimeout ?? true,
          passwordComplexity: saved.passwordComplexity ?? true,
          twoFactor: saved.twoFactor ?? false,

          lowStockAlerts: saved.lowStockAlerts ?? true,
          expiryAlerts: saved.expiryAlerts ?? true,
          salesSummary: saved.salesSummary ?? false,
          adminEmail: saved.adminEmail || "admin@spirits.com",

          printerName: saved.printerName || "EPSON TM-T82X",
          taxLabel: saved.taxLabel || "VAT Inclusive",
          autoPrint: saved.autoPrint ?? true,
          showSku: saved.showSku ?? false
        };
      } catch (error) {
        return {
          pharmacyName: "Spirit's Drugstore",
          inventoryThreshold: 60,
          receiptFooter: "Thank you for your trust!",
          timezone: "(GMT+08:00) Manila, Philippines",

          sessionTimeout: true,
          passwordComplexity: true,
          twoFactor: false,

          lowStockAlerts: true,
          expiryAlerts: true,
          salesSummary: false,
          adminEmail: "admin@spirits.com",

          printerName: "EPSON TM-T82X",
          taxLabel: "VAT Inclusive",
          autoPrint: true,
          showSku: false
        };
      }
    }

    function valueOf(element) {
      return element ? String(element.value || "").trim() : "";
    }

    function checked(element) {
      return Boolean(element && element.checked);
    }

    function updateClock() {
      const now = new Date();

      if (elements.liveClock) {
        elements.liveClock.textContent = now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false
        });
      }

      if (elements.dayName) {
        elements.dayName.textContent = now.toLocaleDateString("en-US", {
          weekday: "long"
        });
      }

      if (elements.todayDate) {
        elements.todayDate.textContent = now.toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric"
        });
      }
    }

    function formatRelativeTime(value) {
      const diff = Math.max(0, Date.now() - new Date(value).getTime());
      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(diff / 3600000);
      const days = Math.floor(diff / 86400000);

      if (minutes < 1) return "just now";
      if (minutes < 60) return `${minutes} minutes ago`;
      if (hours < 24) return `${hours} hours ago`;
      return `${days} days ago`;
    }

    function formatDateTime(value) {
      return new Date(value).toLocaleString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    }

    function showToast(tone, title, message) {
      if (!elements.toastStack) return;

      const toast = document.createElement("div");
      toast.className = `toast ${tone}`;
      toast.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
        </svg>
        <div class="toast-copy">
          <strong>${escapeHtml(title)}</strong>
          <p>${escapeHtml(message)}</p>
        </div>
      `;

      elements.toastStack.appendChild(toast);

      window.setTimeout(() => {
        toast.remove();
      }, 3200);
    }

    function escapeHtml(value) {
      return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
    }
  }
})();
