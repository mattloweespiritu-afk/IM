(() => {
  "use strict";

  document.addEventListener("DOMContentLoaded", initializeExpirationAlertsPage);

  function initializeExpirationAlertsPage() {
    const STORAGE_KEYS = {
      batches: "spirits-os-expiration-batches",
      notificationsReadAt: "spirits-os-expiration-notifications-read-at"
    };

    const state = {
      batches: [],
      search: "",
      activeMenuId: null,
      detailBatchId: null,
      disposeBatchId: null
    };

    const elements = {
      liveClock: document.getElementById("liveClock"),
      dayName: document.getElementById("dayName"),
      todayDate: document.getElementById("todayDate"),

      expiredCount: document.getElementById("expiredCount"),
      nearExpiryCount: document.getElementById("nearExpiryCount"),
      safeCount: document.getElementById("safeCount"),

      exportReportBtn: document.getElementById("exportReportBtn"),
      openDisposalHistoryBtn: document.getElementById("openDisposalHistoryBtn"),
      alertSearchInput: document.getElementById("alertSearchInput"),

      expiredTableBody: document.getElementById("expiredTableBody"),
      nearTableBody: document.getElementById("nearTableBody"),

      safetyScoreText: document.getElementById("safetyScoreText"),
      safetyScoreBar: document.getElementById("safetyScoreBar"),
      safetyScoreNote: document.getElementById("safetyScoreNote"),

      menuPortal: document.getElementById("menuPortal"),

      detailsModal: document.getElementById("detailsModal"),
      closeDetailsModalBtn: document.getElementById("closeDetailsModalBtn"),
      closeDetailsFooterBtn: document.getElementById("closeDetailsFooterBtn"),
      detailsContent: document.getElementById("detailsContent"),

      disposeModal: document.getElementById("disposeModal"),
      closeDisposeModalBtn: document.getElementById("closeDisposeModalBtn"),
      cancelDisposeModalBtn: document.getElementById("cancelDisposeModalBtn"),
      disposeForm: document.getElementById("disposeForm"),
      disposeBatchLabel: document.getElementById("disposeBatchLabel"),
      disposeReasonInput: document.getElementById("disposeReasonInput"),

      historyModal: document.getElementById("historyModal"),
      closeHistoryModalBtn: document.getElementById("closeHistoryModalBtn"),
      closeHistoryFooterBtn: document.getElementById("closeHistoryFooterBtn"),
      historyTableBody: document.getElementById("historyTableBody"),

      notificationList: document.querySelector("[data-notification-list]"),
      notificationCount: document.querySelector("[data-notification-count]"),
      markAllReadBtn: document.querySelector("[data-mark-all-read]"),

      toastStack: document.getElementById("toastStack")
    };

    seedStorage();
    loadState();
    bindEvents();
    updateClock();
    window.setInterval(updateClock, 1000);
    renderAll();

    function seedStorage() {
      if (!localStorage.getItem(STORAGE_KEYS.batches)) {
        localStorage.setItem(STORAGE_KEYS.batches, JSON.stringify(createSeedBatches()));
      }
    }

    function createSeedBatches() {
      const now = new Date();

      return [
        createBatch({
          id: "bat-001",
          medicine: "Cetirizine",
          generic: "Cetirizine 10mg",
          batchNo: "CET-24008",
          qty: 22,
          expiryOffsetDays: -13,
          receivedOffsetDays: -120,
          supplier: "HealthFirst Supply"
        }),
        createBatch({
          id: "bat-002",
          medicine: "Losartan",
          generic: "Losartan 50mg",
          batchNo: "LOS-24101",
          qty: 16,
          expiryOffsetDays: -4,
          receivedOffsetDays: -90,
          supplier: "North Pharma Trading"
        }),
        createBatch({
          id: "bat-003",
          medicine: "Amoxicillin",
          generic: "Amoxicillin 500mg",
          batchNo: "AMX-24017",
          qty: 110,
          expiryOffsetDays: 25,
          receivedOffsetDays: -80,
          supplier: "PrimeMed Distributor"
        }),
        createBatch({
          id: "bat-004",
          medicine: "Amlodipine",
          generic: "Amlodipine 5mg",
          batchNo: "AML-24005",
          qty: 64,
          expiryOffsetDays: 43,
          receivedOffsetDays: -60,
          supplier: "Southline Medical"
        }),
        createBatch({
          id: "bat-005",
          medicine: "Ascof",
          generic: "Lagundi 120mL",
          batchNo: "ASC-24021",
          qty: 30,
          expiryOffsetDays: 9,
          receivedOffsetDays: -45,
          supplier: "HerbalCare Pharma"
        }),
        createBatch({
          id: "bat-006",
          medicine: "Biogesic",
          generic: "Paracetamol 500mg",
          batchNo: "BIO-24001",
          qty: 450,
          expiryOffsetDays: 90,
          receivedOffsetDays: -15,
          supplier: "Metro Drug Supply"
        }),
        createBatch({
          id: "bat-007",
          medicine: "Metformin",
          generic: "Metformin 500mg",
          batchNo: "MET-24009",
          qty: 190,
          expiryOffsetDays: 118,
          receivedOffsetDays: -25,
          supplier: "HealthFirst Supply"
        }),
        createBatch({
          id: "bat-008",
          medicine: "Tiki-Tiki",
          generic: "Multivitamins 120mL",
          batchNo: "TTK-24012",
          qty: 44,
          expiryOffsetDays: 135,
          receivedOffsetDays: -18,
          supplier: "SunWell Pharma"
        }),
        createBatch({
          id: "bat-009",
          medicine: "Kremil-S",
          generic: "Antacid Chewable",
          batchNo: "KRM-24002",
          qty: 12,
          expiryOffsetDays: -28,
          receivedOffsetDays: -160,
          supplier: "PrimeMed Distributor",
          status: "disposed",
          disposedAt: dateWithOffset(now, -3).toISOString(),
          disposalReason: "Expired stock removed during weekly compliance sweep."
        })
      ];
    }

    function createBatch(config) {
      const now = new Date();

      return {
        id: config.id,
        medicine: config.medicine,
        generic: config.generic,
        batchNo: config.batchNo,
        qty: Number(config.qty) || 0,
        expiryDate: dateWithOffset(now, config.expiryOffsetDays).toISOString(),
        receivedDate: dateWithOffset(now, config.receivedOffsetDays).toISOString(),
        supplier: config.supplier || "Supplier",
        status: config.status || "active",
        disposedAt: config.disposedAt || "",
        disposalReason: config.disposalReason || "",
        prioritySale: false
      };
    }

    function loadState() {
      state.batches = readJson(STORAGE_KEYS.batches)
        .map(normalizeBatch)
        .sort((first, second) => new Date(first.expiryDate) - new Date(second.expiryDate));
    }

    function readJson(key) {
      try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : [];
      } catch (error) {
        return [];
      }
    }

    function saveBatches() {
      localStorage.setItem(STORAGE_KEYS.batches, JSON.stringify(state.batches));
    }

    function normalizeBatch(item) {
      return {
        id: item.id || createId("bat"),
        medicine: String(item.medicine || "").trim(),
        generic: String(item.generic || "").trim(),
        batchNo: String(item.batchNo || "").trim(),
        qty: Number.isFinite(Number(item.qty)) ? Number(item.qty) : 0,
        expiryDate: item.expiryDate || new Date().toISOString(),
        receivedDate: item.receivedDate || new Date().toISOString(),
        supplier: String(item.supplier || "").trim(),
        status: item.status === "disposed" ? "disposed" : "active",
        disposedAt: String(item.disposedAt || ""),
        disposalReason: String(item.disposalReason || ""),
        prioritySale: Boolean(item.prioritySale)
      };
    }

    function bindEvents() {
      elements.exportReportBtn.addEventListener("click", exportReport);
      elements.openDisposalHistoryBtn.addEventListener("click", openHistoryModal);

      elements.alertSearchInput.addEventListener("input", () => {
        state.search = elements.alertSearchInput.value.trim().toLowerCase();
        closeRowMenu();
        renderAll();
      });

      elements.closeDetailsModalBtn.addEventListener("click", closeDetailsModal);
      elements.closeDetailsFooterBtn.addEventListener("click", closeDetailsModal);
      elements.detailsModal.addEventListener("click", (event) => {
        if (event.target === elements.detailsModal) {
          closeDetailsModal();
        }
      });

      elements.closeDisposeModalBtn.addEventListener("click", closeDisposeModal);
      elements.cancelDisposeModalBtn.addEventListener("click", closeDisposeModal);
      elements.disposeModal.addEventListener("click", (event) => {
        if (event.target === elements.disposeModal) {
          closeDisposeModal();
        }
      });
      elements.disposeForm.addEventListener("submit", handleDisposeSubmit);

      elements.closeHistoryModalBtn.addEventListener("click", closeHistoryModal);
      elements.closeHistoryFooterBtn.addEventListener("click", closeHistoryModal);
      elements.historyModal.addEventListener("click", (event) => {
        if (event.target === elements.historyModal) {
          closeHistoryModal();
        }
      });

      if (elements.markAllReadBtn) {
        elements.markAllReadBtn.addEventListener("click", () => {
          localStorage.setItem(STORAGE_KEYS.notificationsReadAt, new Date().toISOString());
          renderNotifications();
          showToast("success", "Notifications cleared", "All expiration notifications were marked as read.");
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
        const batchId = trigger.getAttribute("data-menu-trigger");
        const batch = findBatchById(batchId);
        if (!batch) return;

        if (state.activeMenuId === batchId) {
          closeRowMenu();
          return;
        }

        openRowMenu(trigger, batch);
        return;
      }

      if (rowAction) {
        event.stopPropagation();
        const action = rowAction.getAttribute("data-row-action");
        const batchId = rowAction.getAttribute("data-id");
        closeRowMenu();
        handleRowAction(action, batchId);
        return;
      }

      if (!insideMenu && state.activeMenuId) {
        closeRowMenu();
      }
    }

    function handleKeydown(event) {
      if (event.key !== "Escape") return;

      if (!elements.disposeModal.hidden) {
        closeDisposeModal();
        return;
      }

      if (!elements.detailsModal.hidden) {
        closeDetailsModal();
        return;
      }

      if (!elements.historyModal.hidden) {
        closeHistoryModal();
        return;
      }

      closeRowMenu();
    }

    function renderAll() {
      renderSummary();
      renderExpiredTable();
      renderNearTable();
      renderFefoScore();
      renderNotifications();
    }

    function getActiveBatches() {
      return state.batches.filter((item) => item.status === "active");
    }

    function getExpiredBatches() {
      return getActiveBatches().filter((item) => getDaysLeft(item.expiryDate) < 0 && matchesSearch(item));
    }

    function getNearExpiryBatches() {
      return getActiveBatches().filter((item) => {
        const daysLeft = getDaysLeft(item.expiryDate);
        return daysLeft >= 0 && daysLeft <= 60 && matchesSearch(item);
      });
    }

    function getSafeBatches() {
      return getActiveBatches().filter((item) => getDaysLeft(item.expiryDate) > 60);
    }

    function getDisposedBatches() {
      return state.batches
        .filter((item) => item.status === "disposed")
        .sort((first, second) => new Date(second.disposedAt) - new Date(first.disposedAt));
    }

    function matchesSearch(item) {
      if (!state.search) return true;

      const text = [
        item.medicine,
        item.generic,
        item.batchNo,
        item.supplier
      ].join(" ").toLowerCase();

      return text.includes(state.search);
    }

    function renderSummary() {
      const expired = getActiveBatches().filter((item) => getDaysLeft(item.expiryDate) < 0);
      const near = getActiveBatches().filter((item) => {
        const daysLeft = getDaysLeft(item.expiryDate);
        return daysLeft >= 0 && daysLeft <= 60;
      });
      const safe = getSafeBatches();

      elements.expiredCount.textContent = String(expired.length);
      elements.nearExpiryCount.textContent = String(near.length);
      elements.safeCount.textContent = String(safe.length);
    }

    function renderExpiredTable() {
      const rows = getExpiredBatches();

      if (!rows.length) {
        elements.expiredTableBody.innerHTML = `
          <tr>
            <td colspan="5">
              <div class="empty-state">
                <div class="empty-state__copy">
                  <h4>No expired items found</h4>
                  <p>There are no expired active batches matching your current search.</p>
                </div>
              </div>
            </td>
          </tr>
        `;
        return;
      }

      elements.expiredTableBody.innerHTML = rows.map((item) => renderExpiredRow(item)).join("");
    }

    function renderNearTable() {
      const rows = getNearExpiryBatches();

      if (!rows.length) {
        elements.nearTableBody.innerHTML = `
          <tr>
            <td colspan="5">
              <div class="empty-state">
                <div class="empty-state__copy">
                  <h4>No near-expiry items found</h4>
                  <p>No active batches are currently within the next 60 days of expiry.</p>
                </div>
              </div>
            </td>
          </tr>
        `;
        return;
      }

      elements.nearTableBody.innerHTML = rows.map((item) => renderNearRow(item)).join("");
    }

    function renderExpiredRow(item) {
      return `
        <tr>
          <td>
            <div class="batch-main">
              <span class="batch-main__icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M7 17l10-10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
                  <path d="M6.3 20.2a4.2 4.2 0 0 1 0-5.9l6-6a4.2 4.2 0 1 1 5.9 5.9l-6 6a4.2 4.2 0 0 1-5.9 0Z" stroke="currentColor" stroke-width="1.8"></path>
                </svg>
              </span>
              <div class="batch-main__copy">
                <strong>${escapeHtml(item.medicine)}</strong>
                <span>${escapeHtml(item.generic)}</span>
              </div>
            </div>
          </td>

          <td>
            <div class="batch-code">
              <strong>${escapeHtml(item.batchNo)}</strong>
              <span>${escapeHtml(item.supplier)}</span>
            </div>
          </td>

          <td>
            <span class="qty-pill">${escapeHtml(formatNumber(item.qty))} units</span>
          </td>

          <td>
            <span class="days-pill expired">${escapeHtml(String(Math.abs(getDaysLeft(item.expiryDate))))} days overdue</span>
          </td>

          <td class="actions-col">
            <div class="row-action-shell">
              <button
                type="button"
                class="action-trigger"
                data-menu-trigger="${escapeHtml(item.id)}"
                aria-label="Open expired batch actions"
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

    function renderNearRow(item) {
      return `
        <tr>
          <td>
            <div class="batch-main">
              <span class="batch-main__icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M7 17l10-10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
                  <path d="M6.3 20.2a4.2 4.2 0 0 1 0-5.9l6-6a4.2 4.2 0 1 1 5.9 5.9l-6 6a4.2 4.2 0 0 1-5.9 0Z" stroke="currentColor" stroke-width="1.8"></path>
                </svg>
              </span>
              <div class="batch-main__copy">
                <strong>${escapeHtml(item.medicine)}</strong>
                <span>${escapeHtml(item.generic)}</span>
              </div>
            </div>
          </td>

          <td>
            <div class="batch-code">
              <strong>${escapeHtml(item.batchNo)}</strong>
              <span>${escapeHtml(item.supplier)}</span>
            </div>
          </td>

          <td>
            <span class="qty-pill">${escapeHtml(formatNumber(item.qty))} units</span>
          </td>

          <td>
            <span class="days-pill near">${escapeHtml(String(getDaysLeft(item.expiryDate)))} days left</span>
          </td>

          <td class="actions-col">
            <div class="row-action-shell">
              <button
                type="button"
                class="action-trigger"
                data-menu-trigger="${escapeHtml(item.id)}"
                aria-label="Open near-expiry batch actions"
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

    function renderFefoScore() {
      const expired = getActiveBatches().filter((item) => getDaysLeft(item.expiryDate) < 0).length;
      const near = getActiveBatches().filter((item) => {
        const daysLeft = getDaysLeft(item.expiryDate);
        return daysLeft >= 0 && daysLeft <= 60;
      }).length;
      const safe = getSafeBatches().length;
      const total = expired + near + safe;

      const score = total === 0
        ? 100
        : Math.max(0, Math.min(100, Math.round(((safe * 1) + (near * 0.55)) / total * 100)));

      elements.safetyScoreText.textContent = `${score}%`;
      elements.safetyScoreBar.style.width = `${score}%`;

      if (score >= 85) {
        elements.safetyScoreNote.textContent = "Excellent inventory health";
      } else if (score >= 65) {
        elements.safetyScoreNote.textContent = "Monitor near-expiry inventory";
      } else {
        elements.safetyScoreNote.textContent = "Immediate FEFO action required";
      }
    }

    function openRowMenu(trigger, batch) {
      state.activeMenuId = batch.id;

      const rect = trigger.getBoundingClientRect();
      const menuWidth = 220;
      const menuHeight = getDaysLeft(batch.expiryDate) < 0 ? 146 : 146;

      let top = rect.bottom + 8;
      let left = rect.right - menuWidth;

      if (left < 12) left = 12;
      if (left + menuWidth > window.innerWidth - 12) {
        left = window.innerWidth - menuWidth - 12;
      }

      if (top + menuHeight > window.innerHeight - 12) {
        top = Math.max(12, rect.top - menuHeight - 8);
      }

      const isExpired = getDaysLeft(batch.expiryDate) < 0;

      elements.menuPortal.innerHTML = `
        <div class="row-menu" style="top:${top}px; left:${left}px;">
          <button type="button" data-row-action="view" data-id="${escapeHtml(batch.id)}">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" stroke="currentColor" stroke-width="1.8"></path>
              <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.8"></circle>
            </svg>
            <span>View Batch</span>
          </button>

          <button
            type="button"
            data-row-action="${isExpired ? "dispose" : "priority"}"
            data-id="${escapeHtml(batch.id)}"
            class="${isExpired ? "danger-option" : ""}"
          >
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 6v12M6 12h12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
            </svg>
            <span>${isExpired ? "Mark Disposed" : "Prioritize FEFO"}</span>
          </button>

          <button type="button" data-row-action="copy" data-id="${escapeHtml(batch.id)}">
            <svg viewBox="0 0 24 24" fill="none">
              <rect x="9" y="9" width="10" height="10" rx="2" stroke="currentColor" stroke-width="1.8"></rect>
              <path d="M6 15H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1" stroke="currentColor" stroke-width="1.8"></path>
            </svg>
            <span>Copy Batch No.</span>
          </button>
        </div>
      `;
    }

    function closeRowMenu() {
      state.activeMenuId = null;
      elements.menuPortal.innerHTML = "";
    }

    function handleRowAction(action, batchId) {
      const batch = findBatchById(batchId);
      if (!batch) return;

      if (action === "view") {
        openDetailsModal(batch);
        return;
      }

      if (action === "dispose") {
        openDisposeModal(batch);
        return;
      }

      if (action === "priority") {
        batch.prioritySale = true;
        saveBatches();
        showToast("success", "FEFO priority applied", `${batch.batchNo} was flagged for priority sale.`);
        renderAll();
        return;
      }

      if (action === "copy") {
        copyText(batch.batchNo);
      }
    }

    function openDetailsModal(batch) {
      state.detailBatchId = batch.id;

      const daysLeft = getDaysLeft(batch.expiryDate);
      const status = batch.status === "disposed"
        ? "Disposed"
        : daysLeft < 0
          ? "Expired"
          : daysLeft <= 60
            ? "Near Expiry"
            : "Safe";

      const note = batch.status === "disposed"
        ? batch.disposalReason || "Disposed batch record."
        : batch.prioritySale
          ? "Flagged for FEFO priority sale."
          : "Active batch monitoring record.";

      elements.detailsContent.innerHTML = `
        <div class="detail-item">
          <span>Medicine</span>
          <strong>${escapeHtml(batch.medicine)} • ${escapeHtml(batch.generic)}</strong>
        </div>
        <div class="detail-item">
          <span>Batch No.</span>
          <strong>${escapeHtml(batch.batchNo)}</strong>
        </div>
        <div class="detail-item">
          <span>Supplier</span>
          <strong>${escapeHtml(batch.supplier)}</strong>
        </div>
        <div class="detail-item">
          <span>Quantity</span>
          <strong>${escapeHtml(formatNumber(batch.qty))} units</strong>
        </div>
        <div class="detail-item">
          <span>Expiry Date</span>
          <strong>${escapeHtml(formatDate(batch.expiryDate))}</strong>
        </div>
        <div class="detail-item">
          <span>Status</span>
          <strong>${escapeHtml(status)}</strong>
        </div>
        <div class="detail-item">
          <span>Received Date</span>
          <strong>${escapeHtml(formatDate(batch.receivedDate))}</strong>
        </div>
        <div class="detail-item">
          <span>Monitoring Note</span>
          <strong>${escapeHtml(note)}</strong>
        </div>
      `;

      elements.detailsModal.hidden = false;
      document.body.classList.add("has-open-dialog");
    }

    function closeDetailsModal() {
      elements.detailsModal.hidden = true;
      state.detailBatchId = null;
      syncDialogBodyState();
    }

    function openDisposeModal(batch) {
      state.disposeBatchId = batch.id;
      elements.disposeBatchLabel.textContent = `${batch.batchNo} • ${batch.medicine}`;
      elements.disposeReasonInput.value = "";
      elements.disposeModal.hidden = false;
      document.body.classList.add("has-open-dialog");
    }

    function closeDisposeModal() {
      elements.disposeModal.hidden = true;
      state.disposeBatchId = null;
      syncDialogBodyState();
    }

    function handleDisposeSubmit(event) {
      event.preventDefault();

      const batch = findBatchById(state.disposeBatchId);
      const reason = elements.disposeReasonInput.value.trim();

      if (!batch) {
        showToast("error", "Batch missing", "The selected expired batch could not be found.");
        return;
      }

      if (!reason) {
        showToast("warning", "Reason required", "Enter a disposal reason before confirming.");
        return;
      }

      batch.status = "disposed";
      batch.disposedAt = new Date().toISOString();
      batch.disposalReason = reason;

      saveBatches();
      closeDisposeModal();
      renderAll();
      showToast("success", "Batch disposed", `${batch.batchNo} was moved to disposal history.`);
    }

    function openHistoryModal() {
      renderHistoryTable();
      elements.historyModal.hidden = false;
      document.body.classList.add("has-open-dialog");
    }

    function closeHistoryModal() {
      elements.historyModal.hidden = true;
      syncDialogBodyState();
    }

    function renderHistoryTable() {
      const rows = getDisposedBatches();

      if (!rows.length) {
        elements.historyTableBody.innerHTML = `
          <tr>
            <td colspan="5">
              <div class="empty-state">
                <div class="empty-state__copy">
                  <h4>No disposal history yet</h4>
                  <p>Disposed expired batches will appear here once they are logged.</p>
                </div>
              </div>
            </td>
          </tr>
        `;
        return;
      }

      elements.historyTableBody.innerHTML = rows
        .map((item) => {
          return `
            <tr>
              <td>${escapeHtml(formatDateTime(item.disposedAt))}</td>
              <td>${escapeHtml(item.medicine)} • ${escapeHtml(item.generic)}</td>
              <td>${escapeHtml(item.batchNo)}</td>
              <td>${escapeHtml(formatNumber(item.qty))} units</td>
              <td>${escapeHtml(item.disposalReason)}</td>
            </tr>
          `;
        })
        .join("");
    }

    function exportReport() {
      const expired = getExpiredBatches();
      const near = getNearExpiryBatches();
      const rows = [...expired, ...near];

      if (!rows.length) {
        showToast("warning", "Nothing to export", "There are no active alert rows to export.");
        return;
      }

      const header = [
        "Medicine",
        "Generic",
        "Batch No",
        "Quantity",
        "Expiry Date",
        "Days Left",
        "Supplier",
        "Status"
      ];

      const csvRows = rows.map((item) => {
        const daysLeft = getDaysLeft(item.expiryDate);
        const status = daysLeft < 0 ? "Expired" : "Near Expiry";

        return [
          item.medicine,
          item.generic,
          item.batchNo,
          item.qty,
          formatDate(item.expiryDate),
          daysLeft,
          item.supplier,
          status
        ].map(csvEscape).join(",");
      });

      const csvContent = [header.join(","), ...csvRows].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "spirits-os-expiration-alerts.csv";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showToast("success", "Report exported", "Expiration alert report downloaded successfully.");
    }

    function renderNotifications() {
      if (!elements.notificationList || !elements.notificationCount) return;

      const notifications = buildNotifications();
      const lastReadAt = localStorage.getItem(STORAGE_KEYS.notificationsReadAt);

      const unreadCount = notifications.filter((item) => {
        if (!lastReadAt) return true;
        return new Date(item.timestamp).getTime() > new Date(lastReadAt).getTime();
      }).length;

      elements.notificationCount.textContent = String(unreadCount);

      if (!notifications.length) {
        elements.notificationList.innerHTML = `
          <div class="notification-item">
            <div class="notification-item-dot success"></div>
            <div class="notification-item-copy">
              <strong>No active alerts</strong>
              <p>Your expiration notifications are currently clear.</p>
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
      const notifications = [];

      getActiveBatches().forEach((item) => {
        const daysLeft = getDaysLeft(item.expiryDate);

        if (daysLeft < 0) {
          notifications.push({
            tone: "error",
            title: `Expired • ${item.medicine}`,
            message: `${item.batchNo} is ${Math.abs(daysLeft)} days overdue and requires disposal.`,
            timestamp: item.expiryDate
          });
        } else if (daysLeft <= 60) {
          notifications.push({
            tone: "warning",
            title: `Near Expiry • ${item.medicine}`,
            message: `${item.batchNo} expires in ${daysLeft} days.`,
            timestamp: item.expiryDate
          });
        }
      });

      getDisposedBatches().slice(0, 3).forEach((item) => {
        notifications.push({
          tone: "success",
          title: `Disposed • ${item.medicine}`,
          message: `${item.batchNo} was logged in disposal history.`,
          timestamp: item.disposedAt
        });
      });

      return notifications
        .sort((first, second) => new Date(second.timestamp) - new Date(first.timestamp))
        .slice(0, 6);
    }

    function findBatchById(id) {
      return state.batches.find((item) => item.id === id) || null;
    }

    function syncDialogBodyState() {
      const hasVisibleDialog = document.querySelector(".dialog-backdrop:not([hidden])");
      if (!hasVisibleDialog) {
        document.body.classList.remove("has-open-dialog");
      }
    }

    function copyText(value) {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
        navigator.clipboard.writeText(value).then(() => {
          showToast("success", "Batch copied", `${value} copied to clipboard.`);
        }).catch(() => {
          showToast("info", "Batch ready", value);
        });
        return;
      }

      showToast("info", "Batch ready", value);
    }

    function getDaysLeft(dateValue) {
      const today = new Date();
      const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const target = new Date(dateValue);
      const startOfTarget = new Date(target.getFullYear(), target.getMonth(), target.getDate());
      const diff = startOfTarget.getTime() - startOfToday.getTime();
      return Math.round(diff / 86400000);
    }

    function dateWithOffset(date, offsetDays) {
      const next = new Date(date);
      next.setDate(next.getDate() + offsetDays);
      return next;
    }

    function createId(prefix) {
      return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    }

    function formatNumber(value) {
      return new Intl.NumberFormat("en-US").format(value);
    }

    function formatDate(value) {
      return new Date(value).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric"
      });
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