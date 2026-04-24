(() => {
  "use strict";

  const PAGE_SIZE = 5;
  const NEAR_EXPIRY_DAYS = 60;
  const STORAGE_KEY = "spirits-os-batches-ledger";
  const NOTIFICATION_READ_KEY = "spirits-os-batches-notifications-read-at";

  const defaultMedicinesCatalog = [
    { name: "Biogesic", form: "Paracetamol Tablet" },
    { name: "Amoxicillin 500mg", form: "Capsule" },
    { name: "Cetirizine 10mg", form: "Tablet" },
    { name: "Omeprazole 20mg", form: "Capsule" },
    { name: "Amlodipine 5mg", form: "Tablet" },
    { name: "Salbutamol Syrup", form: "Syrup" },
    { name: "Losartan 50mg", form: "Tablet" },
    { name: "Metformin 500mg", form: "Tablet" }
  ];

  const defaultBatches = [
    {
      id: 1,
      batchNumber: "BIO-24001",
      medicine: "Biogesic",
      form: "Paracetamol Tablet",
      supplier: "MediCore",
      receivedDate: "2026-04-14",
      expirationDate: "2026-07-13",
      quantity: 450,
      capacity: 600,
      unitCost: 5.25,
      archived: false
    },
    {
      id: 2,
      batchNumber: "AMX-24017",
      medicine: "Amoxicillin 500mg",
      form: "Capsule",
      supplier: "NorthCare Pharma",
      receivedDate: "2026-03-30",
      expirationDate: "2026-05-09",
      quantity: 110,
      capacity: 300,
      unitCost: 8.75,
      archived: false
    },
    {
      id: 3,
      batchNumber: "CET-24008",
      medicine: "Cetirizine 10mg",
      form: "Tablet",
      supplier: "MediCore",
      receivedDate: "2026-03-08",
      expirationDate: "2026-04-01",
      quantity: 22,
      capacity: 200,
      unitCost: 3.2,
      archived: false
    },
    {
      id: 4,
      batchNumber: "OMP-24014",
      medicine: "Omeprazole 20mg",
      form: "Capsule",
      supplier: "GreenBridge",
      receivedDate: "2026-04-10",
      expirationDate: "2026-09-30",
      quantity: 280,
      capacity: 320,
      unitCost: 6.9,
      archived: false
    },
    {
      id: 5,
      batchNumber: "AML-24005",
      medicine: "Amlodipine 5mg",
      form: "Tablet",
      supplier: "PrimeRx",
      receivedDate: "2026-04-02",
      expirationDate: "2026-05-27",
      quantity: 64,
      capacity: 160,
      unitCost: 4.1,
      archived: false
    },
    {
      id: 6,
      batchNumber: "SAL-24002",
      medicine: "Salbutamol Syrup",
      form: "Syrup",
      supplier: "HealthLine",
      receivedDate: "2026-04-04",
      expirationDate: "2026-10-18",
      quantity: 138,
      capacity: 180,
      unitCost: 24.5,
      archived: false
    },
    {
      id: 7,
      batchNumber: "LOS-24011",
      medicine: "Losartan 50mg",
      form: "Tablet",
      supplier: "PrimeRx",
      receivedDate: "2026-03-21",
      expirationDate: "",
      quantity: 0,
      capacity: 0,
      unitCost: 7.15,
      archived: false
    },
    {
      id: 8,
      batchNumber: "MET-24009",
      medicine: "Metformin 500mg",
      form: "Tablet",
      supplier: "HealthLine",
      receivedDate: "2026-04-11",
      expirationDate: "2026-08-12",
      quantity: 190,
      capacity: 250,
      unitCost: 5.85,
      archived: false
    }
  ];

  const state = {
    page: 1,
    query: "",
    status: "all",
    supplier: "all",
    stock: "all",
    filtersOpen: false,
    editingBatchId: null,
    adjustingBatchId: null,
    archivingBatchId: null,
    activeMenuBatchId: null,
    medicinesCatalog: [...defaultMedicinesCatalog],
    batches: []
  };

  const elements = {};

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    loadBatches();
    cacheElements();
    bindEvents();
    syncDateTime();
    window.setInterval(syncDateTime, 1000);
    populateFormSelects();
    populateSupplierFilter();
    renderAll();
    handleInitialRoute();
  }

  function loadBatches() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      state.batches = raw ? JSON.parse(raw) : [...defaultBatches];
      if (!Array.isArray(state.batches) || !state.batches.length) {
        state.batches = [...defaultBatches];
      }
    } catch (error) {
      state.batches = [...defaultBatches];
    }
  }

  function saveBatches() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.batches));
  }

  function cacheElements() {
    elements.liveClock = document.getElementById("liveClock");
    elements.dayName = document.getElementById("dayName");
    elements.todayDate = document.getElementById("todayDate");

    elements.exportLogBtn = document.getElementById("exportLogBtn");
    elements.openBatchModalBtn = document.getElementById("openBatchModalBtn");

    elements.expiredCount = document.getElementById("expiredCount");
    elements.nearExpiryCount = document.getElementById("nearExpiryCount");
    elements.activeCount = document.getElementById("activeCount");

    elements.batchSearchInput = document.getElementById("batchSearchInput");
    elements.toggleFiltersBtn = document.getElementById("toggleFiltersBtn");
    elements.filtersGrid = document.getElementById("filtersGrid");
    elements.statusFilter = document.getElementById("statusFilter");
    elements.supplierFilter = document.getElementById("supplierFilter");
    elements.stockFilter = document.getElementById("stockFilter");
    elements.resetFiltersBtn = document.getElementById("resetFiltersBtn");

    elements.resultsText = document.getElementById("resultsText");
    elements.footerMeta = document.getElementById("footerMeta");
    elements.batchTableBody = document.getElementById("batchTableBody");
    elements.pagination = document.getElementById("pagination");

    elements.menuPortal = document.getElementById("menuPortal");

    elements.batchModal = document.getElementById("batchModal");
    elements.batchModalTitle = document.getElementById("batchModalTitle");
    elements.batchModalSubtitle = document.getElementById("batchModalSubtitle");
    elements.closeBatchModalBtn = document.getElementById("closeBatchModalBtn");
    elements.cancelBatchModalBtn = document.getElementById("cancelBatchModalBtn");
    elements.batchForm = document.getElementById("batchForm");
    elements.medicineSelect = document.getElementById("medicineSelect");
    elements.batchNumberInput = document.getElementById("batchNumberInput");
    elements.batchSupplierSelect = document.getElementById("batchSupplierSelect");
    elements.quantityInput = document.getElementById("quantityInput");
    elements.unitCostInput = document.getElementById("unitCostInput");
    elements.expiryInput = document.getElementById("expiryInput");
    elements.submitBatchBtn = document.getElementById("submitBatchBtn");

    elements.adjustModal = document.getElementById("adjustModal");
    elements.closeAdjustModalBtn = document.getElementById("closeAdjustModalBtn");
    elements.cancelAdjustModalBtn = document.getElementById("cancelAdjustModalBtn");
    elements.adjustForm = document.getElementById("adjustForm");
    elements.adjustQuantityInput = document.getElementById("adjustQuantityInput");
    elements.adjustReasonInput = document.getElementById("adjustReasonInput");

    elements.archiveModal = document.getElementById("archiveModal");
    elements.archiveBatchText = document.getElementById("archiveBatchText");
    elements.closeArchiveModalBtn = document.getElementById("closeArchiveModalBtn");
    elements.cancelArchiveModalBtn = document.getElementById("cancelArchiveModalBtn");
    elements.confirmArchiveBtn = document.getElementById("confirmArchiveBtn");

    elements.notificationList = document.querySelector("[data-notification-list]");
    elements.notificationCount = document.querySelector("[data-notification-count]");
    elements.markAllReadBtn = document.querySelector("[data-mark-all-read]");

    elements.toastStack = document.getElementById("toastStack");
  }

  function bindEvents() {
    elements.exportLogBtn.addEventListener("click", exportVisibleBatches);
    elements.openBatchModalBtn.addEventListener("click", () => openBatchModal("create"));

    elements.batchSearchInput.addEventListener("input", (event) => {
      state.query = normalize(event.target.value);
      state.page = 1;
      renderTable();
    });

    elements.toggleFiltersBtn.addEventListener("click", () => {
      state.filtersOpen = !state.filtersOpen;
      elements.filtersGrid.hidden = !state.filtersOpen;
      elements.toggleFiltersBtn.setAttribute("aria-expanded", String(state.filtersOpen));
      closeActionMenu();
    });

    elements.statusFilter.addEventListener("change", (event) => {
      state.status = event.target.value;
      state.page = 1;
      renderTable();
    });

    elements.supplierFilter.addEventListener("change", (event) => {
      state.supplier = event.target.value;
      state.page = 1;
      renderTable();
    });

    elements.stockFilter.addEventListener("change", (event) => {
      state.stock = event.target.value;
      state.page = 1;
      renderTable();
    });

    elements.resetFiltersBtn.addEventListener("click", resetFilters);

    elements.closeBatchModalBtn.addEventListener("click", closeBatchModal);
    elements.cancelBatchModalBtn.addEventListener("click", closeBatchModal);
    elements.batchModal.addEventListener("click", (event) => {
      if (event.target === elements.batchModal) {
        closeBatchModal();
      }
    });
    elements.batchForm.addEventListener("submit", handleBatchSubmit);

    elements.closeAdjustModalBtn.addEventListener("click", closeAdjustModal);
    elements.cancelAdjustModalBtn.addEventListener("click", closeAdjustModal);
    elements.adjustModal.addEventListener("click", (event) => {
      if (event.target === elements.adjustModal) {
        closeAdjustModal();
      }
    });
    elements.adjustForm.addEventListener("submit", handleAdjustSubmit);

    elements.closeArchiveModalBtn.addEventListener("click", closeArchiveModal);
    elements.cancelArchiveModalBtn.addEventListener("click", closeArchiveModal);
    elements.archiveModal.addEventListener("click", (event) => {
      if (event.target === elements.archiveModal) {
        closeArchiveModal();
      }
    });
    elements.confirmArchiveBtn.addEventListener("click", confirmArchive);

    if (elements.markAllReadBtn) {
      elements.markAllReadBtn.addEventListener("click", () => {
        localStorage.setItem(NOTIFICATION_READ_KEY, new Date().toISOString());
        renderNotifications();
        showToast("success", "Notifications cleared", "All batch notifications were marked as read.");
      });
    }

    document.addEventListener("click", handleDocumentClick);
    document.addEventListener("keydown", handleGlobalKeys);
    window.addEventListener("resize", closeActionMenu);
    window.addEventListener("scroll", closeActionMenu, true);
  }

  function handleDocumentClick(event) {
    const clickedMenu = event.target.closest(".row-menu");
    const clickedActionButton = event.target.closest("[data-action-trigger]");
    const clickedFilters = event.target.closest("#filtersGrid");
    const clickedToggle = event.target.closest("#toggleFiltersBtn");

    if (!clickedMenu && !clickedActionButton) {
      closeActionMenu();
    }

    if (!clickedFilters && !clickedToggle && state.filtersOpen) {
      state.filtersOpen = false;
      elements.filtersGrid.hidden = true;
      elements.toggleFiltersBtn.setAttribute("aria-expanded", "false");
    }
  }

  function handleGlobalKeys(event) {
    if (event.key !== "Escape") return;

    closeActionMenu();
    closeBatchModal();
    closeAdjustModal();
    closeArchiveModal();
  }

  function syncDateTime() {
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

  function normalize(value) {
    return String(value || "").trim().toLowerCase();
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function parseDate(value) {
    if (!value) return null;
    return new Date(`${value}T00:00:00`);
  }

  function getToday() {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }

  function toISODate(date) {
    const copy = new Date(date);
    const offset = copy.getTimezoneOffset();
    copy.setMinutes(copy.getMinutes() - offset);
    return copy.toISOString().split("T")[0];
  }

  function getFutureISO(days) {
    const base = new Date();
    base.setDate(base.getDate() + days);
    return toISODate(base);
  }

  function formatDate(value) {
    const date = parseDate(value);
    if (!date) return "N/A";

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  }

  function handleInitialRoute() {
    const params = new URLSearchParams(window.location.search);

    if (params.get("open") === "create") {
      openBatchModal("create");
      clearTransientQueryParam("open");
    }
  }

  function clearTransientQueryParam(key) {
    if (!window.history || typeof window.history.replaceState !== "function") {
      return;
    }

    const url = new URL(window.location.href);
    url.searchParams.delete(key);
    window.history.replaceState({}, document.title, `${url.pathname}${url.search}${url.hash}`);
  }

  function formatShortDate(value) {
    const date = parseDate(value);
    if (!date) return "N/A";

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric"
    });
  }

  function getDaysUntil(dateValue) {
    const date = parseDate(dateValue);
    if (!date) return null;

    const diff = date.getTime() - getToday().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  function getBatchStatus(batch) {
    const daysUntil = getDaysUntil(batch.expirationDate);

    if (daysUntil === null) return "unknown";
    if (daysUntil < 0) return "expired";
    if (daysUntil <= NEAR_EXPIRY_DAYS) return "near-expiry";
    return "healthy";
  }

  function getStatusLabel(status) {
    const labels = {
      healthy: "Healthy",
      "near-expiry": "Near Expiry",
      expired: "Expired",
      unknown: "Unknown"
    };

    return labels[status] || "Unknown";
  }

  function getStockLevel(batch) {
    if (!batch.capacity || batch.quantity <= 0) return "empty";

    const ratio = batch.quantity / batch.capacity;

    if (ratio <= 0.2) return "low";
    if (ratio <= 0.55) return "medium";
    return "high";
  }

  function getStockBarClass(level) {
    if (level === "medium") return "is-medium";
    if (level === "low") return "is-low";
    if (level === "empty") return "is-empty";
    return "";
  }

  function getExpiryMeta(batch) {
    const status = getBatchStatus(batch);
    const daysUntil = getDaysUntil(batch.expirationDate);

    if (status === "healthy") {
      return {
        text: `${daysUntil} days left`,
        className: "is-good"
      };
    }

    if (status === "near-expiry") {
      return {
        text: `${daysUntil} days left`,
        className: "is-warning"
      };
    }

    if (status === "expired") {
      return {
        text: `${Math.abs(daysUntil)} days overdue`,
        className: "is-danger"
      };
    }

    return {
      text: "No expiry recorded",
      className: "is-muted"
    };
  }

  function getActiveBatches() {
    return state.batches.filter((batch) => !batch.archived);
  }

  function getFilteredBatches() {
    const query = state.query;

    const filtered = getActiveBatches().filter((batch) => {
      const searchString = normalize(
        `${batch.batchNumber} ${batch.medicine} ${batch.form} ${batch.supplier}`
      );
      const status = getBatchStatus(batch);
      const stock = getStockLevel(batch);

      const matchesQuery = !query || searchString.includes(query);
      const matchesStatus = state.status === "all" || status === state.status;
      const matchesSupplier = state.supplier === "all" || batch.supplier === state.supplier;
      const matchesStock = state.stock === "all" || stock === state.stock;

      return matchesQuery && matchesStatus && matchesSupplier && matchesStock;
    });

    return filtered.sort((a, b) => {
      const aDate = parseDate(a.expirationDate);
      const bDate = parseDate(b.expirationDate);

      if (!aDate && !bDate) return 0;
      if (!aDate) return 1;
      if (!bDate) return -1;

      return aDate - bDate;
    });
  }

  function populateFormSelects() {
    const medicines = [...new Map(state.medicinesCatalog.map((item) => [item.name, item])).values()];

    elements.medicineSelect.innerHTML = medicines
      .map(
        (item) =>
          `<option value="${escapeHtml(item.name)}">${escapeHtml(item.name)} • ${escapeHtml(item.form)}</option>`
      )
      .join("");

    const suppliers = getAllSuppliers();
    elements.batchSupplierSelect.innerHTML = suppliers
      .map((supplier) => `<option value="${escapeHtml(supplier)}">${escapeHtml(supplier)}</option>`)
      .join("");

    elements.expiryInput.min = toISODate(new Date());
  }

  function populateSupplierFilter() {
    const currentValue = elements.supplierFilter.value || state.supplier;
    const suppliers = getAllSuppliers();

    elements.supplierFilter.innerHTML =
      `<option value="all">All suppliers</option>` +
      suppliers
        .map((supplier) => `<option value="${escapeHtml(supplier)}">${escapeHtml(supplier)}</option>`)
        .join("");

    if (suppliers.includes(currentValue)) {
      elements.supplierFilter.value = currentValue;
    } else {
      elements.supplierFilter.value = "all";
      state.supplier = "all";
    }
  }

  function getAllSuppliers() {
    return [...new Set(state.batches.map((batch) => batch.supplier))].sort((a, b) => a.localeCompare(b));
  }

  function renderAll() {
    populateSupplierFilter();
    renderSummary();
    renderTable();
    renderNotifications();
  }

  function renderSummary() {
    const activeBatches = getActiveBatches();

    let expired = 0;
    let nearExpiry = 0;
    let active = 0;

    activeBatches.forEach((batch) => {
      const status = getBatchStatus(batch);

      if (status === "expired") expired += 1;
      if (status === "near-expiry") nearExpiry += 1;
      if (status === "healthy") active += 1;
    });

    elements.expiredCount.textContent = String(expired);
    elements.nearExpiryCount.textContent = String(nearExpiry);
    elements.activeCount.textContent = String(active);
  }

  function renderTable() {
    const rows = getFilteredBatches();
    const total = rows.length;
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

    if (state.page > totalPages) {
      state.page = totalPages;
    }

    const startIndex = (state.page - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    const pageRows = rows.slice(startIndex, endIndex);

    if (!pageRows.length) {
      elements.batchTableBody.innerHTML = `
        <tr>
          <td colspan="6">
            <div class="empty-state">
              No batches matched your current search and filter settings.
            </div>
          </td>
        </tr>
      `;
    } else {
      elements.batchTableBody.innerHTML = pageRows.map(renderRow).join("");
      bindRowActionTriggers();
    }

    const from = total ? startIndex + 1 : 0;
    const to = total ? Math.min(endIndex, total) : 0;
    const summaryText = `Showing ${from} to ${to} of ${total} batches`;

    elements.resultsText.textContent = summaryText;
    elements.footerMeta.textContent = summaryText;

    renderPagination(totalPages);
  }

  function renderRow(batch) {
    const status = getBatchStatus(batch);
    const stockLevel = getStockLevel(batch);
    const progress = batch.capacity
      ? Math.max(0, Math.min(100, Math.round((batch.quantity / batch.capacity) * 100)))
      : 0;
    const expiryMeta = getExpiryMeta(batch);

    return `
      <tr>
        <td>
          <div class="batch-info">
            <span class="batch-icon">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3Z" stroke="currentColor" stroke-width="1.7"></path>
                <path d="M4 7.5L12 12l8-4.5" stroke="currentColor" stroke-width="1.7"></path>
              </svg>
            </span>

            <div class="batch-primary">
              <strong>${escapeHtml(batch.batchNumber)}</strong>
              <span>Rec: ${escapeHtml(formatShortDate(batch.receivedDate))}</span>
            </div>
          </div>
        </td>

        <td>
          <div class="medicine-primary">
            <strong>${escapeHtml(batch.medicine)}</strong>
            <small>${escapeHtml(batch.form)}</small>
          </div>
        </td>

        <td class="stock-cell">
          <div class="stock-topline ${stockLevel === "empty" ? "is-empty" : ""}">
            <strong>${escapeHtml(String(batch.quantity))} / ${escapeHtml(String(batch.capacity))}</strong>
            <span>Pieces</span>
          </div>

          <div class="stock-bar">
            <div
              class="stock-bar__fill ${getStockBarClass(stockLevel)}"
              style="width: ${progress}%"
            ></div>
          </div>
        </td>

        <td>
          <div class="expiry-cell">
            <strong>${escapeHtml(formatDate(batch.expirationDate))}</strong>
            <span class="${expiryMeta.className}">${escapeHtml(expiryMeta.text)}</span>
          </div>
        </td>

        <td>
          <span class="status-badge status-badge--${status}">
            ${escapeHtml(getStatusLabel(status))}
          </span>
        </td>

        <td>
          <button
            type="button"
            class="action-trigger"
            data-action-trigger="${batch.id}"
            aria-label="Open batch actions"
          >
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="5" r="1.8" fill="currentColor"></circle>
              <circle cx="12" cy="12" r="1.8" fill="currentColor"></circle>
              <circle cx="12" cy="19" r="1.8" fill="currentColor"></circle>
            </svg>
          </button>
        </td>
      </tr>
    `;
  }

  function renderPagination(totalPages) {
    const buttons = [];

    buttons.push(`
      <button
        class="page-btn"
        type="button"
        data-page="${state.page - 1}"
        ${state.page === 1 ? "disabled" : ""}
      >
        ‹
      </button>
    `);

    for (let page = 1; page <= totalPages; page += 1) {
      buttons.push(`
        <button
          class="page-btn ${page === state.page ? "is-active" : ""}"
          type="button"
          data-page="${page}"
        >
          ${page}
        </button>
      `);
    }

    buttons.push(`
      <button
        class="page-btn"
        type="button"
        data-page="${state.page + 1}"
        ${state.page === totalPages ? "disabled" : ""}
      >
        ›
      </button>
    `);

    elements.pagination.innerHTML = buttons.join("");

    elements.pagination.querySelectorAll("[data-page]").forEach((button) => {
      button.addEventListener("click", () => {
        const nextPage = Number(button.getAttribute("data-page"));
        if (!Number.isNaN(nextPage)) {
          state.page = nextPage;
          renderTable();
        }
      });
    });
  }

  function bindRowActionTriggers() {
    elements.batchTableBody.querySelectorAll("[data-action-trigger]").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.stopPropagation();

        const batchId = Number(button.getAttribute("data-action-trigger"));
        const batch = state.batches.find((item) => item.id === batchId);
        if (!batch) return;

        if (state.activeMenuBatchId === batchId) {
          closeActionMenu();
          return;
        }

        openActionMenu(button, batch);
      });
    });
  }

  function openActionMenu(button, batch) {
    state.activeMenuBatchId = batch.id;

    const rect = button.getBoundingClientRect();
    const menuWidth = 196;
    const menuHeight = 190;

    let top = rect.bottom + 8;
    let left = rect.right - menuWidth;

    if (left < 12) left = 12;
    if (left + menuWidth > window.innerWidth - 12) {
      left = window.innerWidth - menuWidth - 12;
    }

    if (top + menuHeight > window.innerHeight - 12) {
      top = Math.max(12, rect.top - menuHeight - 8);
    }

    elements.menuPortal.innerHTML = `
      <div class="row-menu" id="activeRowMenu" style="top:${top}px; left:${left}px;">
        <button type="button" class="row-menu__item" data-row-action="view" data-id="${batch.id}">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" stroke="currentColor" stroke-width="1.8"></path>
            <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.8"></circle>
          </svg>
          <span>View Details</span>
        </button>

        <button type="button" class="row-menu__item" data-row-action="edit" data-id="${batch.id}">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M4 20h4l10-10-4-4L4 16v4Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"></path>
            <path d="M12 6l4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
          </svg>
          <span>Edit Batch</span>
        </button>

        <button type="button" class="row-menu__item" data-row-action="adjust" data-id="${batch.id}">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M7 17L17 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
            <path d="M9 7h8v8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
          <span>Stock Adjustment</span>
        </button>

        <button type="button" class="row-menu__item row-menu__item--danger" data-row-action="archive" data-id="${batch.id}">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M5 7h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
            <rect x="6" y="7" width="12" height="12" rx="2" stroke="currentColor" stroke-width="1.8"></rect>
            <path d="M10 11v4M14 11v4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
          </svg>
          <span>Archive Batch</span>
        </button>
      </div>
    `;

    const menu = document.getElementById("activeRowMenu");
    if (!menu) return;

    menu.querySelectorAll("[data-row-action]").forEach((item) => {
      item.addEventListener("click", () => {
        const action = item.getAttribute("data-row-action");
        const batchId = Number(item.getAttribute("data-id"));
        handleRowAction(action, batchId);
      });
    });
  }

  function closeActionMenu() {
    state.activeMenuBatchId = null;
    elements.menuPortal.innerHTML = "";
  }

  function handleRowAction(action, batchId) {
    const batch = state.batches.find((item) => item.id === batchId);
    closeActionMenu();

    if (!batch) return;

    if (action === "view") {
      const expiryLabel = batch.expirationDate ? formatDate(batch.expirationDate) : "No expiry recorded";
      showToast(
        "info",
        batch.batchNumber,
        `${batch.medicine} • ${expiryLabel} • ${batch.quantity} pieces on hand.`
      );
      return;
    }

    if (action === "edit") {
      openBatchModal("edit", batch);
      return;
    }

    if (action === "adjust") {
      openAdjustModal(batch);
      return;
    }

    if (action === "archive") {
      openArchiveModal(batch);
    }
  }

  function resetFilters() {
    state.query = "";
    state.status = "all";
    state.supplier = "all";
    state.stock = "all";
    state.page = 1;

    elements.batchSearchInput.value = "";
    elements.statusFilter.value = "all";
    elements.supplierFilter.value = "all";
    elements.stockFilter.value = "all";

    renderTable();
    showToast("success", "Filters Reset", "All active batch records are visible again.");
  }

  function openBatchModal(mode, batch = null) {
    state.editingBatchId = mode === "edit" && batch ? batch.id : null;
    elements.batchModal.hidden = false;
    document.body.classList.add("has-open-dialog");

    if (mode === "edit" && batch) {
      elements.batchModalTitle.textContent = "Edit Batch";
      elements.batchModalSubtitle.textContent = "Update stock arrival and expiry details for this batch.";
      elements.submitBatchBtn.textContent = "Save Changes";

      elements.medicineSelect.value = batch.medicine;
      elements.batchNumberInput.value = batch.batchNumber;
      elements.batchSupplierSelect.value = batch.supplier;
      elements.quantityInput.value = String(batch.quantity);
      elements.unitCostInput.value = String(batch.unitCost);
      elements.expiryInput.value = batch.expirationDate || "";
    } else {
      elements.batchModalTitle.textContent = "Stock-In Batch";
      elements.batchModalSubtitle.textContent = "Register new stock arrival with batch and expiry details.";
      elements.submitBatchBtn.textContent = "Confirm Stock-In";

      elements.batchForm.reset();
      elements.medicineSelect.selectedIndex = 0;
      elements.batchSupplierSelect.selectedIndex = 0;
      elements.expiryInput.value = getFutureISO(120);
    }
  }

  function closeBatchModal() {
    elements.batchModal.hidden = true;
    state.editingBatchId = null;
    syncBodyDialogState();
  }

  function handleBatchSubmit(event) {
    event.preventDefault();

    const medicine = elements.medicineSelect.value.trim();
    const medicineMeta = state.medicinesCatalog.find((item) => item.name === medicine);
    const form = medicineMeta ? medicineMeta.form : "Medicine";
    const batchNumber = elements.batchNumberInput.value.trim().toUpperCase();
    const supplier = elements.batchSupplierSelect.value.trim();
    const quantity = Number(elements.quantityInput.value);
    const unitCost = Number(elements.unitCostInput.value);
    const expirationDate = elements.expiryInput.value;

    if (!medicine || !batchNumber || !supplier || Number.isNaN(quantity) || Number.isNaN(unitCost)) {
      showToast("warning", "Missing Fields", "Complete all required batch fields.");
      return;
    }

    if (!expirationDate) {
      showToast("warning", "Expiration Required", "Please select an expiration date.");
      return;
    }

    const duplicate = state.batches.find(
      (item) => item.id !== state.editingBatchId && normalize(item.batchNumber) === normalize(batchNumber)
    );

    if (duplicate) {
      showToast("danger", "Duplicate Batch", "That batch number already exists.");
      return;
    }

    if (state.editingBatchId) {
      const batch = state.batches.find((item) => item.id === state.editingBatchId);
      if (!batch) return;

      batch.medicine = medicine;
      batch.form = form;
      batch.batchNumber = batchNumber;
      batch.supplier = supplier;
      batch.quantity = quantity;
      batch.capacity = Math.max(batch.capacity, quantity);
      batch.unitCost = unitCost;
      batch.expirationDate = expirationDate;

      saveBatches();
      closeBatchModal();
      renderAll();
      showToast("success", "Batch Updated", `${batch.batchNumber} was updated successfully.`);
      return;
    }

    const newBatch = {
      id: Date.now(),
      medicine,
      form,
      batchNumber,
      supplier,
      receivedDate: toISODate(new Date()),
      expirationDate,
      quantity,
      capacity: quantity,
      unitCost,
      archived: false
    };

    state.batches.unshift(newBatch);
    saveBatches();
    closeBatchModal();
    state.page = 1;
    renderAll();
    showToast("success", "Batch Added", `${newBatch.batchNumber} was received successfully.`);
  }

  function openAdjustModal(batch) {
    state.adjustingBatchId = batch.id;
    elements.adjustQuantityInput.value = String(batch.quantity);
    elements.adjustReasonInput.value = "";
    elements.adjustModal.hidden = false;
    document.body.classList.add("has-open-dialog");
  }

  function closeAdjustModal() {
    elements.adjustModal.hidden = true;
    state.adjustingBatchId = null;
    syncBodyDialogState();
  }

  function handleAdjustSubmit(event) {
    event.preventDefault();

    const batch = state.batches.find((item) => item.id === state.adjustingBatchId);
    if (!batch) return;

    const quantity = Number(elements.adjustQuantityInput.value);
    const reason = elements.adjustReasonInput.value.trim();

    if (Number.isNaN(quantity) || quantity < 0 || !reason) {
      showToast("warning", "Invalid Adjustment", "Enter a valid quantity and reason.");
      return;
    }

    batch.quantity = quantity;
    batch.capacity = Math.max(batch.capacity, quantity);
    saveBatches();

    closeAdjustModal();
    renderAll();

    showToast("success", "Stock Adjusted", `${batch.batchNumber} updated to ${quantity} pieces.`);
  }

  function openArchiveModal(batch) {
    state.archivingBatchId = batch.id;
    elements.archiveBatchText.textContent =
      `You are about to archive ${batch.batchNumber} (${batch.medicine}). This removes it from the active ledger view.`;
    elements.archiveModal.hidden = false;
    document.body.classList.add("has-open-dialog");
  }

  function closeArchiveModal() {
    elements.archiveModal.hidden = true;
    state.archivingBatchId = null;
    syncBodyDialogState();
  }

  function confirmArchive() {
    const batch = state.batches.find((item) => item.id === state.archivingBatchId);
    if (!batch) return;

    batch.archived = true;
    saveBatches();

    closeArchiveModal();
    state.page = 1;
    renderAll();

    showToast("danger", "Batch Archived", `${batch.batchNumber} was archived from the active ledger.`);
  }

  function syncBodyDialogState() {
    const hasOpenDialog = document.querySelector(".modal-backdrop:not([hidden])");
    if (!hasOpenDialog) {
      document.body.classList.remove("has-open-dialog");
    }
  }

  function exportVisibleBatches() {
    const rows = getFilteredBatches();

    if (!rows.length) {
      showToast("warning", "Nothing to Export", "There are no visible batch rows to export.");
      return;
    }

    const csvRows = [
      [
        "Batch Number",
        "Medicine",
        "Form",
        "Supplier",
        "Received Date",
        "Expiration Date",
        "Quantity",
        "Capacity",
        "Status",
        "Unit Cost"
      ]
    ];

    rows.forEach((batch) => {
      csvRows.push([
        batch.batchNumber,
        batch.medicine,
        batch.form,
        batch.supplier,
        batch.receivedDate,
        batch.expirationDate || "N/A",
        batch.quantity,
        batch.capacity,
        getStatusLabel(getBatchStatus(batch)),
        batch.unitCost
      ]);
    });

    const csv = csvRows
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "spirits-os-batches.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast("success", "Export Complete", "Visible batches were exported to CSV.");
  }

  function buildNotifications() {
    const notifications = [];
    const activeBatches = getActiveBatches();

    activeBatches
      .filter((batch) => getBatchStatus(batch) === "expired")
      .slice(0, 2)
      .forEach((batch) => {
        notifications.push({
          tone: "error",
          title: `${batch.batchNumber} has expired`,
          message: `${batch.medicine} needs immediate disposal review.`,
          timestamp: batch.expirationDate || batch.receivedDate
        });
      });

    activeBatches
      .filter((batch) => getBatchStatus(batch) === "near-expiry")
      .slice(0, 2)
      .forEach((batch) => {
        const days = getDaysUntil(batch.expirationDate);
        notifications.push({
          tone: "warning",
          title: `${batch.batchNumber} is near expiry`,
          message: `${batch.medicine} expires in ${days} day${days === 1 ? "" : "s"}.`,
          timestamp: batch.expirationDate
        });
      });

    activeBatches
      .slice()
      .sort((a, b) => parseDate(b.receivedDate) - parseDate(a.receivedDate))
      .slice(0, 2)
      .forEach((batch) => {
        notifications.push({
          tone: "success",
          title: `Recent stock-in: ${batch.batchNumber}`,
          message: `${batch.medicine} was received from ${batch.supplier}.`,
          timestamp: batch.receivedDate
        });
      });

    return notifications
      .sort((a, b) => {
        const aDate = parseDate(a.timestamp) || new Date(0);
        const bDate = parseDate(b.timestamp) || new Date(0);
        return bDate - aDate;
      })
      .slice(0, 5);
  }

  function renderNotifications() {
    if (!elements.notificationList || !elements.notificationCount) return;

    const notifications = buildNotifications();
    const lastReadAt = localStorage.getItem(NOTIFICATION_READ_KEY);

    const unreadCount = notifications.filter((item) => {
      if (!lastReadAt) return true;
      const itemDate = parseDate(item.timestamp);
      const readDate = new Date(lastReadAt);
      return itemDate ? itemDate.getTime() > readDate.getTime() : false;
    }).length;

    elements.notificationCount.textContent = String(unreadCount);

    if (!notifications.length) {
      elements.notificationList.innerHTML = `
        <div class="notification-item">
          <div class="notification-item-dot success"></div>
          <div class="notification-item-copy">
            <strong>No new alerts</strong>
            <p>Your batch notifications are clear right now.</p>
          </div>
        </div>
      `;
      return;
    }

    elements.notificationList.innerHTML = notifications
      .map((item) => {
        return `
          <div class="notification-item">
            <div class="notification-item-dot ${item.tone}"></div>
            <div class="notification-item-copy">
              <strong>${escapeHtml(item.title)}</strong>
              <p>${escapeHtml(item.message)}</p>
              <span>${escapeHtml(formatDate(item.timestamp))}</span>
            </div>
          </div>
        `;
      })
      .join("");
  }

  function showToast(type, title, message) {
    const toast = document.createElement("div");
    toast.className = `toast toast--${type}`;
    toast.innerHTML = `
      <strong>${escapeHtml(title)}</strong>
      <p>${escapeHtml(message)}</p>
    `;

    elements.toastStack.appendChild(toast);

    window.setTimeout(() => {
      toast.remove();
    }, 3200);
  }
})();
