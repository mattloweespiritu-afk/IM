(() => {
  "use strict";

  document.addEventListener("DOMContentLoaded", initializeSuppliersPage);

  function initializeSuppliersPage() {
    const STORAGE_KEYS = {
      suppliers: "spirits-os-suppliers",
      notificationsReadAt: "spirits-os-suppliers-notifications-read-at"
    };

    const elements = {
      liveClock: document.getElementById("liveClock"),
      dayName: document.getElementById("dayName"),
      todayDate: document.getElementById("todayDate"),

      supplierGrid: document.getElementById("supplierGrid"),
      supplierSearchInput: document.getElementById("supplierSearchInput"),
      activePartnersChip: document.getElementById("activePartnersChip"),

      openSupplierModalBtn: document.getElementById("openSupplierModalBtn"),
      exportSuppliersBtn: document.getElementById("exportSuppliersBtn"),

      supplierModal: document.getElementById("supplierModal"),
      closeSupplierModalBtn: document.getElementById("closeSupplierModalBtn"),
      cancelSupplierModalBtn: document.getElementById("cancelSupplierModalBtn"),
      supplierForm: document.getElementById("supplierForm"),
      supplierModalTitle: document.getElementById("supplierModalTitle"),
      supplierModalSubtitle: document.getElementById("supplierModalSubtitle"),
      saveSupplierBtn: document.getElementById("saveSupplierBtn"),

      companyNameInput: document.getElementById("companyNameInput"),
      contactPersonInput: document.getElementById("contactPersonInput"),
      contactNumberInput: document.getElementById("contactNumberInput"),
      emailAddressInput: document.getElementById("emailAddressInput"),
      officeAddressInput: document.getElementById("officeAddressInput"),

      notificationList: document.querySelector("[data-notification-list]"),
      notificationCount: document.querySelector("[data-notification-count]"),
      markAllReadBtn: document.querySelector("[data-mark-all-read]"),

      toastStack: document.getElementById("toastStack")
    };

    const state = {
      suppliers: readJson(STORAGE_KEYS.suppliers, getFallbackSuppliers()).map(normalizeSupplier),
      searchTerm: "",
      editingId: null,
      openMenuId: null
    };

    bindEvents();
    updateClock();
    window.setInterval(updateClock, 1000);
    renderAll();

    function bindEvents() {
      if (elements.openSupplierModalBtn) {
        elements.openSupplierModalBtn.addEventListener("click", () => {
          state.editingId = null;
          openSupplierModal();
        });
      }

      if (elements.exportSuppliersBtn) {
        elements.exportSuppliersBtn.addEventListener("click", exportSuppliers);
      }

      if (elements.supplierSearchInput) {
        elements.supplierSearchInput.addEventListener("input", (event) => {
          state.searchTerm = String(event.target.value || "").trim().toLowerCase();
          renderSupplierGrid();
        });
      }

      if (elements.closeSupplierModalBtn) {
        elements.closeSupplierModalBtn.addEventListener("click", closeSupplierModal);
      }

      if (elements.cancelSupplierModalBtn) {
        elements.cancelSupplierModalBtn.addEventListener("click", closeSupplierModal);
      }

      if (elements.supplierModal) {
        elements.supplierModal.addEventListener("click", (event) => {
          if (event.target === elements.supplierModal) {
            closeSupplierModal();
          }
        });
      }

      if (elements.supplierForm) {
        elements.supplierForm.addEventListener("submit", handleSaveSupplier);
      }

      if (elements.supplierGrid) {
        elements.supplierGrid.addEventListener("click", handleGridActions);
      }

      if (elements.markAllReadBtn) {
        elements.markAllReadBtn.addEventListener("click", () => {
          localStorage.setItem(STORAGE_KEYS.notificationsReadAt, new Date().toISOString());
          renderNotifications();
          showToast("success", "Notifications cleared", "All supplier notifications were marked as read.");
        });
      }

      document.addEventListener("click", (event) => {
        if (!event.target.closest("[data-menu-shell]")) {
          if (state.openMenuId) {
            state.openMenuId = null;
            renderSupplierGrid();
          }
        }
      });

      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          if (state.openMenuId) {
            state.openMenuId = null;
            renderSupplierGrid();
            return;
          }

          if (!elements.supplierModal?.hidden) {
            closeSupplierModal();
          }
        }
      });
    }

    function handleSaveSupplier(event) {
      event.preventDefault();

      const payload = {
        companyName: String(elements.companyNameInput?.value || "").trim(),
        contactPerson: String(elements.contactPersonInput?.value || "").trim(),
        contactNumber: String(elements.contactNumberInput?.value || "").trim(),
        emailAddress: String(elements.emailAddressInput?.value || "").trim(),
        officeAddress: String(elements.officeAddressInput?.value || "").trim()
      };

      if (!payload.companyName || !payload.contactPerson || !payload.contactNumber || !payload.emailAddress || !payload.officeAddress) {
        showToast("warning", "Incomplete details", "Please complete all supplier fields before saving.");
        return;
      }

      const duplicate = state.suppliers.find((item) => {
        const sameCompany = item.companyName.toLowerCase() === payload.companyName.toLowerCase();
        const differentRecord = item.id !== state.editingId;
        return sameCompany && differentRecord;
      });

      if (duplicate) {
        showToast("warning", "Duplicate supplier", "This supplier company is already in your directory.");
        return;
      }

      if (state.editingId) {
        const target = state.suppliers.find((item) => item.id === state.editingId);
        if (!target) return;

        target.companyName = payload.companyName;
        target.contactPerson = payload.contactPerson;
        target.contactNumber = payload.contactNumber;
        target.emailAddress = payload.emailAddress;
        target.officeAddress = payload.officeAddress;
        target.updatedAt = new Date().toISOString();

        persistSuppliers();
        renderAll();
        closeSupplierModal();
        showToast("success", "Supplier updated", "Supplier details were updated successfully.");
        return;
      }

      state.suppliers.unshift({
        id: createId(),
        companyName: payload.companyName,
        contactPerson: payload.contactPerson,
        contactNumber: payload.contactNumber,
        emailAddress: payload.emailAddress,
        officeAddress: payload.officeAddress,
        status: "Active",
        rating: 4,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      persistSuppliers();
      renderAll();
      closeSupplierModal();
      showToast("success", "Supplier saved", "A new procurement partner was added to the directory.");
    }

    function handleGridActions(event) {
      const actionTrigger = event.target.closest("[data-action]");
      if (!actionTrigger) return;

      const action = actionTrigger.getAttribute("data-action");
      const id = actionTrigger.getAttribute("data-id");
      const supplier = state.suppliers.find((item) => item.id === id);

      if (!supplier) return;

      if (action === "toggle-menu") {
        state.openMenuId = state.openMenuId === id ? null : id;
        renderSupplierGrid();
        return;
      }

      if (action === "edit") {
        state.editingId = id;
        openSupplierModal(supplier);
        return;
      }

      if (action === "delete") {
        const shouldDelete = window.confirm(`Delete "${supplier.companyName}" from the supplier directory?`);
        if (!shouldDelete) return;

        state.suppliers = state.suppliers.filter((item) => item.id !== id);
        state.openMenuId = null;
        persistSuppliers();
        renderAll();
        showToast("success", "Supplier deleted", "The supplier was removed from the directory.");
      }
    }

    function openSupplierModal(supplier = null) {
      if (!elements.supplierModal || !elements.supplierForm) return;

      if (supplier) {
        if (elements.supplierModalTitle) {
          elements.supplierModalTitle.textContent = "Edit Supplier";
        }
        if (elements.supplierModalSubtitle) {
          elements.supplierModalSubtitle.textContent = "Update your pharmaceutical partner information.";
        }
        if (elements.saveSupplierBtn) {
          elements.saveSupplierBtn.textContent = "Save Changes";
        }

        elements.companyNameInput.value = supplier.companyName;
        elements.contactPersonInput.value = supplier.contactPerson;
        elements.contactNumberInput.value = supplier.contactNumber;
        elements.emailAddressInput.value = supplier.emailAddress;
        elements.officeAddressInput.value = supplier.officeAddress;
      } else {
        state.editingId = null;
        if (elements.supplierModalTitle) {
          elements.supplierModalTitle.textContent = "Register Supplier";
        }
        if (elements.supplierModalSubtitle) {
          elements.supplierModalSubtitle.textContent = "Add a new pharmaceutical distributor to your network.";
        }
        if (elements.saveSupplierBtn) {
          elements.saveSupplierBtn.textContent = "Save Partner";
        }
        elements.supplierForm.reset();
      }

      elements.supplierModal.hidden = false;
      document.body.classList.add("has-open-dialog");

      window.requestAnimationFrame(() => {
        elements.companyNameInput?.focus();
      });
    }

    function closeSupplierModal() {
      if (!elements.supplierModal || !elements.supplierForm) return;

      elements.supplierModal.hidden = true;
      elements.supplierForm.reset();
      document.body.classList.remove("has-open-dialog");
      state.editingId = null;

      if (elements.supplierModalTitle) {
        elements.supplierModalTitle.textContent = "Register Supplier";
      }
      if (elements.supplierModalSubtitle) {
        elements.supplierModalSubtitle.textContent = "Add a new pharmaceutical distributor to your network.";
      }
      if (elements.saveSupplierBtn) {
        elements.saveSupplierBtn.textContent = "Save Partner";
      }
    }

    function renderAll() {
      renderPartnerCount();
      renderSupplierGrid();
      renderNotifications();
    }

    function renderPartnerCount() {
      if (!elements.activePartnersChip) return;

      const activeCount = state.suppliers.filter((item) => item.status === "Active").length;
      elements.activePartnersChip.textContent = `${activeCount} Active Partner${activeCount === 1 ? "" : "s"}`;
    }

    function renderSupplierGrid() {
      if (!elements.supplierGrid) return;

      const filtered = getFilteredSuppliers();

      if (!filtered.length) {
        elements.supplierGrid.innerHTML = `
          <div class="supplier-empty">
            <div class="supplier-empty__card">
              <div class="supplier-empty__icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M6 19V8.5A1.5 1.5 0 0 1 7.5 7H11v12H7.5A1.5 1.5 0 0 1 6 17.5V19Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"></path>
                  <path d="M11 5h4.5A1.5 1.5 0 0 1 17 6.5V19h-6V5Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"></path>
                </svg>
              </div>
              <h3>No suppliers found</h3>
              <p>Try a different search term or add a new partner to start building your supplier network.</p>
            </div>
          </div>
        `;
        return;
      }

      elements.supplierGrid.innerHTML = filtered.map((supplier) => {
        return `
          <article class="supplier-card">
            <div class="supplier-card__top">
              <div class="supplier-card__brand">
                <span class="supplier-card__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M6 19V8.5A1.5 1.5 0 0 1 7.5 7H11v12H7.5A1.5 1.5 0 0 1 6 17.5V19Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"></path>
                    <path d="M11 5h4.5A1.5 1.5 0 0 1 17 6.5V19h-6V5Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"></path>
                    <path d="M8.5 10.5h.01M8.5 14h.01M13.5 8.5h.01M13.5 12h.01M13.5 15.5h.01" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"></path>
                  </svg>
                </span>

                <div class="supplier-card__brand-copy">
                  <h3>${escapeHtml(supplier.companyName)}</h3>
                  <p>
                    <svg viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="8" r="3.5" stroke="currentColor" stroke-width="1.8"></circle>
                      <path d="M5 19a7 7 0 0 1 14 0" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
                    </svg>
                    <span>${escapeHtml(supplier.contactPerson)}</span>
                  </p>
                </div>
              </div>

              <div class="supplier-card__meta">
                <span class="supplier-status">${escapeHtml(supplier.status)}</span>
                <span class="supplier-rating" aria-label="${supplier.rating} star rating">
                  ${renderStars(supplier.rating)}
                </span>
              </div>
            </div>

            <div class="supplier-details">
              <div class="supplier-pill">
                <span class="supplier-pill__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M6 8.8c0 4.6 4.6 9.2 9.2 9.2h1.2c.9 0 1.6-.7 1.6-1.6v-2c0-.6-.4-1.2-1-1.4l-2.2-.7a1.5 1.5 0 0 0-1.5.4l-.8 1a12.5 12.5 0 0 1-3.2-3.2l1-.8c.5-.4.7-1 .4-1.5L9.2 7c-.2-.6-.8-1-1.4-1h-2C6.7 6 6 6.7 6 7.6v1.2Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"></path>
                  </svg>
                </span>
                <span class="supplier-pill__text">${escapeHtml(supplier.contactNumber)}</span>
              </div>

              <div class="supplier-pill">
                <span class="supplier-pill__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <rect x="4" y="6" width="16" height="12" rx="2" stroke="currentColor" stroke-width="1.7"></rect>
                    <path d="M5 8l7 5 7-5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"></path>
                  </svg>
                </span>
                <span class="supplier-pill__text">${escapeHtml(supplier.emailAddress)}</span>
              </div>

              <div class="supplier-pill">
                <span class="supplier-pill__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M12 20s6-4.3 6-9a6 6 0 1 0-12 0c0 4.7 6 9 6 9Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"></path>
                    <circle cx="12" cy="11" r="2" stroke="currentColor" stroke-width="1.8"></circle>
                  </svg>
                </span>
                <span class="supplier-pill__text">${escapeHtml(supplier.officeAddress)}</span>
              </div>
            </div>

            <div class="supplier-card__foot">
              <button type="button" class="supplier-edit-btn" data-action="edit" data-id="${escapeHtml(supplier.id)}">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M4 20h4l10-10-4-4L4 16v4Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"></path>
                  <path d="M12 6l4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
                </svg>
                <span>Edit</span>
              </button>

              <div class="supplier-card__menu-shell" data-menu-shell>
                <button
                  type="button"
                  class="supplier-menu-trigger"
                  data-action="toggle-menu"
                  data-id="${escapeHtml(supplier.id)}"
                  aria-label="Open supplier menu"
                >
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M12 6h.01M12 12h.01M12 18h.01" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"></path>
                  </svg>
                </button>

                <div class="supplier-card-menu" ${state.openMenuId === supplier.id ? "" : "hidden"}>
                  <button type="button" data-action="edit" data-id="${escapeHtml(supplier.id)}">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M4 20h4l10-10-4-4L4 16v4Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"></path>
                      <path d="M12 6l4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
                    </svg>
                    <span>Edit Supplier</span>
                  </button>

                  <button type="button" class="delete" data-action="delete" data-id="${escapeHtml(supplier.id)}">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M5 7h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
                      <path d="M9 7V5h6v2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
                      <path d="M8 10v7M12 10v7M16 10v7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
                      <path d="M7 7l1 12h8l1-12" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"></path>
                    </svg>
                    <span>Delete Supplier</span>
                  </button>
                </div>
              </div>
            </div>
          </article>
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
              <strong>No supplier alerts</strong>
              <p>Your supplier directory has no recent updates.</p>
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
      const latestSupplier = [...state.suppliers].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0];
      const activeCount = state.suppliers.filter((item) => item.status === "Active").length;

      if (latestSupplier) {
        items.push({
          tone: "success",
          title: "Latest partner updated",
          message: `${latestSupplier.companyName} is active in your supplier network.`,
          timestamp: latestSupplier.updatedAt
        });
      }

      items.push({
        tone: "info",
        title: "Supplier coverage status",
        message: `${activeCount} active partner${activeCount === 1 ? "" : "s"} currently available in the directory.`,
        timestamp: new Date().toISOString()
      });

      if (state.suppliers.length === 1) {
        items.push({
          tone: "warning",
          title: "Low supplier diversity",
          message: "Consider adding more procurement partners for stronger inventory resilience.",
          timestamp: new Date().toISOString()
        });
      }

      return items.slice(0, 5);
    }

    function exportSuppliers() {
      if (!state.suppliers.length) {
        showToast("warning", "Nothing to export", "Add at least one supplier before exporting the directory.");
        return;
      }

      const lines = [
        ["Company Name", "Contact Person", "Contact Number", "Email Address", "Office Address", "Status", "Rating"].join(",")
      ];

      state.suppliers.forEach((supplier) => {
        lines.push([
          csvSafe(supplier.companyName),
          csvSafe(supplier.contactPerson),
          csvSafe(supplier.contactNumber),
          csvSafe(supplier.emailAddress),
          csvSafe(supplier.officeAddress),
          csvSafe(supplier.status),
          csvSafe(String(supplier.rating))
        ].join(","));
      });

      const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "spirits-os-suppliers.csv";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showToast("success", "Export ready", "The supplier directory was exported successfully.");
    }

    function getFilteredSuppliers() {
      if (!state.searchTerm) {
        return [...state.suppliers];
      }

      return state.suppliers.filter((supplier) => {
        const haystack = [
          supplier.companyName,
          supplier.contactPerson,
          supplier.emailAddress,
          supplier.contactNumber,
          supplier.officeAddress
        ].join(" ").toLowerCase();

        return haystack.includes(state.searchTerm);
      });
    }

    function persistSuppliers() {
      localStorage.setItem(STORAGE_KEYS.suppliers, JSON.stringify(state.suppliers));
    }

    function renderStars(rating) {
      const total = 5;
      let output = "";

      for (let index = 0; index < total; index += 1) {
        const filled = index < Math.round(rating);
        output += `
          <svg viewBox="0 0 24 24" fill="${filled ? "currentColor" : "none"}">
            <path d="M12 4.8l2.2 4.5 4.9.7-3.5 3.4.8 4.8L12 16l-4.4 2.2.8-4.8L4.9 10l4.9-.7L12 4.8Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"></path>
          </svg>
        `;
      }

      return output;
    }

    function normalizeSupplier(item) {
      return {
        id: String(item.id || createId()),
        companyName: String(item.companyName || "").trim(),
        contactPerson: String(item.contactPerson || "").trim(),
        contactNumber: String(item.contactNumber || "").trim(),
        emailAddress: String(item.emailAddress || "").trim(),
        officeAddress: String(item.officeAddress || "").trim(),
        status: String(item.status || "Active").trim(),
        rating: normalizeRating(item.rating),
        createdAt: item.createdAt || new Date().toISOString(),
        updatedAt: item.updatedAt || new Date().toISOString()
      };
    }

    function normalizeRating(value) {
      const number = Number(value);
      if (!Number.isFinite(number)) return 4;
      return Math.max(1, Math.min(5, Math.round(number)));
    }

    function readJson(key, fallback) {
      try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
      } catch (error) {
        return fallback;
      }
    }

    function createId() {
      return `sup-${Math.random().toString(36).slice(2, 10)}-${Date.now().toString(36)}`;
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

    function getFallbackSuppliers() {
      return [
        {
          id: "sup-unilab",
          companyName: "Unilab",
          contactPerson: "John Doe",
          contactNumber: "09123456789",
          emailAddress: "info@unilab.com",
          officeAddress: "Manila",
          status: "Active",
          rating: 4,
          createdAt: "2026-04-16T09:10:00",
          updatedAt: "2026-04-16T09:10:00"
        }
      ];
    }
  }
})();