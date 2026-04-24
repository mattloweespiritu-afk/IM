(() => {
  "use strict";

  document.addEventListener("DOMContentLoaded", initializeMedicinesPage);

  function initializeMedicinesPage() {
    const STORAGE_KEYS = {
      medicines: "spirits-os-medicines",
      movements: "spirits-os-medicine-movements",
      view: "spirits-os-medicines-view",
      notificationsReadAt: "spirits-os-medicines-notifications-read-at"
    };

    const defaultMedicines = [
      {
        id: "med-001",
        sku: "PAR-500",
        category: "Analgesics",
        brandName: "Biogesic",
        genericName: "Paracetamol",
        dosage: "500mg",
        price: 5,
        formType: "Tablet",
        unitType: "Piece",
        stock: 450,
        reorderLevel: 100,
        archived: false,
        updatedAt: "2026-04-13T08:15:00"
      },
      {
        id: "med-002",
        sku: "IBU-400",
        category: "Analgesics",
        brandName: "Medicol",
        genericName: "Ibuprofen",
        dosage: "400mg",
        price: 9,
        formType: "Capsule",
        unitType: "Piece",
        stock: 86,
        reorderLevel: 100,
        archived: false,
        updatedAt: "2026-04-13T09:10:00"
      },
      {
        id: "med-003",
        sku: "AMX-500",
        category: "Antibiotics",
        brandName: "Amoxil",
        genericName: "Amoxicillin",
        dosage: "500mg",
        price: 18,
        formType: "Capsule",
        unitType: "Piece",
        stock: 220,
        reorderLevel: 60,
        archived: false,
        updatedAt: "2026-04-12T14:35:00"
      },
      {
        id: "med-004",
        sku: "CET-10",
        category: "Antihistamines",
        brandName: "Zyrtec",
        genericName: "Cetirizine",
        dosage: "10mg",
        price: 7,
        formType: "Tablet",
        unitType: "Piece",
        stock: 0,
        reorderLevel: 40,
        archived: false,
        updatedAt: "2026-04-11T17:45:00"
      },
      {
        id: "med-005",
        sku: "VIT-SYR",
        category: "Vitamins",
        brandName: "Tiki-Tiki",
        genericName: "Multivitamins",
        dosage: "120mL",
        price: 120,
        formType: "Syrup",
        unitType: "Bottle",
        stock: 34,
        reorderLevel: 40,
        archived: false,
        updatedAt: "2026-04-13T06:50:00"
      },
      {
        id: "med-006",
        sku: "KRM-STR",
        category: "Gastrointestinal",
        brandName: "Kremil-S",
        genericName: "Antacid",
        dosage: "Chewable",
        price: 8.5,
        formType: "Tablet",
        unitType: "Piece",
        stock: 164,
        reorderLevel: 80,
        archived: false,
        updatedAt: "2026-04-12T15:20:00"
      },
      {
        id: "med-007",
        sku: "ASC-120",
        category: "Cough and Cold",
        brandName: "Ascof",
        genericName: "Lagundi",
        dosage: "120mL",
        price: 145,
        formType: "Syrup",
        unitType: "Bottle",
        stock: 58,
        reorderLevel: 30,
        archived: false,
        updatedAt: "2026-04-12T10:00:00"
      },
      {
        id: "med-008",
        sku: "NZP-TAB",
        category: "Cough and Cold",
        brandName: "Neozep",
        genericName: "Phenylephrine + Chlorphenamine + Paracetamol",
        dosage: "Tablet",
        price: 11,
        formType: "Tablet",
        unitType: "Piece",
        stock: 130,
        reorderLevel: 70,
        archived: false,
        updatedAt: "2026-04-10T13:28:00"
      }
    ];

    const defaultMovements = [
      {
        id: "mv-001",
        medicineId: "med-001",
        type: "Created",
        quantity: 450,
        note: "Initial inventory record added.",
        timestamp: "2026-04-13T08:20:00"
      },
      {
        id: "mv-002",
        medicineId: "med-002",
        type: "Restocked",
        quantity: 50,
        note: "Replenished capsule stock.",
        timestamp: "2026-04-13T09:05:00"
      },
      {
        id: "mv-003",
        medicineId: "med-004",
        type: "Stock Update",
        quantity: -24,
        note: "Marked as out of stock after recent sales.",
        timestamp: "2026-04-11T17:45:00"
      },
      {
        id: "mv-004",
        medicineId: "med-005",
        type: "Stock Update",
        quantity: -6,
        note: "Low stock threshold reached.",
        timestamp: "2026-04-13T06:50:00"
      },
      {
        id: "mv-005",
        medicineId: "med-006",
        type: "Edited",
        quantity: 0,
        note: "Updated pricing and unit details.",
        timestamp: "2026-04-12T15:25:00"
      },
      {
        id: "mv-006",
        medicineId: "med-007",
        type: "Restocked",
        quantity: 20,
        note: "Bottle stock replenished.",
        timestamp: "2026-04-12T10:10:00"
      }
    ];

    const state = {
      medicines: [],
      movements: [],
      search: "",
      category: "all",
      stockState: "all",
      sort: "name-asc",
      view: "table",
      page: 1,
      pageSize: 5,
      activeMenuId: null,
      pendingArchiveId: null,
      activeDetailsId: null
    };

    const elements = {
      liveClock: document.getElementById("liveClock"),
      dayName: document.getElementById("dayName"),
      todayDate: document.getElementById("todayDate"),

      totalMedicinesStat: document.getElementById("totalMedicinesStat"),
      lowStockStat: document.getElementById("lowStockStat"),
      recentMovementsStat: document.getElementById("recentMovementsStat"),

      inventorySearchInput: document.getElementById("inventorySearchInput"),
      categoryFilter: document.getElementById("categoryFilter"),
      stockFilter: document.getElementById("stockFilter"),
      sortSelect: document.getElementById("sortSelect"),
      toggleFiltersBtn: document.getElementById("toggleFiltersBtn"),
      filtersPanel: document.getElementById("filtersPanel"),
      resetFiltersBtn: document.getElementById("resetFiltersBtn"),

      viewButtons: Array.from(document.querySelectorAll("[data-view]")),
      tableView: document.getElementById("tableView"),
      gridView: document.getElementById("gridView"),
      medicineTableBody: document.getElementById("medicineTableBody"),
      medicineGrid: document.getElementById("medicineGrid"),
      inventoryEmpty: document.getElementById("inventoryEmpty"),
      inventoryMeta: document.getElementById("inventoryMeta"),
      pagination: document.getElementById("pagination"),

      openAddMedicineBtn: document.getElementById("openAddMedicineBtn"),
      emptyStateAddBtn: document.getElementById("emptyStateAddBtn"),
      exportCsvBtn: document.getElementById("exportCsvBtn"),

      medicineModal: document.getElementById("medicineModal"),
      medicineModalTitle: document.getElementById("medicineModalTitle"),
      medicineModalSubtitle: document.getElementById("medicineModalSubtitle"),
      medicineForm: document.getElementById("medicineForm"),
      medicineIdInput: document.getElementById("medicineIdInput"),
      skuInput: document.getElementById("skuInput"),
      categoryInput: document.getElementById("categoryInput"),
      brandNameInput: document.getElementById("brandNameInput"),
      genericNameInput: document.getElementById("genericNameInput"),
      dosageInput: document.getElementById("dosageInput"),
      priceInput: document.getElementById("priceInput"),
      formTypeInput: document.getElementById("formTypeInput"),
      unitTypeInput: document.getElementById("unitTypeInput"),
      stockInput: document.getElementById("stockInput"),
      reorderLevelInput: document.getElementById("reorderLevelInput"),
      saveMedicineBtn: document.getElementById("saveMedicineBtn"),

      detailsModal: document.getElementById("detailsModal"),
      detailsModalTitle: document.getElementById("detailsModalTitle"),
      detailsContent: document.getElementById("detailsContent"),
      detailsHistory: document.getElementById("detailsHistory"),
      detailsRestockBtn: document.getElementById("detailsRestockBtn"),

      restockModal: document.getElementById("restockModal"),
      restockForm: document.getElementById("restockForm"),
      restockMedicineId: document.getElementById("restockMedicineId"),
      restockMedicineName: document.getElementById("restockMedicineName"),
      restockQuantityInput: document.getElementById("restockQuantityInput"),

      confirmModal: document.getElementById("confirmModal"),
      confirmMessage: document.getElementById("confirmMessage"),
      confirmArchiveBtn: document.getElementById("confirmArchiveBtn"),

      toastStack: document.getElementById("toastStack"),

      notificationList: document.querySelector("[data-notification-list]"),
      notificationCount: document.querySelector("[data-notification-count]"),
      markAllReadBtn: document.querySelector("[data-mark-all-read]")
    };

    seedStorage();
    loadState();
    populateCategoryFilter();
    bindEvents();
    updateClock();
    window.setInterval(updateClock, 1000);
    renderAll();
    handleInitialRoute();

    function seedStorage() {
      if (!localStorage.getItem(STORAGE_KEYS.medicines)) {
        localStorage.setItem(STORAGE_KEYS.medicines, JSON.stringify(defaultMedicines));
      }

      if (!localStorage.getItem(STORAGE_KEYS.movements)) {
        localStorage.setItem(STORAGE_KEYS.movements, JSON.stringify(defaultMovements));
      }

      if (!localStorage.getItem(STORAGE_KEYS.view)) {
        localStorage.setItem(STORAGE_KEYS.view, "table");
      }
    }

    function loadState() {
      state.medicines = readJson(STORAGE_KEYS.medicines).map(normalizeMedicine);
      state.movements = readJson(STORAGE_KEYS.movements).map(normalizeMovement);
      state.view = localStorage.getItem(STORAGE_KEYS.view) || "table";
    }

    function readJson(key) {
      try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : [];
      } catch (error) {
        return [];
      }
    }

    function normalizeMedicine(medicine) {
      return {
        id: medicine.id || createId("med"),
        sku: String(medicine.sku || "").trim(),
        category: String(medicine.category || "").trim(),
        brandName: String(medicine.brandName || "").trim(),
        genericName: String(medicine.genericName || "").trim(),
        dosage: String(medicine.dosage || "").trim(),
        price: Number(medicine.price || 0),
        formType: String(medicine.formType || "").trim(),
        unitType: String(medicine.unitType || "").trim(),
        stock: Number.isFinite(Number(medicine.stock)) ? Number(medicine.stock) : 0,
        reorderLevel: Number.isFinite(Number(medicine.reorderLevel)) ? Number(medicine.reorderLevel) : 0,
        archived: Boolean(medicine.archived),
        updatedAt: medicine.updatedAt || new Date().toISOString()
      };
    }

    function normalizeMovement(movement) {
      return {
        id: movement.id || createId("mv"),
        medicineId: String(movement.medicineId || ""),
        type: String(movement.type || "Updated"),
        quantity: Number.isFinite(Number(movement.quantity)) ? Number(movement.quantity) : 0,
        note: String(movement.note || ""),
        timestamp: movement.timestamp || new Date().toISOString()
      };
    }

    function saveMedicines() {
      localStorage.setItem(STORAGE_KEYS.medicines, JSON.stringify(state.medicines));
    }

    function saveMovements() {
      localStorage.setItem(STORAGE_KEYS.movements, JSON.stringify(state.movements));
    }

    function populateCategoryFilter() {
      const categories = Array.from(
        new Set(
          state.medicines
            .filter((item) => !item.archived)
            .map((item) => item.category)
            .filter(Boolean)
        )
      ).sort((a, b) => a.localeCompare(b));

      const currentValue = state.category;
      elements.categoryFilter.innerHTML = '<option value="all">All Categories</option>';

      categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        elements.categoryFilter.appendChild(option);
      });

      elements.categoryFilter.value = categories.includes(currentValue) ? currentValue : "all";
      state.category = elements.categoryFilter.value;
    }

    function bindEvents() {
      elements.inventorySearchInput.addEventListener("input", () => {
        state.search = elements.inventorySearchInput.value.trim().toLowerCase();
        state.page = 1;
        renderAll();
      });

      elements.categoryFilter.addEventListener("change", () => {
        state.category = elements.categoryFilter.value;
        state.page = 1;
        renderAll();
      });

      elements.stockFilter.addEventListener("change", () => {
        state.stockState = elements.stockFilter.value;
        state.page = 1;
        renderAll();
      });

      elements.sortSelect.addEventListener("change", () => {
        state.sort = elements.sortSelect.value;
        state.page = 1;
        renderAll();
      });

      elements.resetFiltersBtn.addEventListener("click", () => {
        state.search = "";
        state.category = "all";
        state.stockState = "all";
        state.sort = "name-asc";
        state.page = 1;

        elements.inventorySearchInput.value = "";
        elements.categoryFilter.value = "all";
        elements.stockFilter.value = "all";
        elements.sortSelect.value = "name-asc";

        renderAll();
      });

      elements.toggleFiltersBtn.addEventListener("click", (event) => {
        event.stopPropagation();
        const shouldOpen = elements.filtersPanel.hidden;
        elements.filtersPanel.hidden = !shouldOpen;
        elements.toggleFiltersBtn.setAttribute("aria-expanded", String(shouldOpen));
        state.activeMenuId = null;
        renderInventoryOnly();
      });

      elements.viewButtons.forEach((button) => {
        button.addEventListener("click", () => {
          state.view = button.dataset.view || "table";
          state.activeMenuId = null;
          state.page = 1;
          localStorage.setItem(STORAGE_KEYS.view, state.view);
          syncViewButtons();
          renderInventoryOnly();
        });
      });

      elements.openAddMedicineBtn.addEventListener("click", openCreateMedicineModal);
      elements.emptyStateAddBtn.addEventListener("click", openCreateMedicineModal);
      elements.exportCsvBtn.addEventListener("click", exportCsv);

      elements.medicineForm.addEventListener("submit", handleMedicineSubmit);
      elements.restockForm.addEventListener("submit", handleRestockSubmit);
      elements.confirmArchiveBtn.addEventListener("click", handleArchiveConfirm);
      elements.detailsRestockBtn.addEventListener("click", () => {
        if (!state.activeDetailsId) return;
        closeDialog(elements.detailsModal);
        openRestockModal(state.activeDetailsId);
      });

      document.querySelectorAll("[data-close-dialog]").forEach((button) => {
        button.addEventListener("click", () => {
          const dialogId = button.getAttribute("data-close-dialog");
          const dialog = dialogId ? document.getElementById(dialogId) : null;
          if (dialog) closeDialog(dialog);
        });
      });

      document.addEventListener("click", handleDocumentClick);
      document.addEventListener("keydown", handleDocumentKeydown);
      window.addEventListener("resize", closeMenusAndPopups);
      window.addEventListener("scroll", closeMenusAndPopups, true);

      if (elements.markAllReadBtn) {
        elements.markAllReadBtn.addEventListener("click", () => {
          localStorage.setItem(STORAGE_KEYS.notificationsReadAt, new Date().toISOString());
          renderNotifications();
          showToast("Notifications cleared", "All inventory notifications have been marked as read.", "success");
        });
      }
    }

    function handleInitialRoute() {
      const params = new URLSearchParams(window.location.search);

      if (params.get("open") === "create") {
        openCreateMedicineModal();
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

    function handleDocumentClick(event) {
      const trigger = event.target.closest("[data-menu-trigger]");
      const rowActionButton = event.target.closest("[data-row-action]");
      const insideActionShell = event.target.closest(".row-action-shell");
      const insideFiltersPanel = event.target.closest("#filtersPanel");
      const clickedToggleFilters = event.target.closest("#toggleFiltersBtn");
      const dialogBackdrop = event.target.classList.contains("dialog-backdrop") ? event.target : null;

      if (trigger) {
        event.stopPropagation();
        const medicineId = trigger.getAttribute("data-menu-trigger");
        state.activeMenuId = state.activeMenuId === medicineId ? null : medicineId;
        renderInventoryOnly();
        return;
      }

      if (rowActionButton) {
        event.stopPropagation();
        const medicineId = rowActionButton.getAttribute("data-id");
        const action = rowActionButton.getAttribute("data-row-action");
        state.activeMenuId = null;
        renderInventoryOnly();
        handleRowAction(action, medicineId);
        return;
      }

      if (dialogBackdrop) {
        closeDialog(dialogBackdrop);
      }

      if (!insideActionShell && state.activeMenuId) {
        state.activeMenuId = null;
        renderInventoryOnly();
      }

      if (!insideFiltersPanel && !clickedToggleFilters && !elements.filtersPanel.hidden) {
        elements.filtersPanel.hidden = true;
        elements.toggleFiltersBtn.setAttribute("aria-expanded", "false");
      }
    }

    function handleDocumentKeydown(event) {
      if (event.key !== "Escape") return;

      const openDialogElement = document.querySelector(".dialog-backdrop:not([hidden])");
      if (openDialogElement) {
        closeDialog(openDialogElement);
        return;
      }

      if (!elements.filtersPanel.hidden) {
        elements.filtersPanel.hidden = true;
        elements.toggleFiltersBtn.setAttribute("aria-expanded", "false");
      }

      if (state.activeMenuId) {
        state.activeMenuId = null;
        renderInventoryOnly();
      }
    }

    function closeMenusAndPopups() {
      if (state.activeMenuId) {
        state.activeMenuId = null;
        renderInventoryOnly();
      }
    }

    function renderAll() {
      renderStats();
      populateCategoryFilter();
      renderInventoryOnly();
      renderNotifications();
    }

    function renderInventoryOnly() {
      const filteredMedicines = getFilteredMedicines();
      const totalPages = Math.max(1, Math.ceil(filteredMedicines.length / state.pageSize));
      state.page = Math.min(state.page, totalPages);

      const start = (state.page - 1) * state.pageSize;
      const pageItems = filteredMedicines.slice(start, start + state.pageSize);

      syncViewButtons();
      renderTable(pageItems);
      renderGrid(pageItems);
      renderEmptyState(filteredMedicines.length === 0);
      renderInventoryMeta(filteredMedicines.length, pageItems.length, start);
      renderPagination(filteredMedicines.length, totalPages);
    }

    function getFilteredMedicines() {
      const activeMedicines = state.medicines.filter((item) => !item.archived);
      const query = state.search;

      const filtered = activeMedicines.filter((item) => {
        const matchesSearch =
          !query ||
          item.brandName.toLowerCase().includes(query) ||
          item.genericName.toLowerCase().includes(query) ||
          item.sku.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query);

        const status = getStockStatus(item);
        const matchesCategory = state.category === "all" || item.category === state.category;
        const matchesStockState = state.stockState === "all" || status.key === state.stockState;

        return matchesSearch && matchesCategory && matchesStockState;
      });

      return filtered.sort(sortMedicines);
    }

    function sortMedicines(first, second) {
      switch (state.sort) {
        case "name-desc":
          return second.brandName.localeCompare(first.brandName);
        case "stock-desc":
          return second.stock - first.stock;
        case "stock-asc":
          return first.stock - second.stock;
        case "price-desc":
          return second.price - first.price;
        case "price-asc":
          return first.price - second.price;
        case "name-asc":
        default:
          return first.brandName.localeCompare(second.brandName);
      }
    }

    function getStockStatus(item) {
      const unitLabel = `${item.stock} ${item.unitType.toLowerCase()}${item.stock > 1 ? "s" : ""}`;

      if (item.stock <= 0) {
        return { key: "out", label: "Out of Stock", stockLabel: "0 units" };
      }

      if (item.stock <= item.reorderLevel) {
        return {
          key: "low",
          label: "Low Stock",
          stockLabel: unitLabel
        };
      }

      return {
        key: "active",
        label: "Active",
        stockLabel: unitLabel
      };
    }

    function renderStats() {
      const activeMedicines = state.medicines.filter((item) => !item.archived);
      const lowStockCount = activeMedicines.filter((item) => item.stock <= item.reorderLevel).length;
      const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      const recentMovements = state.movements.filter((movement) => {
        return new Date(movement.timestamp).getTime() >= sevenDaysAgo;
      }).length;

      elements.totalMedicinesStat.textContent = String(activeMedicines.length);
      elements.lowStockStat.textContent = String(lowStockCount);
      elements.recentMovementsStat.textContent = String(recentMovements);
    }

    function renderTable(items) {
      if (!items.length) {
        elements.medicineTableBody.innerHTML = "";
        return;
      }

      elements.medicineTableBody.innerHTML = items
        .map((item) => {
          const status = getStockStatus(item);
          const statusClass = status.key;
          const isMenuOpen = state.activeMenuId === item.id;

          return `
            <tr>
              <td>
                <div class="medicine-main">
                  <div class="medicine-icon">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M7 17l10-10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
                      <path d="M6.3 20.2a4.2 4.2 0 0 1 0-5.9l6-6a4.2 4.2 0 1 1 5.9 5.9l-6 6a4.2 4.2 0 0 1-5.9 0Z" stroke="currentColor" stroke-width="1.8"></path>
                    </svg>
                  </div>

                  <div class="medicine-copy">
                    <h4>${escapeHtml(item.brandName)}</h4>
                    <p>${escapeHtml(item.genericName)} • ${escapeHtml(item.dosage)}</p>
                    <span>${escapeHtml(item.sku)}</span>
                  </div>
                </div>
              </td>

              <td>
                <span class="category-pill">${escapeHtml(item.category)}</span>
              </td>

              <td class="price-cell">
                <strong>${formatCurrency(item.price)}</strong>
                <small>Per ${escapeHtml(item.unitType)}</small>
              </td>

              <td>
                <span class="stock-pill ${statusClass}">${escapeHtml(status.stockLabel)}</span>
              </td>

              <td>
                <span class="status-pill ${statusClass}">${escapeHtml(status.label)}</span>
              </td>

              <td class="actions-col">
                <div class="row-action-shell">
                  <button
                    type="button"
                    class="action-trigger"
                    data-menu-trigger="${item.id}"
                    aria-expanded="${String(isMenuOpen)}"
                    aria-label="Open row actions"
                  >
                    <svg viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="5" r="1.8" fill="currentColor"></circle>
                      <circle cx="12" cy="12" r="1.8" fill="currentColor"></circle>
                      <circle cx="12" cy="19" r="1.8" fill="currentColor"></circle>
                    </svg>
                  </button>

                  ${isMenuOpen ? renderActionMenu(item.id) : ""}
                </div>
              </td>
            </tr>
          `;
        })
        .join("");
    }

    function renderGrid(items) {
      if (!items.length) {
        elements.medicineGrid.innerHTML = "";
        return;
      }

      elements.medicineGrid.innerHTML = items
        .map((item) => {
          const status = getStockStatus(item);
          const isMenuOpen = state.activeMenuId === item.id;

          return `
            <article class="medicine-card">
              <div class="medicine-card-top">
                <div class="medicine-card-title">
                  <div class="medicine-icon">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M7 17l10-10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
                      <path d="M6.3 20.2a4.2 4.2 0 0 1 0-5.9l6-6a4.2 4.2 0 1 1 5.9 5.9l-6 6a4.2 4.2 0 0 1-5.9 0Z" stroke="currentColor" stroke-width="1.8"></path>
                    </svg>
                  </div>

                  <div>
                    <h4>${escapeHtml(item.brandName)}</h4>
                    <p>${escapeHtml(item.genericName)} • ${escapeHtml(item.dosage)}</p>
                  </div>
                </div>

                <div class="row-action-shell">
                  <button
                    type="button"
                    class="action-trigger"
                    data-menu-trigger="${item.id}"
                    aria-expanded="${String(isMenuOpen)}"
                    aria-label="Open card actions"
                  >
                    <svg viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="5" r="1.8" fill="currentColor"></circle>
                      <circle cx="12" cy="12" r="1.8" fill="currentColor"></circle>
                      <circle cx="12" cy="19" r="1.8" fill="currentColor"></circle>
                    </svg>
                  </button>

                  ${isMenuOpen ? renderActionMenu(item.id) : ""}
                </div>
              </div>

              <div class="medicine-card-body">
                <div class="medicine-card-stat">
                  <span>SKU</span>
                  <strong>${escapeHtml(item.sku)}</strong>
                </div>

                <div class="medicine-card-stat">
                  <span>Category</span>
                  <strong>${escapeHtml(item.category)}</strong>
                </div>

                <div class="medicine-card-stat">
                  <span>Price</span>
                  <strong>${formatCurrency(item.price)}</strong>
                </div>

                <div class="medicine-card-stat">
                  <span>Stock</span>
                  <strong>${escapeHtml(status.stockLabel)}</strong>
                </div>
              </div>

              <div class="medicine-card-footer">
                <span class="status-pill ${status.key}">${escapeHtml(status.label)}</span>
                <span class="category-pill">${escapeHtml(item.formType)} • ${escapeHtml(item.unitType)}</span>
              </div>
            </article>
          `;
        })
        .join("");
    }

    function renderActionMenu(id) {
      return `
        <div class="row-menu">
          <button type="button" data-row-action="view" data-id="${id}">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" stroke="currentColor" stroke-width="1.8"></path>
              <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.8"></circle>
            </svg>
            <span>View Details</span>
          </button>

          <button type="button" data-row-action="edit" data-id="${id}">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M4 20h4l10-10-4-4L4 16v4Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"></path>
              <path d="M13 7l4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
            </svg>
            <span>Edit Record</span>
          </button>

          <button type="button" data-row-action="restock" data-id="${id}">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
            </svg>
            <span>Quick Restock</span>
          </button>

          <button type="button" class="danger-option" data-row-action="archive" data-id="${id}">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M5 7h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
              <path d="M8 7V5h8v2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
              <path d="M8 10v7M12 10v7M16 10v7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
              <path d="M7 7l1 12h8l1-12" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"></path>
            </svg>
            <span>Archive Item</span>
          </button>
        </div>
      `;
    }

    function renderEmptyState(isEmpty) {
      elements.inventoryEmpty.hidden = !isEmpty;
      elements.tableView.hidden = isEmpty || state.view !== "table";
      elements.gridView.hidden = isEmpty || state.view !== "grid";
    }

    function renderInventoryMeta(totalItems, pageItemsLength, startIndex) {
      if (!totalItems) {
        elements.inventoryMeta.textContent = "Showing 0 of 0 items";
        return;
      }

      const end = startIndex + pageItemsLength;
      elements.inventoryMeta.textContent = `Showing ${startIndex + 1} to ${end} of ${totalItems} items`;
    }

    function renderPagination(totalItems, totalPages) {
      elements.pagination.innerHTML = "";

      if (!totalItems || totalPages <= 1) {
        return;
      }

      const prevButton = createPaginationButton("‹", state.page === 1, () => {
        if (state.page > 1) {
          state.page -= 1;
          state.activeMenuId = null;
          renderInventoryOnly();
        }
      });

      elements.pagination.appendChild(prevButton);

      for (let page = 1; page <= totalPages; page += 1) {
        const button = createPaginationButton(String(page), false, () => {
          state.page = page;
          state.activeMenuId = null;
          renderInventoryOnly();
        });

        if (page === state.page) {
          button.classList.add("active");
        }

        elements.pagination.appendChild(button);
      }

      const nextButton = createPaginationButton("›", state.page === totalPages, () => {
        if (state.page < totalPages) {
          state.page += 1;
          state.activeMenuId = null;
          renderInventoryOnly();
        }
      });

      elements.pagination.appendChild(nextButton);
    }

    function createPaginationButton(label, isDisabled, onClick) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "page-btn";
      button.textContent = label;
      button.disabled = isDisabled;
      button.addEventListener("click", onClick);
      return button;
    }

    function syncViewButtons() {
      elements.viewButtons.forEach((button) => {
        button.classList.toggle("active", button.dataset.view === state.view);
      });
    }

    function handleRowAction(action, medicineId) {
      if (!medicineId) return;

      switch (action) {
        case "view":
          openDetailsModal(medicineId);
          break;
        case "edit":
          openEditMedicineModal(medicineId);
          break;
        case "restock":
          openRestockModal(medicineId);
          break;
        case "archive":
          openArchiveModal(medicineId);
          break;
        default:
          break;
      }
    }

    function openCreateMedicineModal() {
      elements.medicineModalTitle.textContent = "New Medicine Record";
      elements.medicineModalSubtitle.textContent = "Enter the details for the new pharmaceutical item.";
      elements.saveMedicineBtn.innerHTML = "<span>Create Record</span>";
      elements.medicineForm.reset();
      elements.medicineIdInput.value = "";
      elements.stockInput.value = "0";
      elements.reorderLevelInput.value = "0";
      openDialog(elements.medicineModal);
    }

    function openEditMedicineModal(medicineId) {
      const medicine = findMedicineById(medicineId);
      if (!medicine) return;

      elements.medicineModalTitle.textContent = "Edit Medicine Record";
      elements.medicineModalSubtitle.textContent = "Update the details for this inventory item.";
      elements.saveMedicineBtn.innerHTML = "<span>Save Changes</span>";

      elements.medicineIdInput.value = medicine.id;
      elements.skuInput.value = medicine.sku;
      elements.categoryInput.value = medicine.category;
      elements.brandNameInput.value = medicine.brandName;
      elements.genericNameInput.value = medicine.genericName;
      elements.dosageInput.value = medicine.dosage;
      elements.priceInput.value = String(medicine.price);
      elements.formTypeInput.value = medicine.formType;
      elements.unitTypeInput.value = medicine.unitType;
      elements.stockInput.value = String(medicine.stock);
      elements.reorderLevelInput.value = String(medicine.reorderLevel);

      openDialog(elements.medicineModal);
    }

    function handleMedicineSubmit(event) {
      event.preventDefault();

      const formData = collectMedicineFormData();
      if (!formData) return;

      const duplicateSku = state.medicines.find((item) => {
        return !item.archived && item.sku.toLowerCase() === formData.sku.toLowerCase() && item.id !== formData.id;
      });

      if (duplicateSku) {
        showToast("SKU already exists", "Use a unique item code before saving this medicine.", "error");
        return;
      }

      if (formData.id) {
        const currentMedicine = findMedicineById(formData.id);
        if (!currentMedicine) return;

        Object.assign(currentMedicine, formData, { updatedAt: new Date().toISOString() });
        addMovement(currentMedicine.id, "Edited", 0, "Medicine record updated.");
        showToast("Medicine updated", `${currentMedicine.brandName} has been updated successfully.`, "success");
      } else {
        const newMedicine = {
          ...formData,
          id: createId("med"),
          archived: false,
          updatedAt: new Date().toISOString()
        };

        state.medicines.unshift(newMedicine);
        addMovement(newMedicine.id, "Created", newMedicine.stock, "New medicine record added.");
        showToast("Medicine added", `${newMedicine.brandName} has been added to inventory.`, "success");
      }

      saveMedicines();
      closeDialog(elements.medicineModal);
      state.page = 1;
      populateCategoryFilter();
      renderAll();
    }

    function collectMedicineFormData() {
      const id = elements.medicineIdInput.value.trim();
      const sku = elements.skuInput.value.trim().toUpperCase();
      const category = elements.categoryInput.value.trim();
      const brandName = elements.brandNameInput.value.trim();
      const genericName = elements.genericNameInput.value.trim();
      const dosage = elements.dosageInput.value.trim();
      const price = Number(elements.priceInput.value);
      const formType = elements.formTypeInput.value.trim();
      const unitType = elements.unitTypeInput.value.trim();
      const stock = Number(elements.stockInput.value);
      const reorderLevel = Number(elements.reorderLevelInput.value);

      if (!sku || !category || !brandName || !genericName || !dosage || !formType || !unitType) {
        showToast("Missing details", "Please complete all medicine fields before saving.", "warning");
        return null;
      }

      if (
        !Number.isFinite(price) ||
        price < 0 ||
        !Number.isFinite(stock) ||
        stock < 0 ||
        !Number.isFinite(reorderLevel) ||
        reorderLevel < 0
      ) {
        showToast("Invalid numbers", "Price, stock, and reorder level must be valid positive numbers.", "warning");
        return null;
      }

      return {
        id,
        sku,
        category,
        brandName,
        genericName,
        dosage,
        price: Number(price.toFixed(2)),
        formType,
        unitType,
        stock: Math.floor(stock),
        reorderLevel: Math.floor(reorderLevel)
      };
    }

    function openDetailsModal(medicineId) {
      const medicine = findMedicineById(medicineId);
      if (!medicine) return;

      state.activeDetailsId = medicineId;
      const status = getStockStatus(medicine);
      const recentHistory = state.movements
        .filter((movement) => movement.medicineId === medicineId)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 4);

      elements.detailsModalTitle.textContent = medicine.brandName;

      elements.detailsContent.innerHTML = `
        <div class="detail-item">
          <span>SKU / Item Code</span>
          <strong>${escapeHtml(medicine.sku)}</strong>
        </div>
        <div class="detail-item">
          <span>Category</span>
          <strong>${escapeHtml(medicine.category)}</strong>
        </div>
        <div class="detail-item">
          <span>Generic Name</span>
          <strong>${escapeHtml(medicine.genericName)}</strong>
        </div>
        <div class="detail-item">
          <span>Dosage / Strength</span>
          <strong>${escapeHtml(medicine.dosage)}</strong>
        </div>
        <div class="detail-item">
          <span>Price</span>
          <strong>${formatCurrency(medicine.price)} / ${escapeHtml(medicine.unitType)}</strong>
        </div>
        <div class="detail-item">
          <span>Current Stock</span>
          <strong>${escapeHtml(status.stockLabel)}</strong>
        </div>
        <div class="detail-item">
          <span>Form Type</span>
          <strong>${escapeHtml(medicine.formType)}</strong>
        </div>
        <div class="detail-item">
          <span>Status</span>
          <strong>${escapeHtml(status.label)}</strong>
        </div>
      `;

      elements.detailsHistory.innerHTML = recentHistory.length
        ? recentHistory
            .map((movement) => {
              const quantityText =
                movement.quantity > 0
                  ? `+${movement.quantity}`
                  : movement.quantity < 0
                  ? `${movement.quantity}`
                  : "—";

              return `
                <div class="history-row">
                  <div class="history-copy">
                    <strong>${escapeHtml(movement.type)} ${quantityText !== "—" ? `(${escapeHtml(quantityText)})` : ""}</strong>
                    <p>${escapeHtml(movement.note || "Inventory activity recorded.")}</p>
                  </div>
                  <span class="history-time">${formatDateTime(movement.timestamp)}</span>
                </div>
              `;
            })
            .join("")
        : '<div class="history-row"><div class="history-copy"><strong>No recent activity</strong><p>This medicine does not have recent stock updates yet.</p></div></div>';

      openDialog(elements.detailsModal);
    }

    function openRestockModal(medicineId) {
      const medicine = findMedicineById(medicineId);
      if (!medicine) return;

      elements.restockMedicineId.value = medicine.id;
      elements.restockMedicineName.value = `${medicine.brandName} (${medicine.sku})`;
      elements.restockQuantityInput.value = "10";
      openDialog(elements.restockModal);
    }

    function handleRestockSubmit(event) {
      event.preventDefault();

      const medicineId = elements.restockMedicineId.value;
      const medicine = findMedicineById(medicineId);
      const quantity = Number(elements.restockQuantityInput.value);

      if (!medicine) return;

      if (!Number.isFinite(quantity) || quantity < 1) {
        showToast("Invalid quantity", "Enter a restock quantity greater than zero.", "warning");
        return;
      }

      medicine.stock += Math.floor(quantity);
      medicine.updatedAt = new Date().toISOString();

      addMovement(
        medicine.id,
        "Restocked",
        Math.floor(quantity),
        `Added ${Math.floor(quantity)} ${medicine.unitType.toLowerCase()}${quantity > 1 ? "s" : ""} to stock.`
      );
      saveMedicines();

      closeDialog(elements.restockModal);
      renderAll();
      showToast("Stock updated", `${medicine.brandName} stock increased by ${Math.floor(quantity)}.`, "success");
    }

    function openArchiveModal(medicineId) {
      const medicine = findMedicineById(medicineId);
      if (!medicine) return;

      state.pendingArchiveId = medicineId;
      elements.confirmMessage.textContent = `Archive ${medicine.brandName} (${medicine.sku}) from the active inventory list?`;
      openDialog(elements.confirmModal);
    }

    function handleArchiveConfirm() {
      if (!state.pendingArchiveId) return;

      const medicine = findMedicineById(state.pendingArchiveId);
      if (!medicine) return;

      medicine.archived = true;
      medicine.updatedAt = new Date().toISOString();
      addMovement(medicine.id, "Archived", 0, "Medicine archived from active inventory.");
      saveMedicines();

      closeDialog(elements.confirmModal);
      state.pendingArchiveId = null;
      state.page = 1;
      populateCategoryFilter();
      renderAll();
      showToast("Medicine archived", `${medicine.brandName} has been removed from active inventory.`, "warning");
    }

    function exportCsv() {
      const rows = getFilteredMedicines();

      if (!rows.length) {
        showToast("Nothing to export", "There are no medicine records matching the current view.", "warning");
        return;
      }

      const header = [
        "SKU",
        "Category",
        "Brand Name",
        "Generic Name",
        "Dosage / Strength",
        "Selling Price",
        "Form Type",
        "Unit Type",
        "Current Stock",
        "Reorder Level",
        "Status"
      ];

      const csvRows = rows.map((item) => {
        const status = getStockStatus(item).label;
        return [
          item.sku,
          item.category,
          item.brandName,
          item.genericName,
          item.dosage,
          item.price,
          item.formType,
          item.unitType,
          item.stock,
          item.reorderLevel,
          status
        ]
          .map(csvEscape)
          .join(",");
      });

      const csvContent = [header.join(","), ...csvRows].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "spirits-os-medicines.csv";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showToast("CSV exported", "Medicine inventory has been downloaded successfully.", "success");
    }

    function csvEscape(value) {
      const stringValue = String(value ?? "");
      return `"${stringValue.replace(/"/g, '""')}"`;
    }

    function addMovement(medicineId, type, quantity, note) {
      state.movements.unshift({
        id: createId("mv"),
        medicineId,
        type,
        quantity,
        note,
        timestamp: new Date().toISOString()
      });

      state.movements = state.movements.slice(0, 100);
      saveMovements();
    }

    function renderNotifications() {
      if (!elements.notificationList || !elements.notificationCount) return;

      const notifications = buildNotifications();
      const lastReadAt = localStorage.getItem(STORAGE_KEYS.notificationsReadAt);

      const unreadCount = notifications.filter((notification) => {
        if (!lastReadAt) return true;
        return new Date(notification.timestamp).getTime() > new Date(lastReadAt).getTime();
      }).length;

      elements.notificationCount.textContent = String(unreadCount);

      if (!notifications.length) {
        elements.notificationList.innerHTML = `
          <div class="notification-item">
            <div class="notification-item-dot success"></div>
            <div class="notification-item-copy">
              <strong>No new alerts</strong>
              <p>Your inventory notifications are clear right now.</p>
            </div>
          </div>
        `;
        return;
      }

      elements.notificationList.innerHTML = notifications
        .map((notification) => {
          return `
            <div class="notification-item">
              <div class="notification-item-dot ${notification.tone}"></div>
              <div class="notification-item-copy">
                <strong>${escapeHtml(notification.title)}</strong>
                <p>${escapeHtml(notification.message)}</p>
                <span>${formatDateTime(notification.timestamp)}</span>
              </div>
            </div>
          `;
        })
        .join("");
    }

    function buildNotifications() {
      const notifications = [];
      const activeMedicines = state.medicines.filter((item) => !item.archived);

      activeMedicines
        .filter((item) => item.stock <= 0)
        .slice(0, 2)
        .forEach((item) => {
          notifications.push({
            title: `${item.brandName} is out of stock`,
            message: "This medicine needs immediate replenishment.",
            timestamp: item.updatedAt,
            tone: "error"
          });
        });

      activeMedicines
        .filter((item) => item.stock > 0 && item.stock <= item.reorderLevel)
        .slice(0, 2)
        .forEach((item) => {
          notifications.push({
            title: `${item.brandName} is low on stock`,
            message: `Only ${item.stock} ${item.unitType.toLowerCase()}${item.stock > 1 ? "s" : ""} left.`,
            timestamp: item.updatedAt,
            tone: "warning"
          });
        });

      state.movements.slice(0, 2).forEach((movement) => {
        const medicine = findMedicineById(movement.medicineId);
        if (!medicine || medicine.archived) return;

        notifications.push({
          title: `${movement.type}: ${medicine.brandName}`,
          message: movement.note || "Inventory activity recorded.",
          timestamp: movement.timestamp,
          tone: "success"
        });
      });

      return notifications
        .sort((first, second) => new Date(second.timestamp) - new Date(first.timestamp))
        .slice(0, 5);
    }

    function openDialog(dialog) {
      if (!dialog) return;
      dialog.hidden = false;
      document.body.classList.add("has-open-dialog");
    }

    function closeDialog(dialog) {
      if (!dialog) return;
      dialog.hidden = true;

      if (dialog === elements.confirmModal) {
        state.pendingArchiveId = null;
      }

      const hasVisibleDialog = document.querySelector(".dialog-backdrop:not([hidden])");
      if (!hasVisibleDialog) {
        document.body.classList.remove("has-open-dialog");
      }
    }

    function findMedicineById(id) {
      return state.medicines.find((item) => item.id === id) || null;
    }

    function createId(prefix) {
      return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
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

      if (elements.todayDate) {
        elements.todayDate.textContent = now.toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric"
        });
      }

      if (elements.dayName) {
        elements.dayName.textContent = now.toLocaleDateString("en-US", {
          weekday: "long"
        });
      }
    }

    function showToast(title, message, tone) {
      if (!elements.toastStack) return;

      const toast = document.createElement("div");
      toast.className = `toast ${tone || "success"}`;
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

    function formatCurrency(value) {
      return new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
        minimumFractionDigits: value % 1 === 0 ? 0 : 2,
        maximumFractionDigits: 2
      }).format(value);
    }

    function formatDateTime(value) {
      const date = new Date(value);
      return date.toLocaleString("en-US", {
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      });
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
