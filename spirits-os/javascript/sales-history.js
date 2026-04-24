(() => {
  "use strict";

  document.addEventListener("DOMContentLoaded", initializeSalesHistoryPage);

  function initializeSalesHistoryPage() {
    const STORAGE_KEYS = {
      sales: "spirits-os-sales-history",
      notificationsReadAt: "spirits-os-sales-history-notifications-read-at"
    };

    const state = {
      sales: [],
      search: "",
      fromDate: "",
      toDate: "",
      page: 1,
      pageSize: 6,
      activeMenuId: null,
      activeSaleId: null
    };

    const elements = {
      liveClock: document.getElementById("liveClock"),
      dayName: document.getElementById("dayName"),
      todayDate: document.getElementById("todayDate"),

      revenueToday: document.getElementById("revenueToday"),
      averageOrderValue: document.getElementById("averageOrderValue"),
      totalTransactions: document.getElementById("totalTransactions"),

      exportCsvBtn: document.getElementById("exportCsvBtn"),
      openDailyReportBtn: document.getElementById("openDailyReportBtn"),

      salesSearchInput: document.getElementById("salesSearchInput"),
      toggleDateRangeBtn: document.getElementById("toggleDateRangeBtn"),
      dateRangePanel: document.getElementById("dateRangePanel"),
      fromDateInput: document.getElementById("fromDateInput"),
      toDateInput: document.getElementById("toDateInput"),
      clearDateRangeBtn: document.getElementById("clearDateRangeBtn"),

      salesTableBody: document.getElementById("salesTableBody"),
      salesPagination: document.getElementById("salesPagination"),
      salesResultsMeta: document.getElementById("salesResultsMeta"),
      menuPortal: document.getElementById("menuPortal"),

      saleDetailsModal: document.getElementById("saleDetailsModal"),
      closeSaleDetailsBtn: document.getElementById("closeSaleDetailsBtn"),
      closeSaleDetailsFooterBtn: document.getElementById("closeSaleDetailsFooterBtn"),
      saleDetailsSummary: document.getElementById("saleDetailsSummary"),
      saleDetailsItems: document.getElementById("saleDetailsItems"),

      dailyReportModal: document.getElementById("dailyReportModal"),
      closeDailyReportBtn: document.getElementById("closeDailyReportBtn"),
      closeDailyReportFooterBtn: document.getElementById("closeDailyReportFooterBtn"),
      dailyReportSummary: document.getElementById("dailyReportSummary"),

      notificationList: document.querySelector("[data-notification-list]"),
      notificationCount: document.querySelector("[data-notification-count]"),
      markAllReadBtn: document.querySelector("[data-mark-all-read]"),

      toastStack: document.getElementById("toastStack")
    };

    seedSales();
    loadState();
    bindEvents();
    updateClock();
    window.setInterval(updateClock, 1000);
    renderAll();

    function seedSales() {
      if (!localStorage.getItem(STORAGE_KEYS.sales)) {
        localStorage.setItem(STORAGE_KEYS.sales, JSON.stringify(createSeedSales()));
      }
    }

    function createSeedSales() {
      return [
        {
          id: "sale-001",
          transactionNo: "SALE-240415-001",
          cashier: "System Administrator",
          cashierInitial: "S",
          customer: "Walk-in Customer",
          paymentMethod: "Cash",
          subtotal: 25,
          discount: 0,
          total: 25,
          createdAt: "2026-04-15T08:17:00",
          items: [
            {
              medicine: "Biogesic",
              quantity: 5,
              unitPrice: 5,
              lineTotal: 25
            }
          ]
        },
        {
          id: "sale-002",
          transactionNo: "SALE-240415-002",
          cashier: "System Administrator",
          cashierInitial: "S",
          customer: "Walk-in Customer",
          paymentMethod: "Cash",
          subtotal: 54,
          discount: 4,
          total: 50,
          createdAt: "2026-04-15T09:42:00",
          items: [
            {
              medicine: "Amoxil",
              quantity: 2,
              unitPrice: 18,
              lineTotal: 36
            },
            {
              medicine: "Medicol",
              quantity: 2,
              unitPrice: 9,
              lineTotal: 18
            }
          ]
        },
        {
          id: "sale-003",
          transactionNo: "SALE-240415-003",
          cashier: "System Administrator",
          cashierInitial: "S",
          customer: "Walk-in Customer",
          paymentMethod: "GCash",
          subtotal: 82,
          discount: 7,
          total: 75,
          createdAt: "2026-04-15T11:06:00",
          items: [
            {
              medicine: "Ceelin",
              quantity: 5,
              unitPrice: 12,
              lineTotal: 60
            },
            {
              medicine: "Kremil-S",
              quantity: 2,
              unitPrice: 11,
              lineTotal: 22
            }
          ]
        },
        {
          id: "sale-004",
          transactionNo: "SALE-240414-004",
          cashier: "System Administrator",
          cashierInitial: "S",
          customer: "Walk-in Customer",
          paymentMethod: "Cash",
          subtotal: 145,
          discount: 0,
          total: 145,
          createdAt: "2026-04-14T14:38:00",
          items: [
            {
              medicine: "Ascof",
              quantity: 1,
              unitPrice: 145,
              lineTotal: 145
            }
          ]
        },
        {
          id: "sale-005",
          transactionNo: "SALE-240414-005",
          cashier: "System Administrator",
          cashierInitial: "S",
          customer: "Walk-in Customer",
          paymentMethod: "Cash",
          subtotal: 45,
          discount: 0,
          total: 45,
          createdAt: "2026-04-14T16:22:00",
          items: [
            {
              medicine: "Biogesic",
              quantity: 9,
              unitPrice: 5,
              lineTotal: 45
            }
          ]
        }
      ];
    }

    function loadState() {
      state.sales = readJson(STORAGE_KEYS.sales)
        .map(normalizeSale)
        .sort((first, second) => new Date(second.createdAt) - new Date(first.createdAt));
    }

    function readJson(key) {
      try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : [];
      } catch (error) {
        return [];
      }
    }

    function normalizeSale(item) {
      return {
        id: item.id || createId("sale"),
        transactionNo: String(item.transactionNo || "").trim(),
        cashier: String(item.cashier || "Cashier").trim(),
        cashierInitial: String(item.cashierInitial || "C").trim().slice(0, 1).toUpperCase(),
        customer: String(item.customer || "Walk-in Customer").trim(),
        paymentMethod: String(item.paymentMethod || "Cash").trim(),
        subtotal: toNumber(item.subtotal),
        discount: toNumber(item.discount),
        total: toNumber(item.total),
        createdAt: item.createdAt || new Date().toISOString(),
        items: Array.isArray(item.items)
          ? item.items.map((saleItem) => ({
              medicine: String(saleItem.medicine || "").trim(),
              quantity: toNumber(saleItem.quantity),
              unitPrice: toNumber(saleItem.unitPrice),
              lineTotal: toNumber(saleItem.lineTotal)
            }))
          : []
      };
    }

    function bindEvents() {
      elements.exportCsvBtn.addEventListener("click", exportCsv);
      elements.openDailyReportBtn.addEventListener("click", openDailyReport);

      elements.salesSearchInput.addEventListener("input", () => {
        state.search = elements.salesSearchInput.value.trim().toLowerCase();
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

      elements.closeSaleDetailsBtn.addEventListener("click", closeSaleDetails);
      elements.closeSaleDetailsFooterBtn.addEventListener("click", closeSaleDetails);
      elements.saleDetailsModal.addEventListener("click", (event) => {
        if (event.target === elements.saleDetailsModal) {
          closeSaleDetails();
        }
      });

      elements.closeDailyReportBtn.addEventListener("click", closeDailyReport);
      elements.closeDailyReportFooterBtn.addEventListener("click", closeDailyReport);
      elements.dailyReportModal.addEventListener("click", (event) => {
        if (event.target === elements.dailyReportModal) {
          closeDailyReport();
        }
      });

      if (elements.markAllReadBtn) {
        elements.markAllReadBtn.addEventListener("click", () => {
          localStorage.setItem(STORAGE_KEYS.notificationsReadAt, new Date().toISOString());
          renderNotifications();
          showToast("success", "Notifications cleared", "All sales notifications were marked as read.");
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
        const saleId = trigger.getAttribute("data-menu-trigger");
        const sale = findSaleById(saleId);
        if (!sale) return;

        if (state.activeMenuId === saleId) {
          closeRowMenu();
          return;
        }

        openRowMenu(trigger, sale);
        return;
      }

      if (rowAction) {
        event.stopPropagation();
        const saleId = rowAction.getAttribute("data-id");
        const action = rowAction.getAttribute("data-row-action");
        closeRowMenu();
        handleRowAction(action, saleId);
        return;
      }

      if (!insideMenu && state.activeMenuId) {
        closeRowMenu();
      }
    }

    function handleKeydown(event) {
      if (event.key !== "Escape") return;

      if (!elements.saleDetailsModal.hidden) {
        closeSaleDetails();
        return;
      }

      if (!elements.dailyReportModal.hidden) {
        closeDailyReport();
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
      const todaySales = getTodaySales();
      const revenueToday = todaySales.reduce((sum, sale) => sum + sale.total, 0);
      const averageOrderValue = state.sales.length
        ? state.sales.reduce((sum, sale) => sum + sale.total, 0) / state.sales.length
        : 0;

      elements.revenueToday.textContent = formatCurrency(revenueToday);
      elements.averageOrderValue.textContent = formatCurrency(averageOrderValue);
      elements.totalTransactions.textContent = formatNumber(state.sales.length);
    }

    function getFilteredSales() {
      return state.sales.filter((sale) => {
        const searchText = [
          sale.transactionNo,
          sale.cashier,
          sale.customer,
          sale.paymentMethod,
          ...sale.items.map((item) => item.medicine)
        ].join(" ").toLowerCase();

        const matchesSearch = !state.search || searchText.includes(state.search);
        const matchesFrom = !state.fromDate || new Date(sale.createdAt) >= new Date(`${state.fromDate}T00:00:00`);
        const matchesTo = !state.toDate || new Date(sale.createdAt) <= new Date(`${state.toDate}T23:59:59`);

        return matchesSearch && matchesFrom && matchesTo;
      });
    }

    function renderTable() {
      const filtered = getFilteredSales();
      const totalPages = Math.max(1, Math.ceil(filtered.length / state.pageSize));
      state.page = Math.min(state.page, totalPages);

      const start = (state.page - 1) * state.pageSize;
      const pageItems = filtered.slice(start, start + state.pageSize);

      if (!pageItems.length) {
        elements.salesTableBody.innerHTML = `
          <tr>
            <td colspan="5">
              <div class="sales-empty">
                <div class="sales-empty__card">
                  <div class="sales-empty__icon">
                    <svg viewBox="0 0 24 24" fill="none">
                      <rect x="5" y="4" width="14" height="16" rx="2" stroke="currentColor" stroke-width="1.8"></rect>
                      <path d="M8 8h8M8 12h6M8 16h5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
                    </svg>
                  </div>
                  <h3>No sales records found</h3>
                  <p>Try adjusting your search or selected date range.</p>
                </div>
              </div>
            </td>
          </tr>
        `;
      } else {
        elements.salesTableBody.innerHTML = pageItems.map(renderRow).join("");
      }

      renderPagination(filtered.length, totalPages, pageItems.length, start);
    }

    function renderRow(sale) {
      return `
        <tr>
          <td>
            <div class="transaction-cell">
              <span class="transaction-icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <rect x="5" y="4" width="14" height="16" rx="2" stroke="currentColor" stroke-width="1.7"></rect>
                  <path d="M8 8h8M8 12h6M8 16h5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"></path>
                </svg>
              </span>
              <div class="transaction-copy">
                <strong>${escapeHtml(sale.transactionNo)}</strong>
                <span>${escapeHtml(`${sale.items.length} item${sale.items.length > 1 ? "s" : ""}`)}</span>
              </div>
            </div>
          </td>

          <td>
            <div class="datetime-cell">
              <strong>${escapeHtml(formatDate(sale.createdAt))}</strong>
              <span>${escapeHtml(formatTime(sale.createdAt))}</span>
            </div>
          </td>

          <td>
            <div class="cashier-inline">
              <span class="cashier-badge">${escapeHtml(sale.cashierInitial)}</span>
              <div class="cashier-cell">
                <strong>${escapeHtml(sale.cashier)}</strong>
                <span>${escapeHtml(sale.paymentMethod)}</span>
              </div>
            </div>
          </td>

          <td>
            <span class="amount-pill">${escapeHtml(formatCurrency(sale.total))}</span>
          </td>

          <td class="actions-col">
            <div class="row-action-shell">
              <button
                type="button"
                class="action-trigger"
                data-menu-trigger="${escapeHtml(sale.id)}"
                aria-label="Open sale actions"
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
      elements.salesPagination.innerHTML = "";

      const end = totalItems ? startIndex + pageItemsLength : 0;
      const from = totalItems ? startIndex + 1 : 0;
      elements.salesResultsMeta.textContent = `Showing ${from} to ${end} of ${totalItems} transactions`;

      if (!totalItems || totalPages <= 1) return;

      const prevButton = createPaginationButton("‹", state.page === 1, () => {
        if (state.page > 1) {
          state.page -= 1;
          closeRowMenu();
          renderTable();
        }
      });

      elements.salesPagination.appendChild(prevButton);

      for (let page = 1; page <= totalPages; page += 1) {
        const button = createPaginationButton(String(page), false, () => {
          state.page = page;
          closeRowMenu();
          renderTable();
        });

        if (page === state.page) {
          button.classList.add("active");
        }

        elements.salesPagination.appendChild(button);
      }

      const nextButton = createPaginationButton("›", state.page === totalPages, () => {
        if (state.page < totalPages) {
          state.page += 1;
          closeRowMenu();
          renderTable();
        }
      });

      elements.salesPagination.appendChild(nextButton);
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

    function openRowMenu(trigger, sale) {
      state.activeMenuId = sale.id;

      const rect = trigger.getBoundingClientRect();
      const menuWidth = 212;
      const menuHeight = 96;

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
          <button type="button" data-row-action="view" data-id="${escapeHtml(sale.id)}">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" stroke="currentColor" stroke-width="1.8"></path>
              <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.8"></circle>
            </svg>
            <span>View Details</span>
          </button>

          <button type="button" data-row-action="copy" data-id="${escapeHtml(sale.id)}">
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

    function handleRowAction(action, saleId) {
      const sale = findSaleById(saleId);
      if (!sale) return;

      if (action === "view") {
        openSaleDetails(sale);
        return;
      }

      if (action === "copy") {
        copyText(sale.transactionNo);
      }
    }

    function openSaleDetails(sale) {
      state.activeSaleId = sale.id;

      elements.saleDetailsSummary.innerHTML = `
        <div class="detail-item">
          <span>Transaction #</span>
          <strong>${escapeHtml(sale.transactionNo)}</strong>
        </div>
        <div class="detail-item">
          <span>Cashier</span>
          <strong>${escapeHtml(sale.cashier)}</strong>
        </div>
        <div class="detail-item">
          <span>Date</span>
          <strong>${escapeHtml(formatDate(sale.createdAt))} ${escapeHtml(formatTime(sale.createdAt))}</strong>
        </div>
        <div class="detail-item">
          <span>Payment Method</span>
          <strong>${escapeHtml(sale.paymentMethod)}</strong>
        </div>
        <div class="detail-item">
          <span>Customer</span>
          <strong>${escapeHtml(sale.customer)}</strong>
        </div>
        <div class="detail-item">
          <span>Total</span>
          <strong>${escapeHtml(formatCurrency(sale.total))}</strong>
        </div>
      `;

      elements.saleDetailsItems.innerHTML = sale.items.map((item) => {
        return `
          <tr>
            <td>${escapeHtml(item.medicine)}</td>
            <td>${escapeHtml(formatNumber(item.quantity))}</td>
            <td>${escapeHtml(formatCurrency(item.unitPrice))}</td>
            <td>${escapeHtml(formatCurrency(item.lineTotal))}</td>
          </tr>
        `;
      }).join("");

      elements.saleDetailsModal.hidden = false;
      document.body.classList.add("has-open-dialog");
    }

    function closeSaleDetails() {
      elements.saleDetailsModal.hidden = true;
      state.activeSaleId = null;
      syncDialogBodyState();
    }

    function openDailyReport() {
      const todaySales = getTodaySales();
      const totalRevenue = todaySales.reduce((sum, sale) => sum + sale.total, 0);
      const totalDiscount = todaySales.reduce((sum, sale) => sum + sale.discount, 0);
      const average = todaySales.length ? totalRevenue / todaySales.length : 0;
      const totalItems = todaySales.reduce((sum, sale) => {
        return sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0);
      }, 0);

      elements.dailyReportSummary.innerHTML = `
        <div class="detail-item">
          <span>Transactions Today</span>
          <strong>${escapeHtml(formatNumber(todaySales.length))}</strong>
        </div>
        <div class="detail-item">
          <span>Revenue Today</span>
          <strong>${escapeHtml(formatCurrency(totalRevenue))}</strong>
        </div>
        <div class="detail-item">
          <span>Total Discount</span>
          <strong>${escapeHtml(formatCurrency(totalDiscount))}</strong>
        </div>
        <div class="detail-item">
          <span>Average Ticket</span>
          <strong>${escapeHtml(formatCurrency(average))}</strong>
        </div>
        <div class="detail-item">
          <span>Units Sold</span>
          <strong>${escapeHtml(formatNumber(totalItems))}</strong>
        </div>
        <div class="detail-item">
          <span>Top Cashier</span>
          <strong>${escapeHtml(getTopCashier(todaySales))}</strong>
        </div>
      `;

      elements.dailyReportModal.hidden = false;
      document.body.classList.add("has-open-dialog");
    }

    function closeDailyReport() {
      elements.dailyReportModal.hidden = true;
      syncDialogBodyState();
    }

    function syncDialogBodyState() {
      const hasVisibleDialog = document.querySelector(".dialog-backdrop:not([hidden])");
      if (!hasVisibleDialog) {
        document.body.classList.remove("has-open-dialog");
      }
    }

    function exportCsv() {
      const rows = getFilteredSales();

      if (!rows.length) {
        showToast("warning", "Nothing to export", "There are no visible sales records to export.");
        return;
      }

      const header = [
        "Transaction No",
        "Date",
        "Time",
        "Cashier",
        "Customer",
        "Payment Method",
        "Subtotal",
        "Discount",
        "Total"
      ];

      const csvRows = rows.map((sale) => {
        return [
          sale.transactionNo,
          formatDate(sale.createdAt),
          formatTime(sale.createdAt),
          sale.cashier,
          sale.customer,
          sale.paymentMethod,
          sale.subtotal,
          sale.discount,
          sale.total
        ].map(csvEscape).join(",");
      });

      const csvContent = [header.join(","), ...csvRows].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "spirits-os-sales-history.csv";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showToast("success", "CSV exported", "Sales history file downloaded successfully.");
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
              <strong>No new sales alerts</strong>
              <p>Your sales history notifications are clear right now.</p>
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
              <span>${escapeHtml(formatDate(item.timestamp))} ${escapeHtml(formatTime(item.timestamp))}</span>
            </div>
          </div>
        `;
      }).join("");
    }

    function buildNotifications() {
      return state.sales.slice(0, 5).map((sale) => ({
        tone: "success",
        title: `Sale Recorded • ${sale.transactionNo}`,
        message: `${formatCurrency(sale.total)} processed by ${sale.cashier}.`,
        timestamp: sale.createdAt
      }));
    }

    function getTodaySales() {
      const today = new Date();
      const todayKey = [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, "0"),
        String(today.getDate()).padStart(2, "0")
      ].join("-");

      return state.sales.filter((sale) => {
        const date = new Date(sale.createdAt);
        const saleKey = [
          date.getFullYear(),
          String(date.getMonth() + 1).padStart(2, "0"),
          String(date.getDate()).padStart(2, "0")
        ].join("-");

        return saleKey === todayKey;
      });
    }

    function getTopCashier(todaySales) {
      if (!todaySales.length) return "No transactions yet";

      const counts = {};
      todaySales.forEach((sale) => {
        counts[sale.cashier] = (counts[sale.cashier] || 0) + 1;
      });

      return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
    }

    function findSaleById(id) {
      return state.sales.find((sale) => sale.id === id) || null;
    }

    function createId(prefix) {
      return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    }

    function copyText(value) {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
        navigator.clipboard.writeText(value).then(() => {
          showToast("success", "Reference copied", `${value} copied to clipboard.`);
        }).catch(() => {
          showToast("info", "Reference ready", value);
        });
        return;
      }

      showToast("info", "Reference ready", value);
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
        hour12: true
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