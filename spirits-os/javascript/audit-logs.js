(() => {
  "use strict";

  document.addEventListener("DOMContentLoaded", initializeAuditLogsPage);

  function initializeAuditLogsPage() {
    const STORAGE_KEYS = {
      logs: "spirits-os-audit-logs",
      notificationsReadAt: "spirits-os-audit-logs-notifications-read-at"
    };

    const elements = {
      liveClock: document.getElementById("liveClock"),
      dayName: document.getElementById("dayName"),
      todayDate: document.getElementById("todayDate"),

      auditUsersChip: document.getElementById("auditUsersChip"),
      exportAuditBtn: document.getElementById("exportAuditBtn"),
      securityOverviewBtn: document.getElementById("securityOverviewBtn"),

      auditSearchInput: document.getElementById("auditSearchInput"),
      toggleModuleFilterBtn: document.getElementById("toggleModuleFilterBtn"),
      toggleDateFilterBtn: document.getElementById("toggleDateFilterBtn"),
      moduleFilterPanel: document.getElementById("moduleFilterPanel"),
      dateFilterPanel: document.getElementById("dateFilterPanel"),
      selectedModuleLabel: document.getElementById("selectedModuleLabel"),
      selectedDateRangeLabel: document.getElementById("selectedDateRangeLabel"),

      auditTableBody: document.getElementById("auditTableBody"),
      auditResultsMeta: document.getElementById("auditResultsMeta"),
      auditPagination: document.getElementById("auditPagination"),

      auditDetailModal: document.getElementById("auditDetailModal"),
      auditDetailBody: document.getElementById("auditDetailBody"),
      closeAuditDetailModalBtn: document.getElementById("closeAuditDetailModalBtn"),
      closeAuditDetailBtn: document.getElementById("closeAuditDetailBtn"),

      notificationList: document.querySelector("[data-notification-list]"),
      notificationCount: document.querySelector("[data-notification-count]"),
      markAllReadBtn: document.querySelector("[data-mark-all-read]"),

      toastStack: document.getElementById("toastStack")
    };

    const state = {
      logs: readJson(STORAGE_KEYS.logs, getFallbackLogs()).map(normalizeLog),
      searchTerm: "",
      moduleFilter: "all",
      dateFilter: "all",
      currentPage: 1,
      pageSize: 6,
      selectedLogId: null
    };

    bindEvents();
    updateClock();
    window.setInterval(updateClock, 1000);
    renderAll();

    function bindEvents() {
      if (elements.exportAuditBtn) {
        elements.exportAuditBtn.addEventListener("click", exportLogs);
      }

      if (elements.securityOverviewBtn) {
        elements.securityOverviewBtn.addEventListener("click", showSecurityOverview);
      }

      if (elements.auditSearchInput) {
        elements.auditSearchInput.addEventListener("input", (event) => {
          state.searchTerm = String(event.target.value || "").trim().toLowerCase();
          state.currentPage = 1;
          renderTable();
        });
      }

      if (elements.toggleModuleFilterBtn) {
        elements.toggleModuleFilterBtn.addEventListener("click", () => {
          const willOpen = elements.moduleFilterPanel.hidden;
          elements.moduleFilterPanel.hidden = !willOpen;
          elements.dateFilterPanel.hidden = true;
          elements.toggleModuleFilterBtn.setAttribute("aria-expanded", String(willOpen));
          elements.toggleDateFilterBtn?.setAttribute("aria-expanded", "false");
        });
      }

      if (elements.toggleDateFilterBtn) {
        elements.toggleDateFilterBtn.addEventListener("click", () => {
          const willOpen = elements.dateFilterPanel.hidden;
          elements.dateFilterPanel.hidden = !willOpen;
          elements.moduleFilterPanel.hidden = true;
          elements.toggleDateFilterBtn.setAttribute("aria-expanded", String(willOpen));
          elements.toggleModuleFilterBtn?.setAttribute("aria-expanded", "false");
        });
      }

      document.querySelectorAll(".module-option").forEach((button) => {
        button.addEventListener("click", () => {
          state.moduleFilter = button.dataset.moduleValue || "all";
          state.currentPage = 1;
          updateModuleFilterUI();
          renderTable();
        });
      });

      document.querySelectorAll(".date-option").forEach((button) => {
        button.addEventListener("click", () => {
          state.dateFilter = button.dataset.dateValue || "all";
          state.currentPage = 1;
          updateDateFilterUI();
          renderTable();
        });
      });

      if (elements.auditTableBody) {
        elements.auditTableBody.addEventListener("click", (event) => {
          const button = event.target.closest("[data-action='view']");
          if (!button) return;

          const id = button.getAttribute("data-id");
          const entry = state.logs.find((item) => item.id === id);
          if (!entry) return;

          state.selectedLogId = id;
          openDetailModal(entry);
        });
      }

      if (elements.auditPagination) {
        elements.auditPagination.addEventListener("click", (event) => {
          const button = event.target.closest("[data-page]");
          if (!button) return;

          const page = Number(button.getAttribute("data-page"));
          if (!Number.isFinite(page)) return;

          state.currentPage = page;
          renderTable();
        });
      }

      if (elements.closeAuditDetailModalBtn) {
        elements.closeAuditDetailModalBtn.addEventListener("click", closeDetailModal);
      }

      if (elements.closeAuditDetailBtn) {
        elements.closeAuditDetailBtn.addEventListener("click", closeDetailModal);
      }

      if (elements.auditDetailModal) {
        elements.auditDetailModal.addEventListener("click", (event) => {
          if (event.target === elements.auditDetailModal) {
            closeDetailModal();
          }
        });
      }

      if (elements.markAllReadBtn) {
        elements.markAllReadBtn.addEventListener("click", () => {
          localStorage.setItem(STORAGE_KEYS.notificationsReadAt, new Date().toISOString());
          renderNotifications();
          showToast("success", "Notifications cleared", "All audit notifications were marked as read.");
        });
      }

      document.addEventListener("click", (event) => {
        if (!event.target.closest(".filter-group")) {
          elements.moduleFilterPanel.hidden = true;
          elements.dateFilterPanel.hidden = true;
          elements.toggleModuleFilterBtn?.setAttribute("aria-expanded", "false");
          elements.toggleDateFilterBtn?.setAttribute("aria-expanded", "false");
        }
      });

      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !elements.auditDetailModal.hidden) {
          closeDetailModal();
        }
      });
    }

    function renderAll() {
      updateModuleFilterUI();
      updateDateFilterUI();
      renderAuditUsers();
      renderTable();
      renderNotifications();
    }

    function renderAuditUsers() {
      if (!elements.auditUsersChip) return;

      const users = [...new Set(state.logs.map((item) => item.user))].slice(0, 4);
      const extra = Math.max(0, new Set(state.logs.map((item) => item.user)).size - users.length);

      elements.auditUsersChip.innerHTML = users
        .map((name) => `<span class="audit-user-bubble" title="${escapeHtml(name)}">${escapeHtml(getInitials(name))}</span>`)
        .join("") + (extra > 0 ? `<span class="audit-user-more">+${extra}</span>` : "");
    }

    function updateModuleFilterUI() {
      const labels = {
        all: "All Modules",
        Users: "Users",
        Auth: "Auth",
        Inventory: "Inventory",
        Reports: "Reports"
      };

      if (elements.selectedModuleLabel) {
        elements.selectedModuleLabel.textContent = labels[state.moduleFilter] || "All Modules";
      }

      document.querySelectorAll(".module-option").forEach((button) => {
        button.classList.toggle("is-active", button.dataset.moduleValue === state.moduleFilter);
      });

      if (elements.moduleFilterPanel) {
        elements.moduleFilterPanel.hidden = true;
      }
      elements.toggleModuleFilterBtn?.setAttribute("aria-expanded", "false");
    }

    function updateDateFilterUI() {
      const labels = {
        all: "Date Range",
        today: "Today",
        "7days": "Last 7 Days",
        "30days": "Last 30 Days"
      };

      if (elements.selectedDateRangeLabel) {
        elements.selectedDateRangeLabel.textContent = labels[state.dateFilter] || "Date Range";
      }

      document.querySelectorAll(".date-option").forEach((button) => {
        button.classList.toggle("is-active", button.dataset.dateValue === state.dateFilter);
      });

      if (elements.dateFilterPanel) {
        elements.dateFilterPanel.hidden = true;
      }
      elements.toggleDateFilterBtn?.setAttribute("aria-expanded", "false");
    }

    function renderTable() {
      if (!elements.auditTableBody || !elements.auditResultsMeta || !elements.auditPagination) return;

      const filtered = getFilteredLogs();
      const total = filtered.length;
      const totalPages = Math.max(1, Math.ceil(total / state.pageSize));

      if (state.currentPage > totalPages) {
        state.currentPage = totalPages;
      }

      const startIndex = (state.currentPage - 1) * state.pageSize;
      const pageRows = filtered.slice(startIndex, startIndex + state.pageSize);

      if (!pageRows.length) {
        elements.auditTableBody.innerHTML = `
          <tr>
            <td colspan="6">
              <div class="audit-empty">
                <div class="audit-empty__card">
                  <div class="audit-empty__icon">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M12 8v4l2.5 1.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
                      <circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="1.8"></circle>
                    </svg>
                  </div>
                  <h3>No audit entries found</h3>
                  <p>Try a different search term or adjust the module and date filters.</p>
                </div>
              </div>
            </td>
          </tr>
        `;
        elements.auditResultsMeta.textContent = "Showing 0 to 0 of 0 entries";
        renderPagination(totalPages);
        return;
      }

      elements.auditTableBody.innerHTML = pageRows.map((entry) => {
        return `
          <tr>
            <td>
              <div class="timestamp-cell">
                <strong>${escapeHtml(formatDate(entry.timestamp))}</strong>
                <span>${escapeHtml(formatTime(entry.timestamp))}</span>
              </div>
            </td>
            <td>
              <div class="audit-user-cell">
                <span class="audit-avatar">${escapeHtml(getInitials(entry.user))}</span>
                <strong>${escapeHtml(entry.user)}</strong>
              </div>
            </td>
            <td>
              <span class="module-pill">${escapeHtml(entry.module)}</span>
            </td>
            <td>
              <span class="action-pill">
                <span class="action-pill__dot ${escapeHtml(getActionTone(entry.action))}">
                  ${getActionIcon(entry.action)}
                </span>
                ${escapeHtml(entry.action)}
              </span>
            </td>
            <td>
              <span class="audit-details">${escapeHtml(entry.details)}</span>
            </td>
            <td class="actions-col">
              <button
                type="button"
                class="view-btn"
                data-action="view"
                data-id="${escapeHtml(entry.id)}"
                aria-label="View audit entry"
                title="View"
              >
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M2.5 12s3.5-5.5 9.5-5.5S21.5 12 21.5 12 18 17.5 12 17.5 2.5 12 2.5 12Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"></path>
                  <circle cx="12" cy="12" r="2.5" stroke="currentColor" stroke-width="1.8"></circle>
                </svg>
              </button>
            </td>
          </tr>
        `;
      }).join("");

      const from = total ? startIndex + 1 : 0;
      const to = Math.min(startIndex + pageRows.length, total);
      elements.auditResultsMeta.textContent = `Showing ${from} to ${to} of ${total} entries`;
      renderPagination(totalPages);
    }

    function renderPagination(totalPages) {
      if (!elements.auditPagination) return;

      const pages = [];
      for (let page = 1; page <= totalPages; page += 1) {
        pages.push(`
          <button
            type="button"
            class="page-btn ${page === state.currentPage ? "active" : ""}"
            data-page="${page}"
          >
            ${page}
          </button>
        `);
      }

      elements.auditPagination.innerHTML = pages.join("");
    }

    function openDetailModal(entry) {
      if (!elements.auditDetailModal || !elements.auditDetailBody) return;

      elements.auditDetailBody.innerHTML = `
        <div class="detail-grid">
          <div class="detail-item">
            <span>User</span>
            <strong>${escapeHtml(entry.user)}</strong>
          </div>
          <div class="detail-item">
            <span>Module</span>
            <strong>${escapeHtml(entry.module)}</strong>
          </div>
          <div class="detail-item">
            <span>Action</span>
            <strong>${escapeHtml(entry.action)}</strong>
          </div>
          <div class="detail-item">
            <span>Timestamp</span>
            <strong>${escapeHtml(formatDateTime(entry.timestamp))}</strong>
          </div>
        </div>

        <div class="detail-item">
          <span>Details</span>
          <p>${escapeHtml(entry.details)}</p>
        </div>
      `;

      elements.auditDetailModal.hidden = false;
      document.body.classList.add("has-open-dialog");
    }

    function closeDetailModal() {
      if (!elements.auditDetailModal) return;

      elements.auditDetailModal.hidden = true;
      document.body.classList.remove("has-open-dialog");
      state.selectedLogId = null;
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
              <strong>No audit alerts</strong>
              <p>Your security audit workspace has no recent alerts.</p>
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
      const items = [];
      const latest = [...state.logs].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
      const loginCount = state.logs.filter((item) => item.action === "Login").length;
      const createCount = state.logs.filter((item) => item.action === "Create").length;

      if (latest) {
        items.push({
          tone: "success",
          title: "Latest audit event captured",
          message: `${latest.user} triggered ${latest.action.toLowerCase()} under ${latest.module}.`,
          timestamp: latest.timestamp
        });
      }

      items.push({
        tone: "info",
        title: "Audit summary",
        message: `${createCount} create event${createCount === 1 ? "" : "s"} and ${loginCount} login event${loginCount === 1 ? "" : "s"} recorded.`,
        timestamp: new Date().toISOString()
      });

      if (state.logs.some((item) => item.module === "Auth")) {
        items.push({
          tone: "warning",
          title: "Authentication activity detected",
          message: "Recent authentication events are present in the audit stream.",
          timestamp: new Date().toISOString()
        });
      }

      return items.slice(0, 5);
    }

    function showSecurityOverview() {
      const total = state.logs.length;
      const modules = [...new Set(state.logs.map((item) => item.module))].length;
      const actors = [...new Set(state.logs.map((item) => item.user))].length;

      showToast(
        "info",
        "Security overview",
        `${total} audit entries across ${modules} modules by ${actors} unique actors.`
      );
    }

    function exportLogs() {
      if (!state.logs.length) {
        showToast("warning", "Nothing to export", "There are no audit entries to export.");
        return;
      }

      const lines = [
        ["Timestamp", "User", "Module", "Action", "Details"].join(",")
      ];

      state.logs.forEach((entry) => {
        lines.push([
          csvSafe(entry.timestamp),
          csvSafe(entry.user),
          csvSafe(entry.module),
          csvSafe(entry.action),
          csvSafe(entry.details)
        ].join(","));
      });

      const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "spirits-os-audit-logs.csv";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showToast("success", "Export ready", "The audit trail was exported successfully.");
    }

    function getFilteredLogs() {
      return state.logs.filter((entry) => {
        const haystack = [
          entry.user,
          entry.module,
          entry.action,
          entry.details
        ].join(" ").toLowerCase();

        const matchesSearch = !state.searchTerm || haystack.includes(state.searchTerm);
        const matchesModule = state.moduleFilter === "all" || entry.module === state.moduleFilter;
        const matchesDate = matchesDateFilter(entry.timestamp, state.dateFilter);

        return matchesSearch && matchesModule && matchesDate;
      });
    }

    function matchesDateFilter(timestamp, dateFilter) {
      if (dateFilter === "all") return true;

      const now = new Date();
      const target = new Date(timestamp);

      if (dateFilter === "today") {
        return target.toDateString() === now.toDateString();
      }

      if (dateFilter === "7days") {
        const sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(now.getDate() - 7);
        return target >= sevenDaysAgo;
      }

      if (dateFilter === "30days") {
        const thirtyDaysAgo = new Date(now);
        thirtyDaysAgo.setDate(now.getDate() - 30);
        return target >= thirtyDaysAgo;
      }

      return true;
    }

    function normalizeLog(item) {
      return {
        id: String(item.id || createId()),
        timestamp: item.timestamp || new Date().toISOString(),
        user: String(item.user || "System").trim(),
        module: String(item.module || "Users").trim(),
        action: String(item.action || "Update").trim(),
        details: String(item.details || "").trim()
      };
    }

    function readJson(key, fallback) {
      try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
      } catch (error) {
        return fallback;
      }
    }

    function getInitials(name) {
      const parts = String(name || "").trim().split(/\s+/).filter(Boolean);
      return parts.slice(0, 2).map((part) => part.charAt(0).toUpperCase()).join("") || "S";
    }

    function getActionTone(action) {
      if (action === "Create") return "success";
      if (action === "Login") return "info";
      if (action === "Delete") return "error";
      return "warning";
    }

    function getActionIcon(action) {
      if (action === "Create") {
        return `
          <svg viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="1.8"></circle>
            <path d="M12 8v8M8 12h8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
          </svg>
        `;
      }

      if (action === "Login") {
        return `
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M10 17l5-5-5-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
            <path d="M15 12H4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
          </svg>
        `;
      }

      if (action === "Delete") {
        return `
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M5 7h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
            <path d="M9 7V5h6v2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
          </svg>
        `;
      }

      return `
        <svg viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="1.8"></circle>
          <path d="M12 8v4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
          <circle cx="12" cy="16" r="1" fill="currentColor"></circle>
        </svg>
      `;
    }

    function createId() {
      return `log-${Math.random().toString(36).slice(2, 10)}-${Date.now().toString(36)}`;
    }

    function csvSafe(value) {
      const stringValue = String(value ?? "");
      return `"${stringValue.replace(/"/g, '""')}"`;
    }

    function formatDate(value) {
      return new Date(value).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric"
      });
    }

    function formatTime(value) {
      return new Date(value).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      });
    }

    function formatDateTime(value) {
      return new Date(value).toLocaleString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
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

    function getFallbackLogs() {
      return [
        {
          id: "log-001",
          timestamp: "2026-04-17T00:10:13",
          user: "System",
          module: "Users",
          action: "Create",
          details: "Created user account: matt"
        },
        {
          id: "log-002",
          timestamp: "2026-04-17T00:09:56",
          user: "System",
          module: "Users",
          action: "Create",
          details: "Created user account: undefined"
        },
        {
          id: "log-003",
          timestamp: "2026-04-16T23:48:59",
          user: "System Administrator",
          module: "Auth",
          action: "Login",
          details: "Administrator logged in"
        }
      ];
    }
  }
})();