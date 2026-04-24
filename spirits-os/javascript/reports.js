(() => {
  "use strict";

  document.addEventListener("DOMContentLoaded", initializeReportsPage);

  function initializeReportsPage() {
    const STORAGE_KEYS = {
      sales: "spirits-os-sales-history",
      expenses: "spirits-os-expenses",
      medicines: "spirits-os-medicines",
      notificationsReadAt: "spirits-os-reports-notifications-read-at"
    };

    const elements = {
      liveClock: document.getElementById("liveClock"),
      dayName: document.getElementById("dayName"),
      todayDate: document.getElementById("todayDate"),

      totalRevenue: document.getElementById("totalRevenue"),
      totalExpenses: document.getElementById("totalExpenses"),
      netProfit: document.getElementById("netProfit"),
      inventoryValue: document.getElementById("inventoryValue"),

      revenueTrend: document.getElementById("revenueTrend"),
      expensesTrend: document.getElementById("expensesTrend"),
      profitTrend: document.getElementById("profitTrend"),
      inventoryHealthChip: document.getElementById("inventoryHealthChip"),
      inventoryHealthNote: document.getElementById("inventoryHealthNote"),

      revenueExpenseChart: document.getElementById("revenueExpenseChart"),
      profitabilityChart: document.getElementById("profitabilityChart"),
      inventoryMixDonut: document.getElementById("inventoryMixDonut"),
      inventoryMixLegend: document.getElementById("inventoryMixLegend"),
      topProductsList: document.getElementById("topProductsList"),

      shareReportBtn: document.getElementById("shareReportBtn"),
      printReportBtn: document.getElementById("printReportBtn"),
      exportPdfBtn: document.getElementById("exportPdfBtn"),
      generateAuditLogBtn: document.getElementById("generateAuditLogBtn"),
      viewSettingsBtn: document.getElementById("viewSettingsBtn"),
      ctaMessage: document.getElementById("ctaMessage"),

      notificationList: document.querySelector("[data-notification-list]"),
      notificationCount: document.querySelector("[data-notification-count]"),
      markAllReadBtn: document.querySelector("[data-mark-all-read]"),

      toastStack: document.getElementById("toastStack")
    };

    const state = {
      sales: readJson(STORAGE_KEYS.sales, getFallbackSales()).map(normalizeSale),
      expenses: readJson(STORAGE_KEYS.expenses, getFallbackExpenses()).map(normalizeExpense),
      medicines: readJson(STORAGE_KEYS.medicines, getFallbackMedicines()).map(normalizeMedicine)
    };

    forceReportsTopStart();
    bindEvents();
    updateClock();
    window.setInterval(updateClock, 1000);
    renderAll();

    function forceReportsTopStart() {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }

      const resetScroll = () => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      };

      resetScroll();

      window.requestAnimationFrame(() => {
        resetScroll();
        window.requestAnimationFrame(resetScroll);
      });

      window.addEventListener("pageshow", resetScroll, { once: true });
      window.addEventListener("load", resetScroll, { once: true });
    }

    function bindEvents() {
      if (elements.shareReportBtn) {
        elements.shareReportBtn.addEventListener("click", shareSummary);
      }

      if (elements.printReportBtn) {
        elements.printReportBtn.addEventListener("click", () => window.print());
      }

      if (elements.exportPdfBtn) {
        elements.exportPdfBtn.addEventListener("click", exportPdfReport);
      }

      if (elements.generateAuditLogBtn) {
        elements.generateAuditLogBtn.addEventListener("click", generateAuditLog);
      }

      if (elements.viewSettingsBtn) {
        elements.viewSettingsBtn.setAttribute("href", "settings.html#panel-general");
      }

      if (elements.markAllReadBtn) {
        elements.markAllReadBtn.addEventListener("click", () => {
          localStorage.setItem(STORAGE_KEYS.notificationsReadAt, new Date().toISOString());
          renderNotifications(calculateTotals());
          showToast("success", "Notifications cleared", "All report notifications were marked as read.");
        });
      }
    }

    function renderAll() {
      const totals = calculateTotals();
      renderSummary(totals);
      renderRevenueExpenseChart(totals.monthlySeries);
      renderProfitabilityChart(totals.monthlySeries);
      renderInventoryMix();
      renderTopProducts();
      renderCta(totals);
      renderNotifications(totals);
    }

    function calculateTotals() {
      const revenue = state.sales.reduce((sum, sale) => sum + sale.total, 0);
      const expenses = state.expenses.reduce((sum, item) => sum + item.amount, 0);
      const netProfit = revenue - expenses;
      const inventoryValue = state.medicines.reduce((sum, item) => sum + (item.price * item.stock), 0);

      const monthlySeries = getRecentMonthSeries(6);
      const currentMonth = monthlySeries[monthlySeries.length - 1] || null;
      const previousMonth = monthlySeries[monthlySeries.length - 2] || null;

      return {
        revenue,
        expenses,
        netProfit,
        inventoryValue,
        monthlySeries,
        revenueTrend: getPercentChange(currentMonth ? currentMonth.revenue : 0, previousMonth ? previousMonth.revenue : 0),
        expensesTrend: getPercentChange(currentMonth ? currentMonth.expenses : 0, previousMonth ? previousMonth.expenses : 0),
        profitTrend: getPercentChange(currentMonth ? currentMonth.profit : 0, previousMonth ? previousMonth.profit : 0),
        inventoryHealth: getInventoryHealth()
      };
    }

    function renderSummary(totals) {
      if (elements.totalRevenue) {
        elements.totalRevenue.textContent = formatCurrency(totals.revenue);
      }

      if (elements.totalExpenses) {
        elements.totalExpenses.textContent = formatCurrency(totals.expenses);
      }

      if (elements.netProfit) {
        elements.netProfit.textContent = formatCurrency(totals.netProfit);
      }

      if (elements.inventoryValue) {
        elements.inventoryValue.textContent = formatCurrency(totals.inventoryValue);
      }

      if (elements.revenueTrend) {
        applyTrend(elements.revenueTrend, totals.revenueTrend, false);
      }

      if (elements.expensesTrend) {
        applyTrend(elements.expensesTrend, totals.expensesTrend, true);
      }

      if (elements.profitTrend) {
        applyTrend(elements.profitTrend, totals.profitTrend, false);
      }

      if (elements.inventoryHealthChip) {
        elements.inventoryHealthChip.textContent = totals.inventoryHealth.label;
        elements.inventoryHealthChip.className = `status-chip ${totals.inventoryHealth.tone}`;
      }

      if (elements.inventoryHealthNote) {
        elements.inventoryHealthNote.textContent = totals.inventoryHealth.note;
      }
    }

    function renderRevenueExpenseChart(series) {
      if (!elements.revenueExpenseChart) return;

      const width = 660;
      const height = 260;
      const paddingLeft = 48;
      const paddingRight = 16;
      const paddingTop = 18;
      const paddingBottom = 34;
      const chartWidth = width - paddingLeft - paddingRight;
      const chartHeight = height - paddingTop - paddingBottom;

      const maxValue = Math.max(100, ...series.map((item) => Math.max(item.revenue, item.expenses)));
      const yMax = getNiceMax(maxValue);
      const gridSteps = 4;
      const stepX = chartWidth / Math.max(1, series.length);
      const barGroupWidth = Math.min(54, stepX * 0.66);
      const barWidth = Math.max(10, (barGroupWidth - 8) / 2);

      const grid = Array.from({ length: gridSteps + 1 }, (_, index) => {
        const y = paddingTop + (chartHeight / gridSteps) * index;
        const value = Math.round(yMax - (yMax / gridSteps) * index);

        return `
          <line class="chart-grid-line" x1="${paddingLeft}" y1="${y}" x2="${width - paddingRight}" y2="${y}"></line>
          <text class="chart-axis-text" x="${paddingLeft - 10}" y="${y + 3}" text-anchor="end">${value}</text>
        `;
      }).join("");

      const bars = series.map((item, index) => {
        const groupX = paddingLeft + index * stepX + (stepX - barGroupWidth) / 2;
        const revenueHeight = chartHeight * (item.revenue / yMax);
        const expenseHeight = chartHeight * (item.expenses / yMax);

        const revenueY = paddingTop + chartHeight - revenueHeight;
        const expenseY = paddingTop + chartHeight - expenseHeight;

        return `
          <rect x="${groupX}" y="${revenueY}" width="${barWidth}" height="${revenueHeight}" rx="4" fill="#20bf78"></rect>
          <rect x="${groupX + barWidth + 8}" y="${expenseY}" width="${barWidth}" height="${expenseHeight}" rx="4" fill="#ff4d57"></rect>
          <text class="chart-axis-text" x="${groupX + barGroupWidth / 2}" y="${height - 10}" text-anchor="middle">${escapeHtml(item.label)}</text>
        `;
      }).join("");

      elements.revenueExpenseChart.innerHTML = `
        <svg viewBox="0 0 ${width} ${height}" aria-hidden="true">
          ${grid}
          <line class="chart-axis-line" x1="${paddingLeft}" y1="${paddingTop + chartHeight}" x2="${width - paddingRight}" y2="${paddingTop + chartHeight}"></line>
          ${bars}
        </svg>
      `;
    }

    function renderProfitabilityChart(series) {
      if (!elements.profitabilityChart) return;

      const width = 660;
      const height = 260;
      const paddingLeft = 48;
      const paddingRight = 16;
      const paddingTop = 18;
      const paddingBottom = 34;
      const chartWidth = width - paddingLeft - paddingRight;
      const chartHeight = height - paddingTop - paddingBottom;

      const values = series.map((item) => item.profit);
      const minValue = Math.min(0, ...values);
      const maxValue = Math.max(0, ...values);
      const paddedMin = minValue < 0 ? minValue * 1.1 : -100;
      const paddedMax = maxValue > 0 ? maxValue * 1.1 : 100;
      const range = Math.max(1, paddedMax - paddedMin);
      const gridSteps = 4;

      const toY = (value) => paddingTop + ((paddedMax - value) / range) * chartHeight;
      const stepX = chartWidth / Math.max(1, series.length - 1);

      const points = series.map((item, index) => ({
        x: paddingLeft + index * stepX,
        y: toY(item.profit),
        label: item.label
      }));

      const linePath = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
      const areaPath = `${linePath} L ${points[points.length - 1].x} ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight} Z`;

      const grid = Array.from({ length: gridSteps + 1 }, (_, index) => {
        const ratio = index / gridSteps;
        const value = Math.round(paddedMax - range * ratio);
        const y = paddingTop + chartHeight * ratio;

        return `
          <line class="chart-grid-line" x1="${paddingLeft}" y1="${y}" x2="${width - paddingRight}" y2="${y}"></line>
          <text class="chart-axis-text" x="${paddingLeft - 10}" y="${y + 3}" text-anchor="end">${value}</text>
        `;
      }).join("");

      const labels = points.map((point) => {
        return `<text class="chart-axis-text" x="${point.x}" y="${height - 10}" text-anchor="middle">${escapeHtml(point.label)}</text>`;
      }).join("");

      const zeroY = toY(0);

      elements.profitabilityChart.innerHTML = `
        <svg viewBox="0 0 ${width} ${height}" aria-hidden="true">
          ${grid}
          <line class="chart-axis-line" x1="${paddingLeft}" y1="${zeroY}" x2="${width - paddingRight}" y2="${zeroY}"></line>
          <path d="${areaPath}" fill="rgba(59, 130, 246, 0.10)"></path>
          <path d="${linePath}" fill="none" stroke="#3b82f6" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"></path>
          ${labels}
        </svg>
      `;
    }

    function renderInventoryMix() {
      if (!elements.inventoryMixDonut || !elements.inventoryMixLegend) return;

      const totals = {};
      state.medicines.forEach((item) => {
        totals[item.formType] = (totals[item.formType] || 0) + 1;
      });

      const entries = Object.entries(totals);

      if (!entries.length) {
        elements.inventoryMixDonut.style.background = "conic-gradient(#e8efed 0 360deg)";
        elements.inventoryMixLegend.innerHTML = `
          <div class="mix-legend__row">
            <span class="mix-legend__label">
              <span class="mix-legend__swatch" style="background:#e8efed;"></span>
              No forms available
            </span>
            <strong>0</strong>
          </div>
        `;
        return;
      }

      const colors = ["#20bf78", "#3b82f6", "#f59e0b", "#8b5cf6", "#ff4d57", "#06b6d4"];
      const total = entries.reduce((sum, [, count]) => sum + count, 0);
      let start = 0;

      const segments = entries.map(([name, count], index) => {
        const percentage = total ? (count / total) * 100 : 0;
        const end = start + (percentage / 100) * 360;
        const color = colors[index % colors.length];
        const segment = `${color} ${start}deg ${end}deg`;
        start = end;

        return { name, count, color, segment };
      });

      elements.inventoryMixDonut.style.background = `conic-gradient(${segments.map((segment) => segment.segment).join(", ")})`;
      elements.inventoryMixLegend.innerHTML = segments.map((segment) => {
        return `
          <div class="mix-legend__row">
            <span class="mix-legend__label">
              <span class="mix-legend__swatch" style="background:${escapeHtml(segment.color)};"></span>
              ${escapeHtml(segment.name)}
            </span>
            <strong>${escapeHtml(String(segment.count))}</strong>
          </div>
        `;
      }).join("");
    }

    function renderTopProducts() {
      if (!elements.topProductsList) return;

      const totals = {};
      state.sales.forEach((sale) => {
        sale.items.forEach((item) => {
          totals[item.medicine] = (totals[item.medicine] || 0) + item.quantity;
        });
      });

      const entries = Object.entries(totals)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

      if (!entries.length) {
        elements.topProductsList.innerHTML = `
          <div class="top-product">
            <div class="top-product__row">
              <span class="top-product__rank">01</span>
              <span class="top-product__name">No sales data available</span>
              <span class="top-product__qty">0 units</span>
            </div>
            <div class="top-product__bar"><span style="width:0%;"></span></div>
          </div>
        `;
        return;
      }

      const maxQty = Math.max(...entries.map(([, qty]) => qty));

      elements.topProductsList.innerHTML = entries.map(([name, qty], index) => {
        const width = maxQty ? (qty / maxQty) * 100 : 0;

        return `
          <div class="top-product">
            <div class="top-product__row">
              <span class="top-product__rank">${String(index + 1).padStart(2, "0")}</span>
              <span class="top-product__name">${escapeHtml(name)}</span>
              <span class="top-product__qty">${escapeHtml(String(qty))} units</span>
            </div>
            <div class="top-product__bar">
              <span style="width:${width}%;"></span>
            </div>
          </div>
        `;
      }).join("");
    }

    function renderCta(totals) {
      if (!elements.ctaMessage) return;

      if (totals.netProfit > 0) {
        elements.ctaMessage.innerHTML = `Your pharmacy is performing <strong>profitably</strong> this cycle with ${totals.inventoryHealth.label.toLowerCase()} inventory health.`;
      } else if (totals.netProfit === 0) {
        elements.ctaMessage.innerHTML = `Your pharmacy is currently at a <strong>break-even</strong> point. Review costs and product movement.`;
      } else {
        elements.ctaMessage.innerHTML = `Your pharmacy is under <strong>cost pressure</strong>. Review expenses and improve sell-through this period.`;
      }
    }

    function renderNotifications(totals) {
      if (!elements.notificationList || !elements.notificationCount) return;

      const notifications = buildNotifications(totals);
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
              <strong>No report alerts</strong>
              <p>Your intelligence dashboard has no recent alerts.</p>
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

    function buildNotifications(totals) {
      const items = [];
      const latestSale = [...state.sales].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
      const latestExpense = [...state.expenses].sort((a, b) => new Date(b.date) - new Date(a.date))[0];

      if (latestSale) {
        items.push({
          tone: "success",
          title: "Recent sale captured",
          message: `${latestSale.transactionNo} recorded ${formatCurrency(latestSale.total)} in revenue.`,
          timestamp: latestSale.createdAt
        });
      }

      if (latestExpense) {
        items.push({
          tone: "warning",
          title: "Recent expense logged",
          message: `${latestExpense.referenceNo} added ${formatCurrency(latestExpense.amount)} under ${latestExpense.category}.`,
          timestamp: `${latestExpense.date}T12:00:00`
        });
      }

      if (totals.netProfit < 0) {
        items.push({
          tone: "error",
          title: "Negative profitability trend",
          message: `Current net profit is ${formatCurrency(totals.netProfit)}. Review cost controls this month.`,
          timestamp: new Date().toISOString()
        });
      }

      if (totals.inventoryHealth.tone !== "stable") {
        items.push({
          tone: "info",
          title: "Inventory health requires attention",
          message: totals.inventoryHealth.note,
          timestamp: new Date().toISOString()
        });
      }

      return items.slice(0, 5);
    }

    function shareSummary() {
      const totals = calculateTotals();
      const text = [
        "Spirit's OS - Business Intelligence Summary",
        `Revenue: ${formatCurrency(totals.revenue)}`,
        `Expenses: ${formatCurrency(totals.expenses)}`,
        `Net Profit: ${formatCurrency(totals.netProfit)}`,
        `Inventory Value: ${formatCurrency(totals.inventoryValue)}`,
        `Inventory Health: ${totals.inventoryHealth.label}`
      ].join("\n");

      if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
        navigator.clipboard.writeText(text).then(() => {
          showToast("success", "Summary copied", "Report summary copied to clipboard.");
        }).catch(() => {
          showToast("info", "Share summary", text);
        });
        return;
      }

      showToast("info", "Share summary", text);
    }

    function exportPdfReport() {
      showToast("info", "Export started", "Print dialog opened. Choose Save as PDF to export this report.");
      window.print();
    }

    function generateAuditLog() {
      const totals = calculateTotals();
      const lines = [
        "SPIRIT'S OS - AUDIT LOG SNAPSHOT",
        `Generated: ${new Date().toLocaleString()}`,
        `Total Revenue: ${formatCurrency(totals.revenue)}`,
        `Total Expenses: ${formatCurrency(totals.expenses)}`,
        `Net Profit: ${formatCurrency(totals.netProfit)}`,
        `Inventory Value: ${formatCurrency(totals.inventoryValue)}`,
        `Inventory Health: ${totals.inventoryHealth.label}`,
        "",
        "Recent Months:"
      ];

      totals.monthlySeries.forEach((month) => {
        lines.push(`${month.label}: Revenue ${formatCurrency(month.revenue)} | Expenses ${formatCurrency(month.expenses)} | Profit ${formatCurrency(month.profit)}`);
      });

      const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "spirits-os-audit-log.txt";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showToast("success", "Audit log ready", "A downloadable audit snapshot was generated.");
    }

    function getInventoryHealth() {
      const totalStock = state.medicines.reduce((sum, item) => sum + item.stock, 0);
      const lowStockCount = state.medicines.filter((item) => item.stock <= item.reorderLevel).length;

      if (lowStockCount >= 3) {
        return {
          label: "Critical",
          tone: "critical",
          note: "Multiple medicines are already below reorder level"
        };
      }

      if (lowStockCount > 0 || totalStock < 400) {
        return {
          label: "Watch",
          tone: "watch",
          note: "Some medicine lines need replenishment soon"
        };
      }

      return {
        label: "Stable",
        tone: "stable",
        note: "Inventory health remains stable and well distributed"
      };
    }

    function getRecentMonthSeries(count) {
      const months = [];
      const now = new Date();
      const current = new Date(now.getFullYear(), now.getMonth(), 1);

      for (let index = count - 1; index >= 0; index -= 1) {
        const monthDate = new Date(current.getFullYear(), current.getMonth() - index, 1);
        const monthKey = getMonthKey(monthDate);

        const revenue = state.sales.reduce((sum, sale) => {
          return getMonthKey(new Date(sale.createdAt)) === monthKey ? sum + sale.total : sum;
        }, 0);

        const expenses = state.expenses.reduce((sum, item) => {
          return getMonthKey(new Date(`${item.date}T00:00:00`)) === monthKey ? sum + item.amount : sum;
        }, 0);

        months.push({
          key: monthKey,
          label: monthDate.toLocaleDateString("en-US", { month: "short" }),
          revenue,
          expenses,
          profit: revenue - expenses
        });
      }

      return months;
    }

    function getMonthKey(date) {
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    }

    function getPercentChange(current, previous) {
      const safeCurrent = Number(current) || 0;
      const safePrevious = Number(previous) || 0;

      if (Math.abs(safePrevious) < 0.01) {
        if (Math.abs(safeCurrent) < 0.01) {
          return 0;
        }
        return safeCurrent > 0 ? 100 : -100;
      }

      return ((safeCurrent - safePrevious) / Math.abs(safePrevious)) * 100;
    }

    function applyTrend(element, value, inverseColor) {
      const rounded = `${value >= 0 ? "+" : ""}${Math.round(value)}%`;
      element.textContent = rounded;

      const positive = value >= 0;
      if (inverseColor) {
        element.className = `trend-badge ${positive ? "trend-negative" : "trend-positive"}`;
      } else {
        element.className = `trend-badge ${positive ? "trend-positive" : "trend-negative"}`;
      }
    }

    function readJson(key, fallback) {
      try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
      } catch (error) {
        return fallback;
      }
    }

    function normalizeSale(item) {
      return {
        total: toNumber(item.total),
        createdAt: item.createdAt || new Date().toISOString(),
        transactionNo: String(item.transactionNo || "").trim(),
        items: Array.isArray(item.items)
          ? item.items.map((saleItem) => ({
              medicine: String(saleItem.medicine || "").trim(),
              quantity: toNumber(saleItem.quantity)
            }))
          : []
      };
    }

    function normalizeExpense(item) {
      return {
        amount: toNumber(item.amount),
        date: String(item.date || todayIso()),
        category: String(item.category || "Others").trim(),
        referenceNo: String(item.referenceNo || "").trim()
      };
    }

    function normalizeMedicine(item) {
      return {
        stock: toNumber(item.stock),
        reorderLevel: toNumber(item.reorderLevel || 0),
        price: toNumber(item.price),
        formType: String(item.formType || "Tablet").trim()
      };
    }

    function toNumber(value) {
      const number = Number(value);
      return Number.isFinite(number) ? number : 0;
    }

    function formatCurrency(value) {
      return new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
        minimumFractionDigits: 2
      }).format(value);
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

    function todayIso() {
      const now = new Date();
      return [
        now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, "0"),
        String(now.getDate()).padStart(2, "0")
      ].join("-");
    }

    function getNiceMax(value) {
      const magnitude = Math.pow(10, Math.floor(Math.log10(value)));
      const normalized = value / magnitude;
      let nice = 1;

      if (normalized > 5) {
        nice = 10;
      } else if (normalized > 2) {
        nice = 5;
      } else if (normalized > 1) {
        nice = 2;
      }

      return nice * magnitude;
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

    function getFallbackSales() {
      return [
        {
          transactionNo: "SALE-240415-001",
          total: 25,
          createdAt: "2026-04-15T08:17:00",
          items: [{ medicine: "Biogesic", quantity: 5 }]
        },
        {
          transactionNo: "SALE-240415-002",
          total: 50,
          createdAt: "2026-04-15T09:42:00",
          items: [
            { medicine: "Amoxil", quantity: 2 },
            { medicine: "Medicol", quantity: 2 }
          ]
        },
        {
          transactionNo: "SALE-240415-003",
          total: 75,
          createdAt: "2026-04-15T11:06:00",
          items: [
            { medicine: "Ceelin", quantity: 5 },
            { medicine: "Kremil-S", quantity: 2 }
          ]
        },
        {
          transactionNo: "SALE-240416-001",
          total: 190,
          createdAt: "2026-04-16T09:20:00",
          items: [
            { medicine: "Biogesic", quantity: 9 },
            { medicine: "Ceelin", quantity: 2 }
          ]
        }
      ];
    }

    function getFallbackExpenses() {
      return [
        {
          referenceNo: "EXP-240410-001",
          date: "2026-04-10",
          category: "Utilities",
          amount: 2500
        }
      ];
    }

    function getFallbackMedicines() {
      return [
        { stock: 450, reorderLevel: 100, price: 5, formType: "Tablet" },
        { stock: 220, reorderLevel: 60, price: 18, formType: "Capsule" },
        { stock: 86, reorderLevel: 100, price: 9, formType: "Capsule" },
        { stock: 58, reorderLevel: 30, price: 145, formType: "Syrup" },
        { stock: 164, reorderLevel: 80, price: 8.5, formType: "Tablet" },
        { stock: 34, reorderLevel: 40, price: 120, formType: "Syrup" },
        { stock: 130, reorderLevel: 70, price: 7, formType: "Tablet" },
        { stock: 72, reorderLevel: 40, price: 35, formType: "Tablet" },
        { stock: 160, reorderLevel: 50, price: 10, formType: "Capsule" }
      ];
    }
  }
})();
