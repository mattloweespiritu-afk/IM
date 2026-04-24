(() => {
  "use strict";

  document.addEventListener("DOMContentLoaded", initializeBackupRestorePage);

  function initializeBackupRestorePage() {
    const STORAGE_KEYS = {
      lastBackupAt: "spirits-os-last-backup-at",
      notificationsReadAt: "spirits-os-backup-notifications-read-at",
      demoCategories: "spirits-os-categories",
      demoSuppliers: "spirits-os-suppliers",
      demoUsers: "spirits-os-users",
      demoAuditLogs: "spirits-os-audit-logs"
    };

    const elements = {
      liveClock: document.getElementById("liveClock"),
      dayName: document.getElementById("dayName"),
      todayDate: document.getElementById("todayDate"),

      lastBackupChip: document.getElementById("lastBackupChip"),
      downloadBackupBtn: document.getElementById("downloadBackupBtn"),
      selectRestoreFileBtn: document.getElementById("selectRestoreFileBtn"),
      restoreFileInput: document.getElementById("restoreFileInput"),
      selectedRestoreFileLabel: document.getElementById("selectedRestoreFileLabel"),
      runRestoreBtn: document.getElementById("runRestoreBtn"),

      restoreConfirmModal: document.getElementById("restoreConfirmModal"),
      restoreConfirmBody: document.getElementById("restoreConfirmBody"),
      closeRestoreConfirmModalBtn: document.getElementById("closeRestoreConfirmModalBtn"),
      cancelRestoreBtn: document.getElementById("cancelRestoreBtn"),
      confirmRestoreBtn: document.getElementById("confirmRestoreBtn"),

      notificationList: document.querySelector("[data-notification-list]"),
      notificationCount: document.querySelector("[data-notification-count]"),
      markAllReadBtn: document.querySelector("[data-mark-all-read]"),

      toastStack: document.getElementById("toastStack")
    };

    const state = {
      selectedFileName: "",
      selectedBackup: null
    };

    bindEvents();
    ensureSeedData();
    updateClock();
    window.setInterval(updateClock, 1000);
    renderAll();

    function bindEvents() {
      if (elements.downloadBackupBtn) {
        elements.downloadBackupBtn.addEventListener("click", handleDownloadBackup);
      }

      if (elements.selectRestoreFileBtn) {
        elements.selectRestoreFileBtn.addEventListener("click", () => {
          elements.restoreFileInput?.click();
        });
      }

      if (elements.restoreFileInput) {
        elements.restoreFileInput.addEventListener("change", handleRestoreFileSelection);
      }

      if (elements.runRestoreBtn) {
        elements.runRestoreBtn.addEventListener("click", openRestoreConfirmModal);
      }

      if (elements.closeRestoreConfirmModalBtn) {
        elements.closeRestoreConfirmModalBtn.addEventListener("click", closeRestoreConfirmModal);
      }

      if (elements.cancelRestoreBtn) {
        elements.cancelRestoreBtn.addEventListener("click", closeRestoreConfirmModal);
      }

      if (elements.confirmRestoreBtn) {
        elements.confirmRestoreBtn.addEventListener("click", handleConfirmRestore);
      }

      if (elements.restoreConfirmModal) {
        elements.restoreConfirmModal.addEventListener("click", (event) => {
          if (event.target === elements.restoreConfirmModal) {
            closeRestoreConfirmModal();
          }
        });
      }

      if (elements.markAllReadBtn) {
        elements.markAllReadBtn.addEventListener("click", () => {
          localStorage.setItem(STORAGE_KEYS.notificationsReadAt, new Date().toISOString());
          renderNotifications();
          showToast("success", "Notifications cleared", "All backup notifications were marked as read.");
        });
      }

      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !elements.restoreConfirmModal?.hidden) {
          closeRestoreConfirmModal();
        }
      });
    }

    function ensureSeedData() {
      if (!localStorage.getItem(STORAGE_KEYS.demoCategories)) {
        localStorage.setItem(
          STORAGE_KEYS.demoCategories,
          JSON.stringify([
            { id: "cat-1", name: "Analgesics", status: "Active", medicineCount: 12 },
            { id: "cat-2", name: "Antibiotics", status: "Active", medicineCount: 8 }
          ])
        );
      }

      if (!localStorage.getItem(STORAGE_KEYS.demoSuppliers)) {
        localStorage.setItem(
          STORAGE_KEYS.demoSuppliers,
          JSON.stringify([
            {
              id: "sup-1",
              companyName: "Unilab",
              contactPerson: "John Doe",
              contactNumber: "09123456789",
              emailAddress: "info@unilab.com",
              officeAddress: "Manila",
              status: "Active",
              rating: 4
            }
          ])
        );
      }

      if (!localStorage.getItem(STORAGE_KEYS.demoUsers)) {
        localStorage.setItem(
          STORAGE_KEYS.demoUsers,
          JSON.stringify([
            {
              id: "usr-1",
              fullName: "System Administrator",
              username: "admin",
              role: "Admin",
              email: "admin@spirits.com",
              status: "Active",
              joinedDate: "2026-04-16",
              activeSessions: 4
            }
          ])
        );
      }

      if (!localStorage.getItem(STORAGE_KEYS.demoAuditLogs)) {
        localStorage.setItem(
          STORAGE_KEYS.demoAuditLogs,
          JSON.stringify([
            {
              id: "log-1",
              timestamp: "2026-04-16T23:48:59",
              user: "System Administrator",
              module: "Auth",
              action: "Login",
              details: "Administrator logged in"
            }
          ])
        );
      }

      if (!localStorage.getItem(STORAGE_KEYS.lastBackupAt)) {
        const seedDate = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
        localStorage.setItem(STORAGE_KEYS.lastBackupAt, seedDate);
      }
    }

    function renderAll() {
      renderLastBackup();
      renderRestoreState();
      renderNotifications();
    }

    function renderLastBackup() {
      if (!elements.lastBackupChip) return;

      const lastBackupAt = localStorage.getItem(STORAGE_KEYS.lastBackupAt);
      if (!lastBackupAt) {
        elements.lastBackupChip.textContent = "Last backup: Never";
        return;
      }

      elements.lastBackupChip.textContent = `Last backup: ${formatRelativeTime(lastBackupAt)}`;
    }

    function renderRestoreState() {
      if (elements.selectedRestoreFileLabel) {
        elements.selectedRestoreFileLabel.textContent = state.selectedFileName || "Select Backup File";
      }

      if (elements.runRestoreBtn) {
        elements.runRestoreBtn.disabled = !state.selectedBackup;
      }
    }

    function handleDownloadBackup() {
      const backupPayload = buildBackupPayload();
      const blob = new Blob([JSON.stringify(backupPayload, null, 2)], {
        type: "application/json;charset=utf-8;"
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

      link.href = url;
      link.download = `spirits-os-backup-${timestamp}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      localStorage.setItem(STORAGE_KEYS.lastBackupAt, new Date().toISOString());
      pushAuditEntry("System", "Backup", "Export", "Generated a full system backup file.");
      renderAll();
      showToast("success", "Backup downloaded", "The full system backup file is ready.");
    }

    function handleRestoreFileSelection(event) {
      const file = event.target.files && event.target.files[0];
      if (!file) {
        state.selectedFileName = "";
        state.selectedBackup = null;
        renderRestoreState();
        return;
      }

      const reader = new FileReader();

      reader.onload = () => {
        try {
          const parsed = JSON.parse(String(reader.result || "{}"));

          if (!parsed || typeof parsed !== "object" || !parsed.data) {
            throw new Error("Invalid backup structure");
          }

          state.selectedFileName = file.name;
          state.selectedBackup = parsed;
          renderRestoreState();
          showToast("info", "Backup file loaded", "The selected backup file is ready for validation.");
        } catch (error) {
          state.selectedFileName = "";
          state.selectedBackup = null;
          renderRestoreState();
          if (elements.restoreFileInput) {
            elements.restoreFileInput.value = "";
          }
          showToast("error", "Invalid backup file", "Please select a valid Spirit's OS backup JSON file.");
        }
      };

      reader.readAsText(file);
    }

    function openRestoreConfirmModal() {
      if (!state.selectedBackup || !elements.restoreConfirmModal || !elements.restoreConfirmBody) {
        return;
      }

      const summary = getBackupSummary(state.selectedBackup);

      elements.restoreConfirmBody.innerHTML = `
        <div class="confirm-panel">
          <span>Selected File</span>
          <strong>${escapeHtml(state.selectedFileName)}</strong>
          <p>${escapeHtml(summary.generatedAtText)}</p>
        </div>

        <div class="confirm-panel">
          <span>Included Records</span>
          <strong>${escapeHtml(summary.recordSummary)}</strong>
          <p>${escapeHtml(summary.moduleSummary)}</p>
        </div>

        <div class="confirm-panel">
          <span>Warning</span>
          <p>This restore will replace the local demo data for categories, suppliers, users, and audit logs stored in the browser.</p>
        </div>
      `;

      elements.restoreConfirmModal.hidden = false;
      document.body.classList.add("has-open-dialog");
    }

    function closeRestoreConfirmModal() {
      if (!elements.restoreConfirmModal) return;

      elements.restoreConfirmModal.hidden = true;
      document.body.classList.remove("has-open-dialog");
    }

    function handleConfirmRestore() {
      if (!state.selectedBackup) return;

      const data = state.selectedBackup.data || {};

      if (Array.isArray(data.categories)) {
        localStorage.setItem(STORAGE_KEYS.demoCategories, JSON.stringify(data.categories));
      }

      if (Array.isArray(data.suppliers)) {
        localStorage.setItem(STORAGE_KEYS.demoSuppliers, JSON.stringify(data.suppliers));
      }

      if (Array.isArray(data.users)) {
        localStorage.setItem(STORAGE_KEYS.demoUsers, JSON.stringify(data.users));
      }

      if (Array.isArray(data.auditLogs)) {
        localStorage.setItem(STORAGE_KEYS.demoAuditLogs, JSON.stringify(data.auditLogs));
      }

      localStorage.setItem(STORAGE_KEYS.lastBackupAt, new Date().toISOString());
      pushAuditEntry("System", "Backup", "Restore", `Restored system from backup file: ${state.selectedFileName}`);

      closeRestoreConfirmModal();

      if (elements.restoreFileInput) {
        elements.restoreFileInput.value = "";
      }

      state.selectedFileName = "";
      state.selectedBackup = null;

      renderAll();
      showToast("success", "Restore completed", "The backup data was restored successfully.");
    }

    function buildBackupPayload() {
      return {
        app: "Spirit's OS",
        version: "Pharmacy V1.0",
        generatedAt: new Date().toISOString(),
        data: {
          categories: readJson(STORAGE_KEYS.demoCategories, []),
          suppliers: readJson(STORAGE_KEYS.demoSuppliers, []),
          users: readJson(STORAGE_KEYS.demoUsers, []),
          auditLogs: readJson(STORAGE_KEYS.demoAuditLogs, [])
        }
      };
    }

    function getBackupSummary(backup) {
      const categories = Array.isArray(backup.data?.categories) ? backup.data.categories.length : 0;
      const suppliers = Array.isArray(backup.data?.suppliers) ? backup.data.suppliers.length : 0;
      const users = Array.isArray(backup.data?.users) ? backup.data.users.length : 0;
      const auditLogs = Array.isArray(backup.data?.auditLogs) ? backup.data.auditLogs.length : 0;
      const total = categories + suppliers + users + auditLogs;

      return {
        generatedAtText: backup.generatedAt
          ? `Generated ${formatDateTime(backup.generatedAt)}`
          : "Generated time unavailable",
        recordSummary: `${total} total records found`,
        moduleSummary: `${categories} categories, ${suppliers} suppliers, ${users} users, ${auditLogs} audit logs`
      };
    }

    function renderNotifications() {
      if (!elements.notificationList || !elements.notificationCount) return;

      const notifications = buildNotifications();
      const lastReadAt = localStorage.getItem(STORAGE_KEYS.notificationsReadAt);

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
              <strong>No maintenance alerts</strong>
              <p>Your backup workspace has no recent updates.</p>
            </div>
          </div>
        `;
        return;
      }

      elements.notificationList.innerHTML = notifications.map((item) => {
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
      }).join("");
    }

    function buildNotifications() {
      const lastBackupAt = localStorage.getItem(STORAGE_KEYS.lastBackupAt);
      const auditLogs = readJson(STORAGE_KEYS.demoAuditLogs, []);
      const restoreLogs = auditLogs.filter((item) => item.module === "Backup" && item.action === "Restore");
      const backupLogs = auditLogs.filter((item) => item.module === "Backup" && item.action === "Export");

      const items = [];

      if (lastBackupAt) {
        items.push({
          tone: "success",
          title: "Last backup recorded",
          message: `System backup completed ${formatRelativeTime(lastBackupAt).toLowerCase()}.`,
          timestamp: lastBackupAt
        });
      }

      if (restoreLogs.length) {
        const latestRestore = [...restoreLogs].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
        items.push({
          tone: "warning",
          title: "Recent restore detected",
          message: latestRestore.details,
          timestamp: latestRestore.timestamp
        });
      }

      items.push({
        tone: "info",
        title: "Backup activity summary",
        message: `${backupLogs.length} export event${backupLogs.length === 1 ? "" : "s"} and ${restoreLogs.length} restore event${restoreLogs.length === 1 ? "" : "s"} recorded.`,
        timestamp: new Date().toISOString()
      });

      return items.slice(0, 5);
    }

    function pushAuditEntry(user, module, action, details) {
      const auditLogs = readJson(STORAGE_KEYS.demoAuditLogs, []);
      auditLogs.unshift({
        id: `log-${Math.random().toString(36).slice(2, 10)}-${Date.now().toString(36)}`,
        timestamp: new Date().toISOString(),
        user,
        module,
        action,
        details
      });
      localStorage.setItem(STORAGE_KEYS.demoAuditLogs, JSON.stringify(auditLogs));
    }

    function readJson(key, fallback) {
      try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
      } catch (error) {
        return fallback;
      }
    }

    function formatRelativeTime(value) {
      const now = Date.now();
      const then = new Date(value).getTime();
      const diffMs = Math.max(0, now - then);

      const minutes = Math.floor(diffMs / 60000);
      const hours = Math.floor(diffMs / 3600000);
      const days = Math.floor(diffMs / 86400000);

      if (minutes < 1) return "Just now";
      if (minutes < 60) return `${minutes}m ago`;
      if (hours < 24) return `${hours}h ago`;
      return `${days}d ago`;
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