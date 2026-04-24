(() => {
  "use strict";

  const STORAGE_KEY = "spirits-os.notifications.v1";

  const PAGE_LABELS = {
    "dashboard.html": "Dashboard",
    "sales-pos.html": "Sales / POS",
    "medicines.html": "Medicines",
    "batches.html": "Batches",
    "stock-movements.html": "Stock Movements",
    "expiration-alerts.html": "Expiration Alerts",
    "sales-history.html": "Sales History",
    "expenses.html": "Expenses",
    "reports.html": "Reports",
    "categories.html": "Categories",
    "suppliers.html": "Suppliers",
    "users.html": "Users",
    "audit-logs.html": "Audit Logs",
    "backup-restore.html": "Backup / Restore",
    "settings.html": "Settings",
    "index.html": "Login"
  };

  const PAGE_SHORTCUT_EXCLUSIONS = new Set(["dashboard.html", "sales-pos.html"]);

  const DEFAULT_PAGE_HASHES = {
    "medicines.html": "#medicineOverviewSection",
    "batches.html": "#overviewSection",
    "stock-movements.html": "#movementOverviewSection",
    "expiration-alerts.html": "#expirationOverviewSection",
    "sales-history.html": "#salesLedgerSection",
    "expenses.html": "#expenseTrackerSection",
    "categories.html": "#categoryHeroSection",
    "settings.html": "#panel-general"
  };

  const STATIC_SEARCH_ITEMS = [
    {
      id: "dashboard-overview",
      title: "Operational Overview",
      description: "KPI cards, overview metrics, and alert summaries",
      page: "dashboard.html",
      hash: "#overviewSection",
      keywords: "dashboard overview cards metrics operational performance alerts"
    },
    {
      id: "dashboard-revenue",
      title: "Revenue vs Expenses",
      description: "Weekly financial performance comparison chart",
      page: "dashboard.html",
      hash: "#revenueSection",
      keywords: "revenue expenses chart finance weekly comparison"
    },
    {
      id: "dashboard-inventory",
      title: "Inventory Distribution",
      description: "Stock level chart and inventory health area",
      page: "dashboard.html",
      hash: "#inventorySection",
      keywords: "inventory stock medicines categories distribution low stock expiry"
    },
    {
      id: "dashboard-transactions",
      title: "Recent Transactions",
      description: "Latest sales history and cashier activity",
      page: "dashboard.html",
      hash: "#transactionsSection",
      keywords: "transactions recent sales history cashier activity"
    },
    {
      id: "dashboard-priority",
      title: "Priority Inventory Queue",
      description: "Items that need immediate attention today",
      page: "dashboard.html",
      hash: "#priorityQueueSection",
      keywords: "priority queue attention low stock expiry urgent"
    },
    {
      id: "page-dashboard",
      title: "Go to Dashboard",
      description: "Open the main admin dashboard",
      page: "dashboard.html",
      hash: "#overviewSection",
      keywords: "dashboard home overview admin"
    },
    {
      id: "page-pos",
      title: "Go to Sales / POS",
      description: "Open products, cart, checkout, and payment flow",
      page: "sales-pos.html",
      hash: "#productsSection",
      keywords: "sales pos cashier checkout payment cart medicines products"
    },
    {
      id: "pos-products",
      title: "Browse Medicines",
      description: "Product grid, medicine search, and category chips",
      page: "sales-pos.html",
      hash: "#productsSection",
      keywords: "products medicines product grid search categories browse"
    },
    {
      id: "pos-current-sale",
      title: "Current Sale / Checkout",
      description: "Cart, discount, total, and checkout controls",
      page: "sales-pos.html",
      hash: "#currentSaleSection",
      keywords: "current sale checkout cart total discount payment receipt"
    }
  ];

  const STATIC_NOTIFICATIONS = [
    {
      id: "notif-critical-expiry",
      title: "Critical expiry detected",
      message: "1 batch needs disposal review today.",
      page: "dashboard.html",
      hash: "#inventorySection",
      level: "danger",
      time: "2m ago"
    },
    {
      id: "notif-low-stock",
      title: "Low stock alert",
      message: "Open the priority queue to review medicines below reorder level.",
      page: "dashboard.html",
      hash: "#priorityQueueSection",
      level: "info",
      time: "8m ago"
    },
    {
      id: "notif-transactions",
      title: "Review recent transactions",
      message: "Check the latest cashier activity and sales records.",
      page: "dashboard.html",
      hash: "#transactionsSection",
      level: "success",
      time: "14m ago"
    },
    {
      id: "notif-open-pos",
      title: "Sales POS is ready",
      message: "Jump to products, cart, and checkout from the topbar.",
      page: "sales-pos.html",
      hash: "#currentSaleSection",
      level: "primary",
      time: "Now"
    }
  ];

  function getCurrentFile() {
    const fileName = window.location.pathname.split("/").pop();
    return fileName || "dashboard.html";
  }

  function getPageLabel(fileName) {
    return PAGE_LABELS[fileName] || "Page";
  }

  function normalize(value) {
    return String(value || "").toLowerCase().replace(/\s+/g, " ").trim();
  }

  function escapeHTML(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function buildDomSearchItems() {
    return Array.from(document.querySelectorAll("[data-search-title]"))
      .map((element, index) => {
        const hash = element.id ? `#${element.id}` : "";

        return {
          id: `dom-search-${index}`,
          title: element.getAttribute("data-search-title") || element.textContent.trim() || "Section",
          description: element.getAttribute("data-search-description") || "Jump to section",
          page: getCurrentFile(),
          hash,
          keywords: element.getAttribute("data-search-keywords") || ""
        };
      })
      .filter((item) => item.hash);
  }

  function buildSearchIndex() {
    const combined = [...STATIC_SEARCH_ITEMS, ...buildPageShortcuts(), ...buildDomSearchItems()];
    const seen = new Set();

    return combined.filter((item) => {
      const key = `${item.page}|${item.hash}|${item.title}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function scoreSearchItem(item, query) {
    const currentFile = getCurrentFile();
    let score = item.page === currentFile ? 6 : 0;
    const cleanQuery = normalize(query);
    const haystack = normalize(
      `${item.title} ${item.description} ${item.keywords} ${getPageLabel(item.page)}`
    );
    const title = normalize(item.title);

    if (!cleanQuery) {
      return score + (item.page === currentFile ? 4 : 1);
    }

    const terms = cleanQuery.split(" ").filter(Boolean);

    if (haystack.includes(cleanQuery)) score += 12;
    if (title.startsWith(cleanQuery)) score += 10;

    terms.forEach((term) => {
      if (title === term) score += 12;
      if (title.startsWith(term)) score += 8;
      if (title.includes(term)) score += 6;
      if (haystack.includes(term)) score += 3;
    });

    return score;
  }

  function getSearchResults(query) {
    const currentFile = getCurrentFile();

    return buildSearchIndex()
      .map((item) => ({
        item,
        score: scoreSearchItem(item, query)
      }))
      .filter((entry) => (normalize(query) ? entry.score > 0 : true))
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;

        if (a.item.page === currentFile && b.item.page !== currentFile) return -1;
        if (a.item.page !== currentFile && b.item.page === currentFile) return 1;

        return a.item.title.localeCompare(b.item.title);
      })
      .slice(0, 8)
      .map((entry) => entry.item);
  }

  function jumpToHash(hash) {
    if (!hash) return;

    const target = document.querySelector(hash);
    if (!target) return;

    target.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

    target.classList.remove("section-flash");
    void target.offsetWidth;
    target.classList.add("section-flash");
  }

  function closeSearch(root) {
    const toggle = root.querySelector("[data-search-toggle]");
    const panel = root.querySelector("[data-search-panel]");

    if (!panel) return;

    panel.hidden = true;
    root.classList.remove("is-open");

    if (toggle) toggle.setAttribute("aria-expanded", "false");
  }

  function closeNotifications(root) {
    const toggle = root.querySelector("[data-notification-toggle]");
    const panel = root.querySelector("[data-notification-panel]");

    if (!panel) return;

    panel.hidden = true;
    root.classList.remove("is-open");

    if (toggle) toggle.setAttribute("aria-expanded", "false");
  }

  function closeAllPanels() {
    document.querySelectorAll("[data-search-root]").forEach(closeSearch);
    document.querySelectorAll("[data-notification-root]").forEach(closeNotifications);
  }

  function openTarget(item) {
    closeAllPanels();

    if (item.page === getCurrentFile()) {
      if (item.hash) {
        jumpToHash(item.hash);
      } else {
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
      }
      return;
    }

    window.location.href = `${item.page}${item.hash || ""}`;
  }

  function buildPageShortcuts() {
    return Object.entries(PAGE_LABELS)
      .filter(([page]) => page !== "index.html" && !PAGE_SHORTCUT_EXCLUSIONS.has(page))
      .map(([page, label]) => ({
        id: `page-shortcut-${page.replace(/[^a-z0-9]/gi, "-").toLowerCase()}`,
        title: `Go to ${label}`,
        description: `Open the ${label} module`,
        page,
        hash: DEFAULT_PAGE_HASHES[page] || "",
        keywords: `${label} ${page.replace(".html", "").replace(/-/g, " ")}`
      }));
  }

  function renderSearchResults(root) {
    const input = root.querySelector("[data-search-input]");
    const resultsNode = root.querySelector("[data-search-results]");

    if (!input || !resultsNode) return;

    const results = getSearchResults(input.value);
    root._searchResults = results;

    let activeIndex = Number(root.dataset.activeIndex || 0);

    if (!results.length) {
      root.dataset.activeIndex = "0";
      resultsNode.innerHTML = `
        <div class="search-empty-state">
          No matches found. Try searching for inventory, checkout, transactions, or POS.
        </div>
      `;
      return;
    }

    if (Number.isNaN(activeIndex) || activeIndex < 0) activeIndex = 0;
    if (activeIndex >= results.length) activeIndex = 0;

    root.dataset.activeIndex = String(activeIndex);

    resultsNode.innerHTML = results.map((item, index) => {
      const samePage = item.page === getCurrentFile();

      return `
        <button
          type="button"
          class="search-result-item ${index === activeIndex ? "is-active" : ""}"
          data-search-result="${index}"
        >
          <span class="search-result-icon">${samePage ? "GO" : "↗"}</span>
          <span class="search-result-content">
            <strong>${escapeHTML(item.title)}</strong>
            <span>${escapeHTML(item.description)}</span>
          </span>
          <span class="search-result-tag">
            ${samePage ? "This page" : escapeHTML(getPageLabel(item.page))}
          </span>
        </button>
      `;
    }).join("");
  }

  function setActiveSearchIndex(root, nextIndex) {
    const results = root._searchResults || [];

    if (!results.length) {
      root.dataset.activeIndex = "0";
      return;
    }

    let safeIndex = nextIndex;

    if (safeIndex < 0) safeIndex = results.length - 1;
    if (safeIndex >= results.length) safeIndex = 0;

    root.dataset.activeIndex = String(safeIndex);
    renderSearchResults(root);

    const activeButton = root.querySelector(`[data-search-result="${safeIndex}"]`);
    if (activeButton) {
      activeButton.scrollIntoView({ block: "nearest" });
    }
  }

  function openSearch(root) {
    closeAllPanels();

    const toggle = root.querySelector("[data-search-toggle]");
    const panel = root.querySelector("[data-search-panel]");
    const input = root.querySelector("[data-search-input]");

    if (!panel || !input) return;

    panel.hidden = false;
    root.classList.add("is-open");
    root.dataset.activeIndex = "0";

    if (toggle) toggle.setAttribute("aria-expanded", "true");

    renderSearchResults(root);

    requestAnimationFrame(() => {
      input.focus();
      input.select();
    });
  }

  function loadNotifications() {
    let stored = [];

    try {
      stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch {
      stored = [];
    }

    const storedMap = new Map(stored.map((item) => [item.id, Boolean(item.unread)]));

    return STATIC_NOTIFICATIONS.map((item) => ({
      ...item,
      unread: storedMap.has(item.id) ? storedMap.get(item.id) : true
    }));
  }

  function getNotifications() {
    if (!window.__spiritsNotifications) {
      window.__spiritsNotifications = loadNotifications();
    }

    return window.__spiritsNotifications;
  }

  function setNotifications(items) {
    window.__spiritsNotifications = items;

    const savedState = items.map((item) => ({
      id: item.id,
      unread: item.unread
    }));

    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedState));
    syncNotificationUI();
  }

  function markNotificationRead(id) {
    const updated = getNotifications().map((item) =>
      item.id === id ? { ...item, unread: false } : item
    );

    setNotifications(updated);
  }

  function markAllNotificationsRead() {
    const updated = getNotifications().map((item) => ({
      ...item,
      unread: false
    }));

    setNotifications(updated);
  }

  function getUnreadCount() {
    return getNotifications().filter((item) => item.unread).length;
  }

  function renderNotifications(root) {
    const list = root.querySelector("[data-notification-list]");
    const markAllButton = root.querySelector("[data-mark-all-read]");

    if (!list) return;

    const items = getNotifications();

    if (!items.length) {
      list.innerHTML = `<div class="notification-empty-state">No notifications yet.</div>`;
    } else {
      list.innerHTML = items.map((item) => `
        <button
          type="button"
          class="notification-item ${item.unread ? "is-unread" : ""}"
          data-notification-item="${item.id}"
        >
          <span class="notification-accent is-${escapeHTML(item.level)}"></span>

          <span class="notification-body">
            <span class="notification-title-row">
              <strong>${escapeHTML(item.title)}</strong>
              <span class="notification-time">${escapeHTML(item.time)}</span>
            </span>

            <span class="notification-message">${escapeHTML(item.message)}</span>

            <span class="notification-footer">
              <span>${escapeHTML(getPageLabel(item.page))}</span>
              <span class="notification-open">Open</span>
            </span>
          </span>

          ${item.unread ? '<span class="notification-unread-dot"></span>' : ""}
        </button>
      `).join("");
    }

    if (markAllButton) {
      markAllButton.disabled = getUnreadCount() === 0;
    }
  }

  function syncNotificationUI() {
    const unread = getUnreadCount();

    document.querySelectorAll("[data-notification-count]").forEach((badge) => {
      badge.textContent = unread > 9 ? "9+" : String(unread);
      badge.classList.toggle("is-hidden", unread === 0);
    });

    document.querySelectorAll("[data-notification-root]").forEach((root) => {
      renderNotifications(root);
    });
  }

  function openNotifications(root) {
    closeAllPanels();

    const toggle = root.querySelector("[data-notification-toggle]");
    const panel = root.querySelector("[data-notification-panel]");

    if (!panel) return;

    panel.hidden = false;
    root.classList.add("is-open");

    if (toggle) toggle.setAttribute("aria-expanded", "true");

    renderNotifications(root);
  }

  function bindSearchRoot(root) {
    const toggle = root.querySelector("[data-search-toggle]");
    const closeButton = root.querySelector("[data-search-close]");
    const input = root.querySelector("[data-search-input]");
    const resultsNode = root.querySelector("[data-search-results]");

    if (!toggle || !input || !resultsNode) return;

    toggle.addEventListener("click", (event) => {
      event.stopPropagation();
      const panel = root.querySelector("[data-search-panel]");
      const isOpen = panel && !panel.hidden;
      isOpen ? closeSearch(root) : openSearch(root);
    });

    if (closeButton) {
      closeButton.addEventListener("click", () => closeSearch(root));
    }

    input.addEventListener("input", () => {
      root.dataset.activeIndex = "0";
      renderSearchResults(root);
    });

    input.addEventListener("keydown", (event) => {
      const activeIndex = Number(root.dataset.activeIndex || 0);
      const results = root._searchResults || [];

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActiveSearchIndex(root, activeIndex + 1);
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        setActiveSearchIndex(root, activeIndex - 1);
      }

      if (event.key === "Enter") {
        event.preventDefault();
        if (results.length) {
          const item = results[activeIndex] || results[0];
          openTarget(item);
        }
      }

      if (event.key === "Escape") {
        event.preventDefault();
        closeSearch(root);
      }
    });

    resultsNode.addEventListener("click", (event) => {
      const button = event.target.closest("[data-search-result]");
      if (!button) return;

      const index = Number(button.dataset.searchResult || 0);
      const item = (root._searchResults || [])[index];

      if (item) openTarget(item);
    });
  }

  function bindNotificationRoot(root) {
    const toggle = root.querySelector("[data-notification-toggle]");
    const list = root.querySelector("[data-notification-list]");
    const markAllButton = root.querySelector("[data-mark-all-read]");

    if (!toggle || !list) return;

    toggle.addEventListener("click", (event) => {
      event.stopPropagation();
      const panel = root.querySelector("[data-notification-panel]");
      const isOpen = panel && !panel.hidden;
      isOpen ? closeNotifications(root) : openNotifications(root);
    });

    if (markAllButton) {
      markAllButton.addEventListener("click", () => markAllNotificationsRead());
    }

    list.addEventListener("click", (event) => {
      const button = event.target.closest("[data-notification-item]");
      if (!button) return;

      const id = button.dataset.notificationItem;
      const item = getNotifications().find((notification) => notification.id === id);

      if (!item) return;

      if (item.unread) markNotificationRead(id);
      openTarget(item);
    });
  }

  function bindGlobalEvents() {
    document.addEventListener("click", (event) => {
      const insideSearch = event.target.closest("[data-search-root]");
      const insideNotifications = event.target.closest("[data-notification-root]");

      if (!insideSearch && !insideNotifications) {
        closeAllPanels();
      }
    });

    document.addEventListener("keydown", (event) => {
      const isSearchShortcut = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k";

      if (isSearchShortcut) {
        event.preventDefault();
        const firstSearch = document.querySelector("[data-search-root]");
        if (firstSearch) openSearch(firstSearch);
      }

      if (event.key === "Escape") {
        closeAllPanels();
      }
    });
  }

  function initAppTools() {
    document.querySelectorAll("[data-search-root]").forEach(bindSearchRoot);
    document.querySelectorAll("[data-notification-root]").forEach(bindNotificationRoot);

    syncNotificationUI();
    bindGlobalEvents();
  }

  document.addEventListener("DOMContentLoaded", initAppTools);
})();
