(() => {
  "use strict";

  document.addEventListener("DOMContentLoaded", initializeStockMovementsPage);

  function initializeStockMovementsPage() {
    const STORAGE_KEYS = {
      movements: "spirits-os-stock-movements",
      notificationsReadAt: "spirits-os-stock-movements-notifications-read-at"
    };

    const defaultMovements = [
      {
        id: "mov-001",
        timestamp: "2026-04-15T08:20:00",
        type: "stock-in",
        medicine: "Biogesic",
        form: "Paracetamol 500mg",
        quantity: 120,
        reference: "RCV-240415-001",
        reason: "Received replenishment from supplier.",
        sourceMovementId: ""
      },
      {
        id: "mov-002",
        timestamp: "2026-04-15T09:05:00",
        type: "stock-out",
        medicine: "Amoxil",
        form: "Amoxicillin 500mg",
        quantity: -18,
        reference: "SO-240415-104",
        reason: "Batch released for front-store sales.",
        sourceMovementId: ""
      },
      {
        id: "mov-003",
        timestamp: "2026-04-15T10:12:00",
        type: "adjustment",
        medicine: "Kremil-S",
        form: "Antacid Chewable",
        quantity: -6,
        reference: "ADJ-240415-002",
        reason: "Damaged pieces removed after shelf inspection.",
        sourceMovementId: ""
      },
      {
        id: "mov-004",
        timestamp: "2026-04-15T11:30:00",
        type: "audit",
        medicine: "Medicol",
        form: "Ibuprofen 400mg",
        quantity: 14,
        reference: "AUD-240415-001",
        reason: "Cycle count correction for aisle B.",
        sourceMovementId: ""
      },
      {
        id: "mov-005",
        timestamp: "2026-04-15T12:08:00",
        type: "stock-in",
        medicine: "Ascof",
        form: "Lagundi 120mL",
        quantity: 32,
        reference: "RCV-240415-002",
        reason: "New delivery posted to inventory.",
        sourceMovementId: ""
      },
      {
        id: "mov-006",
        timestamp: "2026-04-15T13:14:00",
        type: "stock-out",
        medicine: "Biogesic",
        form: "Paracetamol 500mg",
        quantity: -24,
        reference: "SO-240415-118",
        reason: "Transferred for counter sales allocation.",
        sourceMovementId: ""
      },
      {
        id: "mov-007",
        timestamp: "2026-04-15T14:40:00",
        type: "audit",
        medicine: "Neozep",
        form: "Cold Tablet",
        quantity: 10,
        reference: "AUD-240415-003",
        reason: "Manual stock verification completed.",
        sourceMovementId: ""
      }
    ];

    const medicineCatalog = [
      { medicine: "Biogesic", form: "Paracetamol 500mg" },
      { medicine: "Amoxil", form: "Amoxicillin 500mg" },
      { medicine: "Medicol", form: "Ibuprofen 400mg" },
      { medicine: "Ascof", form: "Lagundi 120mL" },
      { medicine: "Kremil-S", form: "Antacid Chewable" },
      { medicine: "Neozep", form: "Cold Tablet" },
      { medicine: "Tiki-Tiki", form: "Multivitamins 120mL" }
    ];

    const state = {
      movements: [],
      search: "",
      type: "all",
      fromDate: "",
      toDate: "",
      page: 1,
      pageSize: 6,
      activeMenuId: null,
      activeDetailsId: null,
      adjustmentSourceId: null,
      reverseSourceId: null,
      reverseReference: ""
    };

    const elements = {
      liveClock: document.getElementById("liveClock"),
      dayName: document.getElementById("dayName"),
      todayDate: document.getElementById("todayDate"),

      totalStockIn: document.getElementById("totalStockIn"),
      totalStockOut: document.getElementById("totalStockOut"),
      netMovement: document.getElementById("netMovement"),

      exportLedgerBtn: document.getElementById("exportLedgerBtn"),
      openAuditModalBtn: document.getElementById("openAuditModalBtn"),

      movementSearchInput: document.getElementById("movementSearchInput"),
      movementTypeFilter: document.getElementById("movementTypeFilter"),
      toggleDateRangeBtn: document.getElementById("toggleDateRangeBtn"),
      dateRangePanel: document.getElementById("dateRangePanel"),
      fromDateInput: document.getElementById("fromDateInput"),
      toDateInput: document.getElementById("toDateInput"),
      clearDateRangeBtn: document.getElementById("clearDateRangeBtn"),

      movementTableBody: document.getElementById("movementTableBody"),
      movementPagination: document.getElementById("movementPagination"),
      movementResultsMeta: document.getElementById("movementResultsMeta"),
      menuPortal: document.getElementById("menuPortal"),

      auditModal: document.getElementById("auditModal"),
      closeAuditModalBtn: document.getElementById("closeAuditModalBtn"),
      cancelAuditModalBtn: document.getElementById("cancelAuditModalBtn"),
      auditForm: document.getElementById("auditForm"),
      auditMedicineInput: document.getElementById("auditMedicineInput"),
      auditTypeInput: document.getElementById("auditTypeInput"),
      auditEffectInput: document.getElementById("auditEffectInput"),
      auditQuantityInput: document.getElementById("auditQuantityInput"),
      auditReferenceInput: document.getElementById("auditReferenceInput"),
      auditReasonInput: document.getElementById("auditReasonInput"),

      adjustmentModal: document.getElementById("adjustmentModal"),
      closeAdjustmentModalBtn: document.getElementById("closeAdjustmentModalBtn"),
      cancelAdjustmentModalBtn: document.getElementById("cancelAdjustmentModalBtn"),
      adjustmentForm: document.getElementById("adjustmentForm"),
      adjustmentSourceReferenceInput: document.getElementById("adjustmentSourceReferenceInput"),
      adjustmentMedicineInput: document.getElementById("adjustmentMedicineInput"),
      adjustmentEffectInput: document.getElementById("adjustmentEffectInput"),
      adjustmentQuantityInput: document.getElementById("adjustmentQuantityInput"),
      adjustmentReferenceInput: document.getElementById("adjustmentReferenceInput"),
      adjustmentReasonInput: document.getElementById("adjustmentReasonInput"),

      reverseModal: document.getElementById("reverseModal"),
      closeReverseModalBtn: document.getElementById("closeReverseModalBtn"),
      cancelReverseModalBtn: document.getElementById("cancelReverseModalBtn"),
      confirmReverseBtn: document.getElementById("confirmReverseBtn"),
      reverseSourceReference: document.getElementById("reverseSourceReference"),
      reverseMedicine: document.getElementById("reverseMedicine"),
      reverseQuantity: document.getElementById("reverseQuantity"),
      reverseNewReference: document.getElementById("reverseNewReference"),
      reverseConfirmMessage: document.getElementById("reverseConfirmMessage"),

      detailsModal: document.getElementById("detailsModal"),
      closeDetailsModalBtn: document.getElementById("closeDetailsModalBtn"),
      closeDetailsFooterBtn: document.getElementById("closeDetailsFooterBtn"),
      movementDetailsContent: document.getElementById("movementDetailsContent"),

      notificationList: document.querySelector("[data-notification-list]"),
      notificationCount: document.querySelector("[data-notification-count]"),
      markAllReadBtn: document.querySelector("[data-mark-all-read]"),

      toastStack: document.getElementById("toastStack")
    };

    seedStorage();
    loadState();
    populateMedicineOptions();
    bindEvents();
    updateClock();
    window.setInterval(updateClock, 1000);
    renderAll();

    function seedStorage() {
      if (!localStorage.getItem(STORAGE_KEYS.movements)) {
        localStorage.setItem(STORAGE_KEYS.movements, JSON.stringify(defaultMovements));
      }
    }

    function loadState() {
      state.movements = readJson(STORAGE_KEYS.movements)
        .map(normalizeMovement)
        .sort((first, second) => new Date(second.timestamp) - new Date(first.timestamp));
    }

    function readJson(key) {
      try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : [];
      } catch (error) {
        return [];
      }
    }

    function saveMovements() {
      localStorage.setItem(STORAGE_KEYS.movements, JSON.stringify(state.movements));
    }

    function normalizeMovement(item) {
      return {
        id: item.id || createId("mov"),
        timestamp: item.timestamp || new Date().toISOString(),
        type: String(item.type || "audit").trim(),
        medicine: String(item.medicine || "").trim(),
        form: String(item.form || "").trim(),
        quantity: Number.isFinite(Number(item.quantity)) ? Number(item.quantity) : 0,
        reference: String(item.reference || "").trim(),
        reason: String(item.reason || "").trim(),
        sourceMovementId: String(item.sourceMovementId || "")
      };
    }

    function populateMedicineOptions() {
      elements.auditMedicineInput.innerHTML = medicineCatalog
        .map(
          (item) =>
            `<option value="${escapeHtml(item.medicine)}">${escapeHtml(item.medicine)} • ${escapeHtml(item.form)}</option>`
        )
        .join("");
    }

    function bindEvents() {
      elements.exportLedgerBtn.addEventListener("click", exportLedger);
      elements.openAuditModalBtn.addEventListener("click", openAuditModal);

      elements.movementSearchInput.addEventListener("input", () => {
        state.search = elements.movementSearchInput.value.trim().toLowerCase();
        state.page = 1;
        renderAll();
      });

      elements.movementTypeFilter.addEventListener("change", () => {
        state.type = elements.movementTypeFilter.value;
        state.page = 1;
        renderAll();
      });

      elements.toggleDateRangeBtn.addEventListener("click", () => {
        const shouldOpen = elements.dateRangePanel.hidden;
        elements.dateRangePanel.hidden = !shouldOpen;
        elements.toggleDateRangeBtn.setAttribute("aria-expanded", String(shouldOpen));
      });

      elements.fromDateInput.addEventListener("change", () => {
        state.fromDate = elements.fromDateInput.value;
        state.page = 1;
        renderAll();
      });

      elements.toDateInput.addEventListener("change", () => {
        state.toDate = elements.toDateInput.value;
        state.page = 1;
        renderAll();
      });

      elements.clearDateRangeBtn.addEventListener("click", () => {
        state.fromDate = "";
        state.toDate = "";
        elements.fromDateInput.value = "";
        elements.toDateInput.value = "";
        state.page = 1;
        renderAll();
      });

      elements.closeAuditModalBtn.addEventListener("click", closeAuditModal);
      elements.cancelAuditModalBtn.addEventListener("click", closeAuditModal);
      elements.auditModal.addEventListener("click", (event) => {
        if (event.target === elements.auditModal) {
          closeAuditModal();
        }
      });
      elements.auditForm.addEventListener("submit", handleAuditSubmit);

      elements.closeAdjustmentModalBtn.addEventListener("click", closeAdjustmentModal);
      elements.cancelAdjustmentModalBtn.addEventListener("click", closeAdjustmentModal);
      elements.adjustmentModal.addEventListener("click", (event) => {
        if (event.target === elements.adjustmentModal) {
          closeAdjustmentModal();
        }
      });
      elements.adjustmentForm.addEventListener("submit", handleAdjustmentSubmit);

      elements.closeReverseModalBtn.addEventListener("click", closeReverseModal);
      elements.cancelReverseModalBtn.addEventListener("click", closeReverseModal);
      elements.reverseModal.addEventListener("click", (event) => {
        if (event.target === elements.reverseModal) {
          closeReverseModal();
        }
      });
      elements.confirmReverseBtn.addEventListener("click", handleReverseConfirm);

      elements.closeDetailsModalBtn.addEventListener("click", closeDetailsModal);
      elements.closeDetailsFooterBtn.addEventListener("click", closeDetailsModal);
      elements.detailsModal.addEventListener("click", (event) => {
        if (event.target === elements.detailsModal) {
          closeDetailsModal();
        }
      });

      if (elements.markAllReadBtn) {
        elements.markAllReadBtn.addEventListener("click", () => {
          localStorage.setItem(STORAGE_KEYS.notificationsReadAt, new Date().toISOString());
          renderNotifications();
          showToast("success", "Notifications cleared", "All stock movement notifications were marked as read.");
        });
      }

      document.addEventListener("click", handleDocumentClick);
      document.addEventListener("keydown", handleKeydown);
      window.addEventListener("resize", closeRowMenu);
      window.addEventListener("scroll", closeRowMenu, true);
    }

    function handleDocumentClick(event) {
      const trigger = event.target.closest("[data-menu-trigger]");
      const rowAction = event.target.closest("[data-row-action]");
      const insideMenu = event.target.closest(".row-menu");

      if (trigger) {
        event.stopPropagation();
        const movementId = trigger.getAttribute("data-menu-trigger");
        const movement = findMovementById(movementId);
        if (!movement) return;

        if (state.activeMenuId === movementId) {
          closeRowMenu();
          return;
        }

        openRowMenu(trigger, movement);
        return;
      }

      if (rowAction) {
        event.stopPropagation();
        const movementId = rowAction.getAttribute("data-id");
        const action = rowAction.getAttribute("data-row-action");
        closeRowMenu();
        handleRowAction(action, movementId);
        return;
      }

      if (!insideMenu && state.activeMenuId) {
        closeRowMenu();
      }
    }

    function handleKeydown(event) {
      if (event.key !== "Escape") return;

      if (!elements.auditModal.hidden) {
        closeAuditModal();
        return;
      }

      if (!elements.adjustmentModal.hidden) {
        closeAdjustmentModal();
        return;
      }

      if (!elements.reverseModal.hidden) {
        closeReverseModal();
        return;
      }

      if (!elements.detailsModal.hidden) {
        closeDetailsModal();
        return;
      }

      closeRowMenu();
    }

    function renderAll() {
      renderStats();
      renderTable();
      renderNotifications();
    }

    function renderStats() {
      const totalIn = state.movements
        .filter((item) => item.type === "stock-in")
        .reduce((sum, item) => sum + Math.abs(item.quantity), 0);

      const totalOut = state.movements
        .filter((item) => item.type === "stock-out")
        .reduce((sum, item) => sum + Math.abs(item.quantity), 0);

      const net = state.movements.reduce((sum, item) => sum + item.quantity, 0);

      elements.totalStockIn.textContent = `${formatNumber(totalIn)} units`;
      elements.totalStockOut.textContent = `${formatNumber(totalOut)} units`;
      elements.netMovement.textContent = `${formatSignedQuantity(net)} units`;
    }

    function getFilteredMovements() {
      return state.movements.filter((item) => {
        const searchText = `${item.medicine} ${item.form} ${item.reference} ${item.reason}`.toLowerCase();
        const matchesSearch = !state.search || searchText.includes(state.search);
        const matchesType = state.type === "all" || item.type === state.type;
        const matchesFrom = !state.fromDate || new Date(item.timestamp) >= new Date(`${state.fromDate}T00:00:00`);
        const matchesTo = !state.toDate || new Date(item.timestamp) <= new Date(`${state.toDate}T23:59:59`);

        return matchesSearch && matchesType && matchesFrom && matchesTo;
      });
    }

    function renderTable() {
      const filtered = getFilteredMovements();
      const totalPages = Math.max(1, Math.ceil(filtered.length / state.pageSize));
      state.page = Math.min(state.page, totalPages);

      const start = (state.page - 1) * state.pageSize;
      const pageItems = filtered.slice(start, start + state.pageSize);

      if (!pageItems.length) {
        elements.movementTableBody.innerHTML = `
          <tr>
            <td colspan="6">
              <div class="movement-empty">
                <div class="movement-empty__card">
                  <div class="movement-empty__icon">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M12 8v4l2.5 1.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
                      <circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="1.8"></circle>
                    </svg>
                  </div>
                  <h3>No stock movements found</h3>
                  <p>Try adjusting your search, type filter, or date range.</p>
                </div>
              </div>
            </td>
          </tr>
        `;
      } else {
        elements.movementTableBody.innerHTML = pageItems.map(renderRow).join("");
      }

      renderPagination(filtered.length, totalPages, pageItems.length, start);
    }

    function renderRow(item) {
      const typeLabel = getTypeLabel(item.type);

      return `
        <tr>
          <td>
            <div class="timestamp-cell">
              <strong>${escapeHtml(formatDate(item.timestamp))}</strong>
              <span>${escapeHtml(formatTime(item.timestamp))}</span>
            </div>
          </td>

          <td>
            <span class="movement-type-pill ${escapeHtml(item.type)}">${escapeHtml(typeLabel)}</span>
          </td>

          <td>
            <div class="medicine-cell">
              <span class="medicine-cell__icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M7 17l10-10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
                  <path d="M6.3 20.2a4.2 4.2 0 0 1 0-5.9l6-6a4.2 4.2 0 1 1 5.9 5.9l-6 6a4.2 4.2 0 0 1-5.9 0Z" stroke="currentColor" stroke-width="1.8"></path>
                </svg>
              </span>
              <div class="medicine-cell__copy">
                <strong>${escapeHtml(item.medicine)}</strong>
                <span>${escapeHtml(item.form)}</span>
              </div>
            </div>
          </td>

          <td>
            <span class="quantity-pill ${escapeHtml(item.type)}">${escapeHtml(formatSignedQuantity(item.quantity))} units</span>
          </td>

          <td>
            <div class="reference-cell">
              <strong>${escapeHtml(item.reference)}</strong>
              <span>${escapeHtml(item.reason)}</span>
            </div>
          </td>

          <td class="actions-col">
            <div class="row-action-shell">
              <button
                type="button"
                class="action-trigger"
                data-menu-trigger="${escapeHtml(item.id)}"
                aria-label="Open movement actions"
              >
                <svg viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="5" r="1.8" fill="currentColor"></circle>
                  <circle cx="12" cy="12" r="1.8" fill="currentColor"></circle>
                  <circle cx="12" cy="19" r="1.8" fill="currentColor"></circle>
                </svg>
              </button>
            </div>
          </td>
        </tr>
      `;
    }

    function renderPagination(totalItems, totalPages, pageItemsLength, startIndex) {
      elements.movementPagination.innerHTML = "";

      const end = totalItems ? startIndex + pageItemsLength : 0;
      const from = totalItems ? startIndex + 1 : 0;
      elements.movementResultsMeta.textContent = `Showing ${from} to ${end} of ${totalItems} entries`;

      if (!totalItems || totalPages <= 1) return;

      const prevButton = createPaginationButton("‹", state.page === 1, () => {
        if (state.page > 1) {
          state.page -= 1;
          closeRowMenu();
          renderTable();
        }
      });

      elements.movementPagination.appendChild(prevButton);

      for (let page = 1; page <= totalPages; page += 1) {
        const button = createPaginationButton(String(page), false, () => {
          state.page = page;
          closeRowMenu();
          renderTable();
        });

        if (page === state.page) {
          button.classList.add("active");
        }

        elements.movementPagination.appendChild(button);
      }

      const nextButton = createPaginationButton("›", state.page === totalPages, () => {
        if (state.page < totalPages) {
          state.page += 1;
          closeRowMenu();
          renderTable();
        }
      });

      elements.movementPagination.appendChild(nextButton);
    }

    function createPaginationButton(label, disabled, onClick) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "page-btn";
      button.textContent = label;
      button.disabled = disabled;
      button.addEventListener("click", onClick);
      return button;
    }

    function openRowMenu(trigger, item) {
      state.activeMenuId = item.id;
      const rect = trigger.getBoundingClientRect();

      const menuWidth = 232;
      const menuHeight = 182;
      let top = rect.bottom + 8;
      let left = rect.right - menuWidth;

      if (left < 12) left = 12;
      if (left + menuWidth > window.innerWidth - 12) {
        left = window.innerWidth - menuWidth - 12;
      }

      if (top + menuHeight > window.innerHeight - 12) {
        top = Math.max(12, rect.top - menuHeight - 8);
      }

      const isReversed = Boolean(findReversalBySource(item.id));

      elements.menuPortal.innerHTML = `
        <div class="row-menu" style="top:${top}px; left:${left}px;">
          <button type="button" data-row-action="view" data-id="${escapeHtml(item.id)}">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" stroke="currentColor" stroke-width="1.8"></path>
              <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.8"></circle>
            </svg>
            <span>View Details</span>
          </button>

          <button type="button" data-row-action="adjust" data-id="${escapeHtml(item.id)}">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
            </svg>
            <span>Create Adjustment</span>
          </button>

          <button
            type="button"
            class="${isReversed ? "danger-option" : ""}"
            data-row-action="reverse"
            data-id="${escapeHtml(item.id)}"
          >
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M8 7H4v4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
              <path d="M4 11a8 8 0 1 0 2.3-5.7L4 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
            <span>${isReversed ? "Already Reversed" : "Reverse Entry"}</span>
          </button>

          <button type="button" data-row-action="copy" data-id="${escapeHtml(item.id)}">
            <svg viewBox="0 0 24 24" fill="none">
              <rect x="9" y="9" width="10" height="10" rx="2" stroke="currentColor" stroke-width="1.8"></rect>
              <path d="M6 15H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1" stroke="currentColor" stroke-width="1.8"></path>
            </svg>
            <span>Copy Reference</span>
          </button>
        </div>
      `;
    }

    function closeRowMenu() {
      state.activeMenuId = null;
      elements.menuPortal.innerHTML = "";
    }

    function handleRowAction(action, movementId) {
      const item = findMovementById(movementId);
      if (!item) return;

      if (action === "view") {
        openDetailsModal(item);
        return;
      }

      if (action === "adjust") {
        openAdjustmentModal(item);
        return;
      }

      if (action === "reverse") {
        openReverseModal(item);
        return;
      }

      if (action === "copy") {
        copyReference(item.reference);
      }
    }

    function openAuditModal() {
      elements.auditForm.reset();
      elements.auditMedicineInput.selectedIndex = 0;
      elements.auditTypeInput.value = "audit";
      elements.auditEffectInput.value = "increase";
      elements.auditReferenceInput.value = generateReference("AUD");
      elements.auditModal.hidden = false;
      document.body.classList.add("has-open-dialog");
    }

    function closeAuditModal() {
      elements.auditModal.hidden = true;
      syncDialogBodyState();
    }

    function handleAuditSubmit(event) {
      event.preventDefault();

      const medicineValue = elements.auditMedicineInput.value.trim();
      const medicineMeta = medicineCatalog.find((item) => item.medicine === medicineValue);
      const movementType = elements.auditTypeInput.value.trim();
      const effect = elements.auditEffectInput.value.trim();
      const rawQuantity = Number(elements.auditQuantityInput.value);
      const quantity = getSignedQuantityForType(movementType, effect, rawQuantity);

      const movement = {
        id: createId("mov"),
        timestamp: new Date().toISOString(),
        type: movementType,
        medicine: medicineValue,
        form: medicineMeta ? medicineMeta.form : "Medicine",
        quantity,
        reference: elements.auditReferenceInput.value.trim().toUpperCase(),
        reason: elements.auditReasonInput.value.trim(),
        sourceMovementId: ""
      };

      if (
        !movement.medicine ||
        !movement.type ||
        !Number.isFinite(rawQuantity) ||
        rawQuantity < 1 ||
        !movement.reference ||
        !movement.reason
      ) {
        showToast("warning", "Missing details", "Complete all audit fields before saving.");
        return;
      }

      const duplicateReference = state.movements.find(
        (item) => item.reference.toLowerCase() === movement.reference.toLowerCase()
      );

      if (duplicateReference) {
        showToast("error", "Reference already exists", "Use a unique reference number for this movement.");
        return;
      }

      state.movements.unshift(movement);
      sortAndPersist();
      closeAuditModal();
      state.page = 1;
      renderAll();
      showToast("success", "Audit entry saved", `${movement.reference} has been added to the movement ledger.`);
    }

    function openAdjustmentModal(item) {
      state.adjustmentSourceId = item.id;
      elements.adjustmentSourceReferenceInput.value = item.reference;
      elements.adjustmentMedicineInput.value = `${item.medicine} • ${item.form}`;
      elements.adjustmentEffectInput.value = item.quantity >= 0 ? "decrease" : "increase";
      elements.adjustmentQuantityInput.value = String(Math.abs(item.quantity));
      elements.adjustmentReferenceInput.value = generateReference("ADJ");
      elements.adjustmentReasonInput.value = "";
      elements.adjustmentModal.hidden = false;
      document.body.classList.add("has-open-dialog");
    }

    function closeAdjustmentModal() {
      elements.adjustmentModal.hidden = true;
      state.adjustmentSourceId = null;
      syncDialogBodyState();
    }

    function handleAdjustmentSubmit(event) {
      event.preventDefault();

      const source = findMovementById(state.adjustmentSourceId);
      const effect = elements.adjustmentEffectInput.value.trim();
      const rawQuantity = Number(elements.adjustmentQuantityInput.value);
      const reference = elements.adjustmentReferenceInput.value.trim().toUpperCase();
      const reason = elements.adjustmentReasonInput.value.trim();

      if (!source) {
        showToast("error", "Source missing", "The original movement entry could not be found.");
        return;
      }

      if (!Number.isFinite(rawQuantity) || rawQuantity < 1 || !reference || !reason) {
        showToast("warning", "Missing details", "Complete all adjustment fields before posting.");
        return;
      }

      const duplicateReference = state.movements.find(
        (item) => item.reference.toLowerCase() === reference.toLowerCase()
      );

      if (duplicateReference) {
        showToast("error", "Reference already exists", "Use a unique reference number for this adjustment.");
        return;
      }

      const adjustment = {
        id: createId("mov"),
        timestamp: new Date().toISOString(),
        type: "adjustment",
        medicine: source.medicine,
        form: source.form,
        quantity: effect === "decrease" ? -Math.abs(rawQuantity) : Math.abs(rawQuantity),
        reference,
        reason,
        sourceMovementId: source.id
      };

      state.movements.unshift(adjustment);
      sortAndPersist();
      closeAdjustmentModal();
      state.page = 1;
      renderAll();
      showToast("success", "Adjustment posted", `${reference} was added without changing the original entry.`);
    }

    function openReverseModal(item) {
      const existingReversal = findReversalBySource(item.id);
      if (existingReversal) {
        showToast("warning", "Already reversed", `${item.reference} already has reversal ${existingReversal.reference}.`);
        return;
      }

      state.reverseSourceId = item.id;
      state.reverseReference = generateReference("REV");

      elements.reverseSourceReference.textContent = item.reference;
      elements.reverseMedicine.textContent = `${item.medicine} • ${item.form}`;
      elements.reverseQuantity.textContent = `${formatSignedQuantity(item.quantity)} units`;
      elements.reverseNewReference.textContent = state.reverseReference;
      elements.reverseConfirmMessage.textContent =
        `This will post ${state.reverseReference} with the opposite quantity of ${item.reference}. The original row stays unchanged.`;

      elements.reverseModal.hidden = false;
      document.body.classList.add("has-open-dialog");
    }

    function closeReverseModal() {
      elements.reverseModal.hidden = true;
      state.reverseSourceId = null;
      state.reverseReference = "";
      syncDialogBodyState();
    }

    function handleReverseConfirm() {
      const source = findMovementById(state.reverseSourceId);
      if (!source) {
        showToast("error", "Source missing", "The original movement entry could not be found.");
        return;
      }

      const existingReversal = findReversalBySource(source.id);
      if (existingReversal) {
        closeReverseModal();
        showToast("warning", "Already reversed", `${source.reference} already has reversal ${existingReversal.reference}.`);
        return;
      }

      const reversal = {
        id: createId("mov"),
        timestamp: new Date().toISOString(),
        type: "reversal",
        medicine: source.medicine,
        form: source.form,
        quantity: source.quantity * -1,
        reference: state.reverseReference,
        reason: `Reversal of ${source.reference}. Original note: ${source.reason}`,
        sourceMovementId: source.id
      };

      state.movements.unshift(reversal);
      sortAndPersist();
      closeReverseModal();
      state.page = 1;
      renderAll();
      showToast("success", "Reversal posted", `${reversal.reference} was created to reverse ${source.reference}.`);
    }

    function openDetailsModal(item) {
      state.activeDetailsId = item.id;
      const source = item.sourceMovementId ? findMovementById(item.sourceMovementId) : null;

      elements.movementDetailsContent.innerHTML = `
        <div class="detail-item">
          <span>Reference No.</span>
          <strong>${escapeHtml(item.reference)}</strong>
        </div>
        <div class="detail-item">
          <span>Medicine</span>
          <strong>${escapeHtml(item.medicine)} • ${escapeHtml(item.form)}</strong>
        </div>
        <div class="detail-item">
          <span>Movement Type</span>
          <strong>${escapeHtml(getTypeLabel(item.type))}</strong>
        </div>
        <div class="detail-item">
          <span>Quantity</span>
          <strong>${escapeHtml(formatSignedQuantity(item.quantity))} units</strong>
        </div>
        <div class="detail-item">
          <span>Date</span>
          <strong>${escapeHtml(formatDate(item.timestamp))} ${escapeHtml(formatTime(item.timestamp))}</strong>
        </div>
        <div class="detail-item">
          <span>Reason / Notes</span>
          <strong>${escapeHtml(item.reason)}</strong>
        </div>
        <div class="detail-item">
          <span>Source Movement</span>
          <strong>${source ? escapeHtml(source.reference) : "Original Entry"}</strong>
        </div>
      `;

      elements.detailsModal.hidden = false;
      document.body.classList.add("has-open-dialog");
    }

    function closeDetailsModal() {
      elements.detailsModal.hidden = true;
      state.activeDetailsId = null;
      syncDialogBodyState();
    }

    function syncDialogBodyState() {
      const hasVisibleDialog = document.querySelector(".dialog-backdrop:not([hidden])");
      if (!hasVisibleDialog) {
        document.body.classList.remove("has-open-dialog");
      }
    }

    function exportLedger() {
      const rows = getFilteredMovements();

      if (!rows.length) {
        showToast("warning", "Nothing to export", "There are no visible stock movement records to export.");
        return;
      }

      const header = [
        "Timestamp",
        "Movement Type",
        "Medicine",
        "Form",
        "Quantity",
        "Reference",
        "Reason",
        "Source Movement"
      ];

      const csvRows = rows.map((item) => {
        const source = item.sourceMovementId ? findMovementById(item.sourceMovementId) : null;
        return [
          item.timestamp,
          getTypeLabel(item.type),
          item.medicine,
          item.form,
          formatSignedQuantity(item.quantity),
          item.reference,
          item.reason,
          source ? source.reference : ""
        ].map(csvEscape).join(",");
      });

      const csvContent = [header.join(","), ...csvRows].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "spirits-os-stock-movements.csv";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showToast("success", "Ledger exported", "Stock movement ledger has been downloaded successfully.");
    }

    function buildNotifications() {
      const notifications = [];
      const recent = state.movements.slice(0, 5);

      recent.forEach((item) => {
        let tone = "success";
        if (item.type === "stock-out" || item.quantity < 0) tone = "warning";
        if (item.type === "reversal") tone = "info";

        notifications.push({
          tone,
          title: `${getTypeLabel(item.type)} • ${item.medicine}`,
          message: `${item.reference} • ${formatSignedQuantity(item.quantity)} units recorded.`,
          timestamp: item.timestamp
        });
      });

      return notifications;
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
              <p>Your stock movement notifications are clear right now.</p>
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
                <span>${escapeHtml(formatDate(item.timestamp))} ${escapeHtml(formatTime(item.timestamp))}</span>
              </div>
            </div>
          `;
        })
        .join("");
    }

    function copyReference(reference) {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
        navigator.clipboard.writeText(reference).then(() => {
          showToast("success", "Reference copied", `${reference} copied to clipboard.`);
        }).catch(() => {
          showToast("info", "Reference ready", reference);
        });
        return;
      }

      showToast("info", "Reference ready", reference);
    }

    function findMovementById(id) {
      return state.movements.find((item) => item.id === id) || null;
    }

    function findReversalBySource(sourceId) {
      return state.movements.find((item) => item.type === "reversal" && item.sourceMovementId === sourceId) || null;
    }

    function sortAndPersist() {
      state.movements.sort((first, second) => new Date(second.timestamp) - new Date(first.timestamp));
      saveMovements();
    }

    function createId(prefix) {
      return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    }

    function generateReference(prefix) {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      const serial = String(Math.floor(Math.random() * 900) + 100);
      return `${prefix}-${year}${month}${day}-${serial}`;
    }

    function getTypeLabel(type) {
      const labels = {
        "stock-in": "Stock In",
        "stock-out": "Stock Out",
        adjustment: "Adjustment",
        audit: "Audit",
        reversal: "Reversal"
      };

      return labels[type] || "Audit";
    }

    function getSignedQuantityForType(type, effect, quantity) {
      const safeQuantity = Math.abs(Number(quantity));

      if (type === "stock-in") return safeQuantity;
      if (type === "stock-out") return safeQuantity * -1;
      if (type === "adjustment" || type === "audit") {
        return effect === "decrease" ? safeQuantity * -1 : safeQuantity;
      }

      return safeQuantity;
    }

    function formatNumber(value) {
      return new Intl.NumberFormat("en-US").format(value);
    }

    function formatSignedQuantity(value) {
      const number = Number(value) || 0;
      const sign = number >= 0 ? "+" : "-";
      return `${sign}${formatNumber(Math.abs(number))}`;
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
        second: "2-digit",
        hour12: false
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

    function csvEscape(value) {
      return `"${String(value ?? "").replace(/"/g, '""')}"`;
    }

    function escapeHtml(value) {
      return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
    }

    function showToast(tone, title, message) {
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
  }
})();