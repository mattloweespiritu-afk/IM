(() => {
  "use strict";

  document.addEventListener("DOMContentLoaded", initializeExpensesPage);

  function initializeExpensesPage() {
    const STORAGE_KEYS = {
      expenses: "spirits-os-expenses",
      notificationsReadAt: "spirits-os-expenses-notifications-read-at"
    };

    const state = {
      expenses: [],
      search: "",
      category: "all",
      fromDate: "",
      toDate: "",
      page: 1,
      pageSize: 6,
      activeMenuId: null,
      editExpenseId: null,
      detailExpenseId: null,
      deleteExpenseId: null
    };

    const categoryColors = {
      "Utilities": "#18b97a",
      "Rent / Lease": "#ff7a59",
      "Staff Salaries": "#3b82f6",
      "Office Supplies": "#8b5cf6",
      "Maintenance & Repair": "#f59e0b",
      "Marketing & Ads": "#ef4444",
      "Taxes & Licenses": "#06b6d4",
      "Others": "#64748b"
    };

    const elements = {
      liveClock: document.getElementById("liveClock"),
      dayName: document.getElementById("dayName"),
      todayDate: document.getElementById("todayDate"),

      totalExpenses: document.getElementById("totalExpenses"),
      monthlyExpenses: document.getElementById("monthlyExpenses"),
      monthlyTransactions: document.getElementById("monthlyTransactions"),
      categoryDonutChart: document.getElementById("categoryDonutChart"),
      categoryLegend: document.getElementById("categoryLegend"),

      exportReportBtn: document.getElementById("exportReportBtn"),
      openExpenseModalBtn: document.getElementById("openExpenseModalBtn"),

      expenseSearchInput: document.getElementById("expenseSearchInput"),
      toggleFiltersBtn: document.getElementById("toggleFiltersBtn"),
      filtersPanel: document.getElementById("filtersPanel"),
      categoryFilter: document.getElementById("categoryFilter"),
      fromDateFilter: document.getElementById("fromDateFilter"),
      toDateFilter: document.getElementById("toDateFilter"),
      resetExpenseFiltersBtn: document.getElementById("resetExpenseFiltersBtn"),

      expenseTableBody: document.getElementById("expenseTableBody"),
      expensePagination: document.getElementById("expensePagination"),
      expenseResultsMeta: document.getElementById("expenseResultsMeta"),
      menuPortal: document.getElementById("menuPortal"),

      expenseModal: document.getElementById("expenseModal"),
      expenseModalTitle: document.getElementById("expenseModalTitle"),
      expenseModalSubtitle: document.getElementById("expenseModalSubtitle"),
      closeExpenseModalBtn: document.getElementById("closeExpenseModalBtn"),
      cancelExpenseModalBtn: document.getElementById("cancelExpenseModalBtn"),
      expenseForm: document.getElementById("expenseForm"),
      expenseCategoryInput: document.getElementById("expenseCategoryInput"),
      expenseAmountInput: document.getElementById("expenseAmountInput"),
      expenseDescriptionInput: document.getElementById("expenseDescriptionInput"),
      expenseReferenceInput: document.getElementById("expenseReferenceInput"),
      expenseDateInput: document.getElementById("expenseDateInput"),
      expenseNotesInput: document.getElementById("expenseNotesInput"),
      saveExpenseBtn: document.getElementById("saveExpenseBtn"),

      expenseDetailsModal: document.getElementById("expenseDetailsModal"),
      closeExpenseDetailsBtn: document.getElementById("closeExpenseDetailsBtn"),
      closeExpenseDetailsFooterBtn: document.getElementById("closeExpenseDetailsFooterBtn"),
      expenseDetailsContent: document.getElementById("expenseDetailsContent"),

      deleteExpenseModal: document.getElementById("deleteExpenseModal"),
      closeDeleteExpenseBtn: document.getElementById("closeDeleteExpenseBtn"),
      cancelDeleteExpenseBtn: document.getElementById("cancelDeleteExpenseBtn"),
      confirmDeleteExpenseBtn: document.getElementById("confirmDeleteExpenseBtn"),
      deleteExpenseLabel: document.getElementById("deleteExpenseLabel"),
      deleteExpenseMessage: document.getElementById("deleteExpenseMessage"),

      notificationList: document.querySelector("[data-notification-list]"),
      notificationCount: document.querySelector("[data-notification-count]"),
      markAllReadBtn: document.querySelector("[data-mark-all-read]"),

      toastStack: document.getElementById("toastStack")
    };

    seedExpenses();
    loadState();
    bindEvents();
    updateClock();
    window.setInterval(updateClock, 1000);
    renderAll();
    handleInitialRoute();

    function seedExpenses() {
      if (!localStorage.getItem(STORAGE_KEYS.expenses)) {
        localStorage.setItem(STORAGE_KEYS.expenses, JSON.stringify(createSeedExpenses()));
      }
    }

    function createSeedExpenses() {
      return [
        {
          id: "exp-001",
          date: "2026-04-10",
          category: "Utilities",
          description: "Electricity Bill - March",
          amount: 2500,
          referenceNo: "EXP-240410-001",
          notes: "Official receipt #020761. Posted to overhead ledger.",
          createdAt: "2026-04-10T09:15:00"
        }
      ];
    }

    function loadState() {
      state.expenses = readJson(STORAGE_KEYS.expenses)
        .map(normalizeExpense)
        .sort((first, second) => new Date(second.date) - new Date(first.date));
    }

    function readJson(key) {
      try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : [];
      } catch (error) {
        return [];
      }
    }

    function normalizeExpense(item) {
      return {
        id: item.id || createId("exp"),
        date: String(item.date || todayIso()),
        category: String(item.category || "Others").trim(),
        description: String(item.description || "").trim(),
        amount: toNumber(item.amount),
        referenceNo: String(item.referenceNo || "").trim(),
        notes: String(item.notes || "").trim(),
        createdAt: item.createdAt || new Date().toISOString()
      };
    }

    function saveExpenses() {
      localStorage.setItem(STORAGE_KEYS.expenses, JSON.stringify(state.expenses));
    }

    function bindEvents() {
      elements.exportReportBtn.addEventListener("click", exportReport);
      elements.openExpenseModalBtn.addEventListener("click", openCreateExpenseModal);

      elements.expenseSearchInput.addEventListener("input", () => {
        state.search = elements.expenseSearchInput.value.trim().toLowerCase();
        state.page = 1;
        renderAll();
      });

      elements.toggleFiltersBtn.addEventListener("click", () => {
        const shouldOpen = elements.filtersPanel.hidden;
        elements.filtersPanel.hidden = !shouldOpen;
        elements.toggleFiltersBtn.setAttribute("aria-expanded", String(shouldOpen));
      });

      elements.categoryFilter.addEventListener("change", () => {
        state.category = elements.categoryFilter.value;
        state.page = 1;
        renderAll();
      });

      elements.fromDateFilter.addEventListener("change", () => {
        state.fromDate = elements.fromDateFilter.value;
        state.page = 1;
        renderAll();
      });

      elements.toDateFilter.addEventListener("change", () => {
        state.toDate = elements.toDateFilter.value;
        state.page = 1;
        renderAll();
      });

      elements.resetExpenseFiltersBtn.addEventListener("click", () => {
        state.category = "all";
        state.fromDate = "";
        state.toDate = "";
        elements.categoryFilter.value = "all";
        elements.fromDateFilter.value = "";
        elements.toDateFilter.value = "";
        state.page = 1;
        renderAll();
      });

      elements.closeExpenseModalBtn.addEventListener("click", closeExpenseModal);
      elements.cancelExpenseModalBtn.addEventListener("click", closeExpenseModal);
      elements.expenseModal.addEventListener("click", (event) => {
        if (event.target === elements.expenseModal) {
          closeExpenseModal();
        }
      });
      elements.expenseForm.addEventListener("submit", handleExpenseSubmit);

      elements.closeExpenseDetailsBtn.addEventListener("click", closeExpenseDetailsModal);
      elements.closeExpenseDetailsFooterBtn.addEventListener("click", closeExpenseDetailsModal);
      elements.expenseDetailsModal.addEventListener("click", (event) => {
        if (event.target === elements.expenseDetailsModal) {
          closeExpenseDetailsModal();
        }
      });

      elements.closeDeleteExpenseBtn.addEventListener("click", closeDeleteExpenseModal);
      elements.cancelDeleteExpenseBtn.addEventListener("click", closeDeleteExpenseModal);
      elements.deleteExpenseModal.addEventListener("click", (event) => {
        if (event.target === elements.deleteExpenseModal) {
          closeDeleteExpenseModal();
        }
      });
      elements.confirmDeleteExpenseBtn.addEventListener("click", handleDeleteExpense);

      if (elements.markAllReadBtn) {
        elements.markAllReadBtn.addEventListener("click", () => {
          localStorage.setItem(STORAGE_KEYS.notificationsReadAt, new Date().toISOString());
          renderNotifications();
          showToast("success", "Notifications cleared", "All expense notifications were marked as read.");
        });
      }

      document.addEventListener("click", handleDocumentClick);
      document.addEventListener("keydown", handleKeydown);
      window.addEventListener("resize", closeRowMenu);
      window.addEventListener("scroll", closeRowMenu, true);
    }

    function handleInitialRoute() {
      const params = new URLSearchParams(window.location.search);

      if (params.get("open") === "create") {
        openCreateExpenseModal();
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
      const rowAction = event.target.closest("[data-row-action]");
      const insideMenu = event.target.closest(".row-menu");
      const insideFilters = event.target.closest("#filtersPanel");
      const filterButton = event.target.closest("#toggleFiltersBtn");

      if (trigger) {
        event.stopPropagation();
        const expenseId = trigger.getAttribute("data-menu-trigger");
        const expense = findExpenseById(expenseId);
        if (!expense) return;

        if (state.activeMenuId === expenseId) {
          closeRowMenu();
          return;
        }

        openRowMenu(trigger, expense);
        return;
      }

      if (rowAction) {
        event.stopPropagation();
        const expenseId = rowAction.getAttribute("data-id");
        const action = rowAction.getAttribute("data-row-action");
        closeRowMenu();
        handleRowAction(action, expenseId);
        return;
      }

      if (!insideMenu && state.activeMenuId) {
        closeRowMenu();
      }

      if (!insideFilters && !filterButton && !elements.filtersPanel.hidden) {
        elements.filtersPanel.hidden = true;
        elements.toggleFiltersBtn.setAttribute("aria-expanded", "false");
      }
    }

    function handleKeydown(event) {
      if (event.key !== "Escape") return;

      if (!elements.expenseModal.hidden) {
        closeExpenseModal();
        return;
      }

      if (!elements.expenseDetailsModal.hidden) {
        closeExpenseDetailsModal();
        return;
      }

      if (!elements.deleteExpenseModal.hidden) {
        closeDeleteExpenseModal();
        return;
      }

      if (!elements.filtersPanel.hidden) {
        elements.filtersPanel.hidden = true;
        elements.toggleFiltersBtn.setAttribute("aria-expanded", "false");
      }

      closeRowMenu();
    }

    function renderAll() {
      renderStats();
      renderCategoryChart();
      renderTable();
      renderNotifications();
    }

    function renderStats() {
      const total = state.expenses.reduce((sum, item) => sum + item.amount, 0);
      const monthlyRecords = getCurrentMonthExpenses();
      const monthlyTotal = monthlyRecords.reduce((sum, item) => sum + item.amount, 0);

      elements.totalExpenses.textContent = formatCurrency(total);
      elements.monthlyExpenses.textContent = formatCurrency(monthlyTotal);
      elements.monthlyTransactions.textContent = `${monthlyRecords.length} transaction${monthlyRecords.length !== 1 ? "s" : ""} in ${currentMonthName()}`;
    }

    function renderCategoryChart() {
      if (!elements.categoryDonutChart || !elements.categoryLegend) return;

      if (!state.expenses.length) {
        elements.categoryDonutChart.style.background = "conic-gradient(#e8efed 0 360deg)";
        elements.categoryLegend.innerHTML = `
          <div class="donut-legend__row">
            <span class="donut-legend__label">
              <span class="donut-legend__swatch" style="background:#e8efed;"></span>
              No expense records
            </span>
            <strong>0%</strong>
          </div>
        `;
        return;
      }

      const totalsByCategory = {};
      state.expenses.forEach((expense) => {
        totalsByCategory[expense.category] = (totalsByCategory[expense.category] || 0) + expense.amount;
      });

      const total = Object.values(totalsByCategory).reduce((sum, value) => sum + value, 0);
      let start = 0;

      const segments = Object.entries(totalsByCategory).map(([category, amount]) => {
        const percentage = total ? (amount / total) * 100 : 0;
        const end = start + (percentage / 100) * 360;
        const color = categoryColors[category] || categoryColors.Others;
        const segment = `${color} ${start}deg ${end}deg`;
        start = end;
        return {
          category,
          amount,
          percentage,
          segment,
          color
        };
      });

      elements.categoryDonutChart.style.background = `conic-gradient(${segments.map((item) => item.segment).join(", ")})`;
      elements.categoryLegend.innerHTML = segments
        .sort((a, b) => b.amount - a.amount)
        .map((item) => {
          return `
            <div class="donut-legend__row">
              <span class="donut-legend__label">
                <span class="donut-legend__swatch" style="background:${escapeHtml(item.color)};"></span>
                ${escapeHtml(item.category)}
              </span>
              <strong>${escapeHtml(formatPercent(item.percentage))}</strong>
            </div>
          `;
        })
        .join("");
    }

    function getFilteredExpenses() {
      return state.expenses.filter((expense) => {
        const searchText = [
          expense.description,
          expense.category,
          expense.referenceNo,
          expense.notes
        ].join(" ").toLowerCase();

        const matchesSearch = !state.search || searchText.includes(state.search);
        const matchesCategory = state.category === "all" || expense.category === state.category;
        const matchesFrom = !state.fromDate || new Date(`${expense.date}T00:00:00`) >= new Date(`${state.fromDate}T00:00:00`);
        const matchesTo = !state.toDate || new Date(`${expense.date}T00:00:00`) <= new Date(`${state.toDate}T23:59:59`);

        return matchesSearch && matchesCategory && matchesFrom && matchesTo;
      });
    }

    function renderTable() {
      const filtered = getFilteredExpenses();
      const totalPages = Math.max(1, Math.ceil(filtered.length / state.pageSize));
      state.page = Math.min(state.page, totalPages);

      const start = (state.page - 1) * state.pageSize;
      const pageItems = filtered.slice(start, start + state.pageSize);

      if (!pageItems.length) {
        elements.expenseTableBody.innerHTML = `
          <tr>
            <td colspan="5">
              <div class="expense-empty">
                <div class="expense-empty__card">
                  <div class="expense-empty__icon">
                    <svg viewBox="0 0 24 24" fill="none">
                      <rect x="5" y="4" width="14" height="16" rx="2" stroke="currentColor" stroke-width="1.8"></rect>
                      <path d="M8 8h8M8 12h6M8 16h5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
                    </svg>
                  </div>
                  <h3>No expense records found</h3>
                  <p>Try adjusting your search or filter selections.</p>
                </div>
              </div>
            </td>
          </tr>
        `;
      } else {
        elements.expenseTableBody.innerHTML = pageItems.map(renderExpenseRow).join("");
      }

      renderPagination(filtered.length, totalPages, pageItems.length, start);
    }

    function renderExpenseRow(expense) {
      const categoryColor = categoryColors[expense.category] || categoryColors.Others;

      return `
        <tr>
          <td>
            <div class="date-cell">
              <strong>${escapeHtml(formatDate(expense.date))}</strong>
              <span>REF: ${escapeHtml(expense.referenceNo)}</span>
            </div>
          </td>

          <td>
            <span class="category-badge" style="color:${escapeHtml(categoryColor)};">
              ${escapeHtml(expense.category)}
            </span>
          </td>

          <td>
            <div class="description-cell">
              <strong>${escapeHtml(expense.description)}</strong>
              <span>${escapeHtml(expense.notes || "No receipt note provided.")}</span>
            </div>
          </td>

          <td>
            <span class="amount-pill">${escapeHtml(formatCurrency(expense.amount))}</span>
          </td>

          <td class="actions-col">
            <div class="row-action-shell">
              <button
                type="button"
                class="action-trigger"
                data-menu-trigger="${escapeHtml(expense.id)}"
                aria-label="Open expense actions"
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
      elements.expensePagination.innerHTML = "";

      const end = totalItems ? startIndex + pageItemsLength : 0;
      const from = totalItems ? startIndex + 1 : 0;
      elements.expenseResultsMeta.textContent = `Showing ${from} to ${end} of ${totalItems} record${totalItems !== 1 ? "s" : ""}`;

      if (!totalItems || totalPages <= 1) return;

      const prevButton = createPaginationButton("‹", state.page === 1, () => {
        if (state.page > 1) {
          state.page -= 1;
          closeRowMenu();
          renderTable();
        }
      });

      elements.expensePagination.appendChild(prevButton);

      for (let page = 1; page <= totalPages; page += 1) {
        const button = createPaginationButton(String(page), false, () => {
          state.page = page;
          closeRowMenu();
          renderTable();
        });

        if (page === state.page) {
          button.classList.add("active");
        }

        elements.expensePagination.appendChild(button);
      }

      const nextButton = createPaginationButton("›", state.page === totalPages, () => {
        if (state.page < totalPages) {
          state.page += 1;
          closeRowMenu();
          renderTable();
        }
      });

      elements.expensePagination.appendChild(nextButton);
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

    function openRowMenu(trigger, expense) {
      state.activeMenuId = expense.id;

      const rect = trigger.getBoundingClientRect();
      const menuWidth = 210;
      const menuHeight = 150;

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
        <div class="row-menu" style="top:${top}px; left:${left}px;">
          <button type="button" data-row-action="view" data-id="${escapeHtml(expense.id)}">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" stroke="currentColor" stroke-width="1.8"></path>
              <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.8"></circle>
            </svg>
            <span>View Receipt</span>
          </button>

          <button type="button" data-row-action="edit" data-id="${escapeHtml(expense.id)}">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M4 20h4l10-10-4-4L4 16v4Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"></path>
              <path d="M12 6l4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
            </svg>
            <span>Edit Record</span>
          </button>

          <button type="button" class="danger-option" data-row-action="delete" data-id="${escapeHtml(expense.id)}">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M8 7h8M10 11v5M14 11v5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
              <path d="M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
              <path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" stroke="currentColor" stroke-width="1.8"></path>
            </svg>
            <span>Delete Record</span>
          </button>
        </div>
      `;
    }

    function closeRowMenu() {
      state.activeMenuId = null;
      elements.menuPortal.innerHTML = "";
    }

    function handleRowAction(action, expenseId) {
      const expense = findExpenseById(expenseId);
      if (!expense) return;

      if (action === "view") {
        openExpenseDetailsModal(expense);
        return;
      }

      if (action === "edit") {
        openEditExpenseModal(expense);
        return;
      }

      if (action === "delete") {
        openDeleteExpenseModal(expense);
      }
    }

    function openCreateExpenseModal() {
      state.editExpenseId = null;
      elements.expenseModalTitle.textContent = "Record Expense";
      elements.expenseModalSubtitle.textContent = "Log operational costs for financial tracking.";
      elements.saveExpenseBtn.textContent = "Save Expense";
      elements.expenseForm.reset();
      elements.expenseDateInput.value = todayIso();
      elements.expenseReferenceInput.value = generateExpenseReference();
      elements.expenseModal.hidden = false;
      document.body.classList.add("has-open-dialog");
    }

    function openEditExpenseModal(expense) {
      state.editExpenseId = expense.id;
      elements.expenseModalTitle.textContent = "Edit Expense";
      elements.expenseModalSubtitle.textContent = "Update operational cost details for this record.";
      elements.saveExpenseBtn.textContent = "Update Expense";
      elements.expenseCategoryInput.value = expense.category;
      elements.expenseAmountInput.value = String(expense.amount);
      elements.expenseDescriptionInput.value = expense.description;
      elements.expenseReferenceInput.value = expense.referenceNo;
      elements.expenseDateInput.value = expense.date;
      elements.expenseNotesInput.value = expense.notes;
      elements.expenseModal.hidden = false;
      document.body.classList.add("has-open-dialog");
    }

    function closeExpenseModal() {
      elements.expenseModal.hidden = true;
      state.editExpenseId = null;
      syncDialogBodyState();
    }

    function handleExpenseSubmit(event) {
      event.preventDefault();

      const payload = {
        category: elements.expenseCategoryInput.value.trim(),
        amount: toNumber(elements.expenseAmountInput.value),
        description: elements.expenseDescriptionInput.value.trim(),
        referenceNo: elements.expenseReferenceInput.value.trim().toUpperCase(),
        date: elements.expenseDateInput.value,
        notes: elements.expenseNotesInput.value.trim()
      };

      if (!payload.category || payload.amount <= 0 || !payload.description || !payload.referenceNo || !payload.date) {
        showToast("warning", "Missing details", "Complete all required expense fields before saving.");
        return;
      }

      const duplicateReference = state.expenses.find((expense) => {
        if (state.editExpenseId && expense.id === state.editExpenseId) return false;
        return expense.referenceNo.toLowerCase() === payload.referenceNo.toLowerCase();
      });

      if (duplicateReference) {
        showToast("error", "Reference already exists", "Use a unique reference number for this expense.");
        return;
      }

      if (state.editExpenseId) {
        const existing = findExpenseById(state.editExpenseId);
        if (!existing) {
          showToast("error", "Expense missing", "The selected expense could not be found.");
          return;
        }

        existing.category = payload.category;
        existing.amount = payload.amount;
        existing.description = payload.description;
        existing.referenceNo = payload.referenceNo;
        existing.date = payload.date;
        existing.notes = payload.notes;

        sortAndPersist();
        closeExpenseModal();
        renderAll();
        showToast("success", "Expense updated", `${existing.referenceNo} has been updated.`);
        return;
      }

      const expense = {
        id: createId("exp"),
        category: payload.category,
        amount: payload.amount,
        description: payload.description,
        referenceNo: payload.referenceNo,
        date: payload.date,
        notes: payload.notes,
        createdAt: new Date().toISOString()
      };

      state.expenses.unshift(expense);
      sortAndPersist();
      closeExpenseModal();
      state.page = 1;
      renderAll();
      showToast("success", "Expense saved", `${expense.referenceNo} was added to the ledger.`);
    }

    function openExpenseDetailsModal(expense) {
      state.detailExpenseId = expense.id;

      elements.expenseDetailsContent.innerHTML = `
        <div class="detail-item">
          <span>Reference No.</span>
          <strong>${escapeHtml(expense.referenceNo)}</strong>
        </div>
        <div class="detail-item">
          <span>Date</span>
          <strong>${escapeHtml(formatDate(expense.date))}</strong>
        </div>
        <div class="detail-item">
          <span>Category</span>
          <strong>${escapeHtml(expense.category)}</strong>
        </div>
        <div class="detail-item">
          <span>Amount</span>
          <strong>${escapeHtml(formatCurrency(expense.amount))}</strong>
        </div>
        <div class="detail-item">
          <span>Description</span>
          <strong>${escapeHtml(expense.description)}</strong>
        </div>
        <div class="detail-item">
          <span>Receipt / Notes</span>
          <strong>${escapeHtml(expense.notes || "No receipt note provided.")}</strong>
        </div>
      `;

      elements.expenseDetailsModal.hidden = false;
      document.body.classList.add("has-open-dialog");
    }

    function closeExpenseDetailsModal() {
      elements.expenseDetailsModal.hidden = true;
      state.detailExpenseId = null;
      syncDialogBodyState();
    }

    function openDeleteExpenseModal(expense) {
      state.deleteExpenseId = expense.id;
      elements.deleteExpenseLabel.textContent = `${expense.referenceNo} • ${expense.description}`;
      elements.deleteExpenseMessage.textContent = `This will remove ${expense.referenceNo} from the expense ledger.`;
      elements.deleteExpenseModal.hidden = false;
      document.body.classList.add("has-open-dialog");
    }

    function closeDeleteExpenseModal() {
      elements.deleteExpenseModal.hidden = true;
      state.deleteExpenseId = null;
      syncDialogBodyState();
    }

    function handleDeleteExpense() {
      const expense = findExpenseById(state.deleteExpenseId);
      if (!expense) {
        showToast("error", "Expense missing", "The selected expense could not be found.");
        return;
      }

      state.expenses = state.expenses.filter((item) => item.id !== expense.id);
      saveExpenses();
      closeDeleteExpenseModal();
      state.page = 1;
      renderAll();
      showToast("success", "Expense deleted", `${expense.referenceNo} was removed from the ledger.`);
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
              <strong>No recent expense alerts</strong>
              <p>Your expense notifications are clear right now.</p>
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
              <span>${escapeHtml(formatDate(item.timestamp))}</span>
            </div>
          </div>
        `;
      }).join("");
    }

    function buildNotifications() {
      return state.expenses.slice(0, 5).map((expense) => ({
        tone: "warning",
        title: `Expense Logged • ${expense.category}`,
        message: `${formatCurrency(expense.amount)} recorded under ${expense.referenceNo}.`,
        timestamp: expense.date
      }));
    }

    function exportReport() {
      const rows = getFilteredExpenses();

      if (!rows.length) {
        showToast("warning", "Nothing to export", "There are no visible expense records to export.");
        return;
      }

      const header = [
        "Date",
        "Reference No",
        "Category",
        "Description",
        "Amount",
        "Notes"
      ];

      const csvRows = rows.map((expense) => {
        return [
          formatDate(expense.date),
          expense.referenceNo,
          expense.category,
          expense.description,
          expense.amount,
          expense.notes
        ].map(csvEscape).join(",");
      });

      const csvContent = [header.join(","), ...csvRows].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "spirits-os-expense-report.csv";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showToast("success", "Report exported", "Expense report downloaded successfully.");
    }

    function findExpenseById(id) {
      return state.expenses.find((expense) => expense.id === id) || null;
    }

    function getCurrentMonthExpenses() {
      const now = new Date();
      return state.expenses.filter((expense) => {
        const date = new Date(`${expense.date}T00:00:00`);
        return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
      });
    }

    function sortAndPersist() {
      state.expenses.sort((first, second) => new Date(second.date) - new Date(first.date));
      saveExpenses();
    }

    function syncDialogBodyState() {
      const hasVisibleDialog = document.querySelector(".dialog-backdrop:not([hidden])");
      if (!hasVisibleDialog) {
        document.body.classList.remove("has-open-dialog");
      }
    }

    function createId(prefix) {
      return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    }

    function generateExpenseReference() {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      const serial = String(Math.floor(Math.random() * 900) + 100);
      return `EXP-${year}${month}${day}-${serial}`;
    }

    function todayIso() {
      const now = new Date();
      return [
        now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, "0"),
        String(now.getDate()).padStart(2, "0")
      ].join("-");
    }

    function currentMonthName() {
      return new Date().toLocaleDateString("en-US", { month: "long" });
    }

    function toNumber(value) {
      const number = Number(value);
      return Number.isFinite(number) ? number : 0;
    }

    function formatNumber(value) {
      return new Intl.NumberFormat("en-US").format(value);
    }

    function formatCurrency(value) {
      return new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
        minimumFractionDigits: 2
      }).format(value);
    }

    function formatPercent(value) {
      return `${Math.round(value)}%`;
    }

    function formatDate(value) {
      return new Date(value).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric"
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
