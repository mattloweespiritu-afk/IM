(() => {
  "use strict";

  document.addEventListener("DOMContentLoaded", initializeCategoriesPage);

  function initializeCategoriesPage() {
    const STORAGE_KEYS = {
      categories: "spirits-os-categories",
      notificationsReadAt: "spirits-os-categories-notifications-read-at"
    };

    const elements = {
      liveClock: document.getElementById("liveClock"),
      dayName: document.getElementById("dayName"),
      todayDate: document.getElementById("todayDate"),

      categoryForm: document.getElementById("categoryForm"),
      categoryNameInput: document.getElementById("categoryNameInput"),
      saveCategoryBtn: document.getElementById("saveCategoryBtn"),
      saveCategoryLabel: document.getElementById("saveCategoryLabel"),
      cancelEditBtn: document.getElementById("cancelEditBtn"),
      categoryCardTitle: document.getElementById("categoryCardTitle"),
      categoryCardSubtitle: document.getElementById("categoryCardSubtitle"),

      categorySearchInput: document.getElementById("categorySearchInput"),
      categoryTableBody: document.getElementById("categoryTableBody"),
      exportCategoriesBtn: document.getElementById("exportCategoriesBtn"),

      notificationList: document.querySelector("[data-notification-list]"),
      notificationCount: document.querySelector("[data-notification-count]"),
      markAllReadBtn: document.querySelector("[data-mark-all-read]"),

      toastStack: document.getElementById("toastStack")
    };

    const state = {
      categories: readJson(STORAGE_KEYS.categories, getFallbackCategories()).map(normalizeCategory),
      searchTerm: "",
      editingId: null
    };

    bindEvents();
    updateClock();
    window.setInterval(updateClock, 1000);
    renderAll();

    function bindEvents() {
      if (elements.categoryForm) {
        elements.categoryForm.addEventListener("submit", handleSubmitCategory);
      }

      if (elements.cancelEditBtn) {
        elements.cancelEditBtn.addEventListener("click", resetFormState);
      }

      if (elements.categorySearchInput) {
        elements.categorySearchInput.addEventListener("input", (event) => {
          state.searchTerm = String(event.target.value || "").trim().toLowerCase();
          renderTable();
        });
      }

      if (elements.exportCategoriesBtn) {
        elements.exportCategoriesBtn.addEventListener("click", exportCategories);
      }

      if (elements.categoryTableBody) {
        elements.categoryTableBody.addEventListener("click", handleTableActions);
      }

      if (elements.markAllReadBtn) {
        elements.markAllReadBtn.addEventListener("click", () => {
          localStorage.setItem(STORAGE_KEYS.notificationsReadAt, new Date().toISOString());
          renderNotifications();
          showToast("success", "Notifications cleared", "All category notifications were marked as read.");
        });
      }
    }

    function handleSubmitCategory(event) {
      event.preventDefault();

      const rawName = String(elements.categoryNameInput?.value || "").trim();
      const normalizedName = rawName.replace(/\s+/g, " ");

      if (!normalizedName) {
        showToast("warning", "Category required", "Please enter a category name before saving.");
        elements.categoryNameInput?.focus();
        return;
      }

      const duplicate = state.categories.find((item) => {
        const isSameName = item.name.toLowerCase() === normalizedName.toLowerCase();
        const isDifferentRecord = item.id !== state.editingId;
        return isSameName && isDifferentRecord;
      });

      if (duplicate) {
        showToast("warning", "Duplicate category", "This category name already exists in the list.");
        elements.categoryNameInput?.focus();
        return;
      }

      if (state.editingId) {
        const current = state.categories.find((item) => item.id === state.editingId);
        if (!current) return;

        current.name = normalizedName;
        current.updatedAt = new Date().toISOString();

        persistCategories();
        renderAll();
        resetFormState();
        showToast("success", "Category updated", "The category was updated successfully.");
        return;
      }

      state.categories.unshift({
        id: createId(),
        name: normalizedName,
        status: "Active",
        medicineCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      persistCategories();
      renderAll();
      resetFormState();
      showToast("success", "Category saved", "A new medicine category was added.");
    }

    function handleTableActions(event) {
      const trigger = event.target.closest("[data-action]");
      if (!trigger) return;

      const action = trigger.getAttribute("data-action");
      const id = trigger.getAttribute("data-id");
      const category = state.categories.find((item) => item.id === id);

      if (!category) return;

      if (action === "edit") {
        state.editingId = category.id;
        if (elements.categoryNameInput) {
          elements.categoryNameInput.value = category.name;
          elements.categoryNameInput.focus();
        }
        renderFormState();
        return;
      }

      if (action === "delete") {
        const shouldDelete = window.confirm(`Delete "${category.name}" from the category list?`);
        if (!shouldDelete) return;

        state.categories = state.categories.filter((item) => item.id !== id);

        if (state.editingId === id) {
          resetFormState();
        }

        persistCategories();
        renderAll();
        showToast("success", "Category deleted", "The category was removed from the list.");
      }
    }

    function renderAll() {
      renderFormState();
      renderTable();
      renderNotifications();
    }

    function renderFormState() {
      const editing = state.editingId
        ? state.categories.find((item) => item.id === state.editingId)
        : null;

      if (editing) {
        if (elements.categoryCardTitle) {
          elements.categoryCardTitle.textContent = "Edit Category";
        }
        if (elements.categoryCardSubtitle) {
          elements.categoryCardSubtitle.textContent = "Update the selected medicine classification.";
        }
        if (elements.saveCategoryLabel) {
          elements.saveCategoryLabel.textContent = "Save Changes";
        }
        if (elements.cancelEditBtn) {
          elements.cancelEditBtn.hidden = false;
        }
        return;
      }

      if (elements.categoryCardTitle) {
        elements.categoryCardTitle.textContent = "Create Category";
      }
      if (elements.categoryCardSubtitle) {
        elements.categoryCardSubtitle.textContent = "Define a new classification for medicines.";
      }
      if (elements.saveCategoryLabel) {
        elements.saveCategoryLabel.textContent = "Save Category";
      }
      if (elements.cancelEditBtn) {
        elements.cancelEditBtn.hidden = true;
      }
    }

    function renderTable() {
      if (!elements.categoryTableBody) return;

      const filtered = getFilteredCategories();

      if (!filtered.length) {
        elements.categoryTableBody.innerHTML = `
          <tr>
            <td colspan="4">
              <div class="category-empty">
                <div class="category-empty__card">
                  <div class="category-empty__icon">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M7.5 7.5h9M7.5 12h9M7.5 16.5h6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
                      <rect x="4" y="4" width="16" height="16" rx="3" stroke="currentColor" stroke-width="1.8"></rect>
                    </svg>
                  </div>
                  <h3>No categories found</h3>
                  <p>Try another search term or create a new category from the form.</p>
                </div>
              </div>
            </td>
          </tr>
        `;
        return;
      }

      elements.categoryTableBody.innerHTML = filtered.map((item) => {
        return `
          <tr>
            <td>
              <div class="category-name-cell">
                <span class="category-name-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M7.5 7.5h9M7.5 12h9M7.5 16.5h6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
                    <rect x="4" y="4" width="16" height="16" rx="3" stroke="currentColor" stroke-width="1.8"></rect>
                  </svg>
                </span>
                <div class="category-name-copy">
                  <strong>${escapeHtml(item.name)}</strong>
                </div>
              </div>
            </td>
            <td>
              <span class="category-status">${escapeHtml(item.status)}</span>
            </td>
            <td>
              <span class="category-count">
                <svg viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="7" stroke="currentColor" stroke-width="1.8"></circle>
                  <path d="M12 9v3l2 1.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
                </svg>
                ${escapeHtml(`${item.medicineCount} ${item.medicineCount === 1 ? "Item" : "Items"}`)}
              </span>
            </td>
            <td class="actions-col">
              <div class="row-actions">
                <button
                  type="button"
                  class="row-action-btn"
                  data-action="edit"
                  data-id="${escapeHtml(item.id)}"
                  aria-label="Edit ${escapeHtml(item.name)}"
                  title="Edit"
                >
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M4 20h4l10-10-4-4L4 16v4Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"></path>
                    <path d="M12 6l4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
                  </svg>
                </button>

                <button
                  type="button"
                  class="row-action-btn delete"
                  data-action="delete"
                  data-id="${escapeHtml(item.id)}"
                  aria-label="Delete ${escapeHtml(item.name)}"
                  title="Delete"
                >
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M5 7h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
                    <path d="M9 7V5h6v2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
                    <path d="M8 10v7M12 10v7M16 10v7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
                    <path d="M7 7l1 12h8l1-12" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"></path>
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        `;
      }).join("");
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
              <strong>No category alerts</strong>
              <p>Your category workspace has no recent updates.</p>
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
      const latestCategory = [...state.categories]
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0];

      if (latestCategory) {
        items.push({
          tone: "success",
          title: "Latest category updated",
          message: `${latestCategory.name} is currently active in the category list.`,
          timestamp: latestCategory.updatedAt
        });
      }

      if (state.categories.length >= 5) {
        items.push({
          tone: "info",
          title: "Category catalog is growing",
          message: `${state.categories.length} category entries are now available for organization.`,
          timestamp: new Date().toISOString()
        });
      }

      if (state.categories.some((item) => item.medicineCount === 0)) {
        items.push({
          tone: "warning",
          title: "Unassigned category detected",
          message: "Some categories do not yet contain linked medicines.",
          timestamp: new Date().toISOString()
        });
      }

      return items.slice(0, 5);
    }

    function exportCategories() {
      if (!state.categories.length) {
        showToast("warning", "Nothing to export", "Add at least one category before exporting.");
        return;
      }

      const lines = [
        ["Category Name", "Status", "Medicines", "Created At", "Updated At"].join(",")
      ];

      state.categories.forEach((item) => {
        lines.push([
          csvSafe(item.name),
          csvSafe(item.status),
          csvSafe(String(item.medicineCount)),
          csvSafe(item.createdAt),
          csvSafe(item.updatedAt)
        ].join(","));
      });

      const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "spirits-os-categories.csv";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showToast("success", "Export ready", "The category list was exported successfully.");
    }

    function getFilteredCategories() {
      if (!state.searchTerm) {
        return [...state.categories];
      }

      return state.categories.filter((item) => {
        return item.name.toLowerCase().includes(state.searchTerm);
      });
    }

    function resetFormState() {
      state.editingId = null;

      if (elements.categoryForm) {
        elements.categoryForm.reset();
      }

      renderFormState();
    }

    function persistCategories() {
      localStorage.setItem(STORAGE_KEYS.categories, JSON.stringify(state.categories));
    }

    function normalizeCategory(item) {
      return {
        id: String(item.id || createId()),
        name: String(item.name || "").trim(),
        status: String(item.status || "Active").trim(),
        medicineCount: toNumber(item.medicineCount),
        createdAt: item.createdAt || new Date().toISOString(),
        updatedAt: item.updatedAt || new Date().toISOString()
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

    function toNumber(value) {
      const number = Number(value);
      return Number.isFinite(number) ? number : 0;
    }

    function createId() {
      return `cat-${Math.random().toString(36).slice(2, 10)}-${Date.now().toString(36)}`;
    }

    function csvSafe(value) {
      const stringValue = String(value ?? "");
      return `"${stringValue.replace(/"/g, '""')}"`;
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

    function getFallbackCategories() {
      return [
        {
          id: "cat-analgesics",
          name: "Analgesics",
          status: "Active",
          medicineCount: 12,
          createdAt: "2026-04-16T08:15:00",
          updatedAt: "2026-04-16T08:15:00"
        },
        {
          id: "cat-antibiotics",
          name: "Antibiotics",
          status: "Active",
          medicineCount: 12,
          createdAt: "2026-04-16T08:20:00",
          updatedAt: "2026-04-16T08:20:00"
        }
      ];
    }
  }
})();