document.addEventListener("DOMContentLoaded", () => {
  const products = [
    {
      id: 1,
      name: "Biogesic",
      generic: "Paracetamol • 500mg",
      category: "Analgesics",
      price: 5.0,
      stock: 450,
      sku: "PAR-500",
      batch: "B001"
    },
    {
      id: 2,
      name: "Mefenamic Acid",
      generic: "Mefenamic Acid • 500mg",
      category: "Analgesics",
      price: 8.5,
      stock: 210,
      sku: "MEF-500",
      batch: "B013"
    },
    {
      id: 3,
      name: "Ibuprofen",
      generic: "Ibuprofen • 200mg",
      category: "Analgesics",
      price: 7.25,
      stock: 325,
      sku: "IBU-200",
      batch: "B021"
    },
    {
      id: 4,
      name: "Amoxicillin",
      generic: "Amoxicillin • 500mg",
      category: "Antibiotics",
      price: 14.0,
      stock: 190,
      sku: "AMX-500",
      batch: "A104"
    },
    {
      id: 5,
      name: "Co-Amoxiclav",
      generic: "Amoxicillin + Clavulanic • 625mg",
      category: "Antibiotics",
      price: 21.5,
      stock: 88,
      sku: "COA-625",
      batch: "A202"
    },
    {
      id: 6,
      name: "Azithromycin",
      generic: "Azithromycin • 500mg",
      category: "Antibiotics",
      price: 18.75,
      stock: 76,
      sku: "AZI-500",
      batch: "A311"
    },
    {
      id: 7,
      name: "Vitamin C",
      generic: "Ascorbic Acid • 500mg",
      category: "Vitamins",
      price: 4.5,
      stock: 520,
      sku: "VIT-C500",
      batch: "V018"
    },
    {
      id: 8,
      name: "Vitamin B Complex",
      generic: "B Complex Capsules",
      category: "Vitamins",
      price: 6.75,
      stock: 300,
      sku: "VIT-BX",
      batch: "V026"
    }
  ];

  const DISCOUNTS = {
    none: { label: "No Discount", rate: 0 },
    senior: { label: "Senior Citizen", rate: 0.2 },
    pwd: { label: "PWD", rate: 0.2 }
  };

  const PAYMENT_METHODS = {
    cash: { label: "Cash" },
    gcash: { label: "GCash" },
    card: { label: "Card" }
  };

  const state = {
    activeCategory: "all",
    search: "",
    cart: [],
    paymentMethod: "cash",
    discountType: "none"
  };

  const liveClock = document.getElementById("liveClock");
  const dayName = document.getElementById("dayName");
  const todayDate = document.getElementById("todayDate");

  const productSearchInput = document.getElementById("productSearchInput");
  const categoryChips = document.getElementById("categoryChips");
  const catalogCount = document.getElementById("catalogCount");
  const posProductGrid = document.getElementById("posProductGrid");

  const saleCartList = document.getElementById("saleCartList");
  const cartItemCount = document.getElementById("cartItemCount");
  const subtotalValue = document.getElementById("subtotalValue");
  const discountValue = document.getElementById("discountValue");
  const totalValue = document.getElementById("totalValue");

  const clearCartBtn = document.getElementById("clearCartBtn");
  const openCheckoutBtn = document.getElementById("openCheckoutBtn");

  const paymentModal = document.getElementById("paymentModal");
  const receiptModal = document.getElementById("receiptModal");

  const paymentMethodGrid = document.getElementById("paymentMethodGrid");
  const discountTypeGrid = document.getElementById("discountTypeGrid");

  const modalTotalValue = document.getElementById("modalTotalValue");
  const modalSubtotalValue = document.getElementById("modalSubtotalValue");
  const modalDiscountValue = document.getElementById("modalDiscountValue");
  const modalGrandTotalValue = document.getElementById("modalGrandTotalValue");

  const amountTenderedInput = document.getElementById("amountTenderedInput");
  const paymentHelpText = document.getElementById("paymentHelpText");
  const changeValue = document.getElementById("changeValue");
  const completeSaleBtn = document.getElementById("completeSaleBtn");

  const receiptTransactionId = document.getElementById("receiptTransactionId");
  const receiptDateTime = document.getElementById("receiptDateTime");
  const receiptCashier = document.getElementById("receiptCashier");
  const receiptPaymentMethod = document.getElementById("receiptPaymentMethod");
  const receiptItemCount = document.getElementById("receiptItemCount");
  const receiptItemsBody = document.getElementById("receiptItemsBody");
  const receiptSubtotal = document.getElementById("receiptSubtotal");
  const receiptDiscountType = document.getElementById("receiptDiscountType");
  const receiptDiscountAmount = document.getElementById("receiptDiscountAmount");
  const receiptAmountTendered = document.getElementById("receiptAmountTendered");
  const receiptChange = document.getElementById("receiptChange");
  const receiptTotalPaid = document.getElementById("receiptTotalPaid");
  const printReceiptBtn = document.getElementById("printReceiptBtn");
  const doneReceiptBtn = document.getElementById("doneReceiptBtn");

  const toastStack = document.getElementById("toastStack");

  const notificationList = document.querySelector("[data-notification-list]");
  const notificationCount = document.querySelector("[data-notification-count]");
  const markAllReadBtn = document.querySelector("[data-mark-all-read]");

  const quickSearchInput = document.querySelector("[data-search-input]");
  const quickSearchResults = document.querySelector("[data-search-results]");

  const notifications = [
    {
      type: "warning",
      title: "Low stock reminder",
      message: "Co-Amoxiclav is running low and may need restocking soon.",
      time: "2m ago"
    },
    {
      type: "success",
      title: "POS synced successfully",
      message: "Transactions are syncing normally across the active terminal.",
      time: "5m ago"
    },
    {
      type: "warning",
      title: "Check batch expiry",
      message: "Review near-expiry vitamins before the afternoon restock cycle.",
      time: "14m ago"
    }
  ];

  function formatMoney(value) {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP"
    }).format(value || 0);
  }

  function updateClock() {
    const now = new Date();

    if (liveClock) {
      liveClock.textContent = now.toLocaleTimeString("en-US", {
        hour12: false
      });
    }

    if (dayName) {
      dayName.textContent = now.toLocaleDateString("en-US", {
        weekday: "long"
      });
    }

    if (todayDate) {
      todayDate.textContent = now.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      });
    }
  }

  function splitGenericText(genericText = "") {
    const parts = String(genericText).split("•").map((part) => part.trim()).filter(Boolean);

    if (parts.length >= 2) {
      return {
        genericName: parts[0],
        dosage: parts.slice(1).join(" • ")
      };
    }

    return {
      genericName: genericText,
      dosage: ""
    };
  }

  function getFilteredProducts() {
    const keyword = state.search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory =
        state.activeCategory === "all" || product.category === state.activeCategory;

      const matchesSearch =
        !keyword ||
        product.name.toLowerCase().includes(keyword) ||
        product.generic.toLowerCase().includes(keyword) ||
        product.category.toLowerCase().includes(keyword) ||
        product.sku.toLowerCase().includes(keyword);

      return matchesCategory && matchesSearch;
    });
  }

  function renderProducts() {
    const filtered = getFilteredProducts();

    catalogCount.textContent = `${filtered.length} item${filtered.length === 1 ? "" : "s"} available`;

    if (!filtered.length) {
      posProductGrid.innerHTML = `
        <div class="product-empty">
          <h3>No matching medicines</h3>
          <p>Try another keyword or switch to a different category chip.</p>
        </div>
      `;
      return;
    }

    posProductGrid.innerHTML = filtered
      .map(
        (product) => `
          <article class="product-card">
            <div>
              <div class="product-top">
                <span class="stock-pill">${product.stock} pieces</span>

                <div class="price-block">
                  <strong>${formatMoney(product.price)}</strong>
                  <span>Per Piece</span>
                </div>
              </div>

              <h3 class="product-name">${product.name}</h3>
              <p class="product-generic">${product.generic}</p>
            </div>

            <div class="product-footer">
              <div class="product-meta">
                <span>SKU / Barcode</span>
                <strong>${product.sku}</strong>
              </div>

              <button class="product-add-btn" type="button" data-add-id="${product.id}" aria-label="Add ${product.name}">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
                </svg>
              </button>
            </div>
          </article>
        `
      )
      .join("");
  }

  function getCartItem(id) {
    return state.cart.find((item) => item.id === id);
  }

  function addToCart(id) {
    const product = products.find((item) => item.id === id);
    if (!product) return;

    const existing = getCartItem(id);

    if (existing) {
      if (existing.quantity < existing.stock) {
        existing.quantity += 1;
      } else {
        showToast("warning", "Stock limit reached", `${product.name} has no more available quantity to add.`);
      }
    } else {
      const genericParts = splitGenericText(product.generic);

      state.cart.push({
        id: product.id,
        name: product.name,
        generic: product.generic,
        genericName: genericParts.genericName,
        dosage: genericParts.dosage,
        price: product.price,
        stock: product.stock,
        sku: product.sku,
        batch: product.batch,
        quantity: 1
      });
    }

    renderCart();
  }

  function increaseItem(id) {
    const item = getCartItem(id);
    if (!item) return;

    if (item.quantity < item.stock) {
      item.quantity += 1;
      renderCart();
    } else {
      showToast("warning", "Maximum reached", `${item.name} has reached the available stock limit.`);
    }
  }

  function decreaseItem(id) {
    const item = getCartItem(id);
    if (!item) return;

    item.quantity -= 1;

    if (item.quantity <= 0) {
      state.cart = state.cart.filter((entry) => entry.id !== id);
    }

    renderCart();
  }

  function clearCart() {
    state.cart = [];
    renderCart();
  }

  function getSubtotal() {
    return state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  function getDiscountRate() {
    return DISCOUNTS[state.discountType]?.rate || 0;
  }

  function getDiscountAmount() {
    return getSubtotal() * getDiscountRate();
  }

  function getGrandTotal() {
    return Math.max(getSubtotal() - getDiscountAmount(), 0);
  }

  function getTendered() {
    const parsed = Number.parseFloat(amountTenderedInput?.value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  function syncSelectionStates() {
    paymentMethodGrid?.querySelectorAll("[data-payment-method]").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.paymentMethod === state.paymentMethod);
    });

    discountTypeGrid?.querySelectorAll("[data-discount-type]").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.discountType === state.discountType);
    });
  }

  function updateTenderedMode() {
    const total = getGrandTotal();

    if (!amountTenderedInput || !paymentHelpText) return;

    if (state.paymentMethod === "cash") {
      amountTenderedInput.disabled = false;
      amountTenderedInput.placeholder = "0.00";
      paymentHelpText.textContent = "Enter the amount received from the customer.";
      return;
    }

    amountTenderedInput.disabled = true;
    amountTenderedInput.value = total.toFixed(2);
    paymentHelpText.textContent = `For ${PAYMENT_METHODS[state.paymentMethod].label}, the tendered amount matches the total due.`;
  }

  function updatePaymentSummary() {
    const subtotal = getSubtotal();
    const discountAmount = getDiscountAmount();
    const grandTotal = getGrandTotal();
    const tendered = getTendered();
    const change = Math.max(tendered - grandTotal, 0);

    if (modalSubtotalValue) modalSubtotalValue.textContent = formatMoney(subtotal);
    if (modalDiscountValue) modalDiscountValue.textContent = formatMoney(discountAmount);
    if (modalTotalValue) modalTotalValue.textContent = formatMoney(grandTotal);
    if (modalGrandTotalValue) modalGrandTotalValue.textContent = formatMoney(grandTotal);
    if (changeValue) changeValue.textContent = formatMoney(change);

    if (completeSaleBtn) {
      if (state.paymentMethod === "cash") {
        completeSaleBtn.disabled = state.cart.length === 0 || tendered < grandTotal;
      } else {
        completeSaleBtn.disabled = state.cart.length === 0;
      }
    }
  }

  function renderCart() {
    const subtotal = getSubtotal();
    const discountAmount = getDiscountAmount();
    const grandTotal = getGrandTotal();
    const count = state.cart.reduce((sum, item) => sum + item.quantity, 0);

    if (cartItemCount) {
      cartItemCount.textContent = `${count} item${count === 1 ? "" : "s"} in cart`;
    }

    if (subtotalValue) subtotalValue.textContent = formatMoney(subtotal);
    if (discountValue) discountValue.textContent = formatMoney(discountAmount);
    if (totalValue) totalValue.textContent = formatMoney(grandTotal);
    if (openCheckoutBtn) openCheckoutBtn.disabled = state.cart.length === 0;

    if (!state.cart.length) {
      saleCartList.innerHTML = `
        <div class="cart-empty">
          <div class="cart-empty-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="9" cy="19" r="1.7" stroke="currentColor" stroke-width="1.7"></circle>
              <circle cx="18" cy="19" r="1.7" stroke="currentColor" stroke-width="1.7"></circle>
              <path d="M4 5h2l2.2 9.2a1 1 0 0 0 1 .8h8.7a1 1 0 0 0 1-.7L21 8H7.1" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
          </div>
          <strong>Your cart is empty</strong>
          <p>Select items from the list to start a transaction.</p>
        </div>
      `;
      updatePaymentSummary();
      return;
    }

    saleCartList.innerHTML = state.cart
      .map(
        (item) => `
          <article class="cart-item">
            <div class="cart-item-head">
              <div class="cart-item-title">
                <strong>${item.name}</strong>
                <span>Piece</span>
                <p>${formatMoney(item.price)} / Unit</p>
              </div>
              <div class="cart-item-price">${formatMoney(item.price * item.quantity)}</div>
            </div>

            <div class="cart-item-foot">
              <div class="cart-batch">Batch: ${item.batch}</div>

              <div class="qty-controls">
                <button class="qty-btn" type="button" data-decrease-id="${item.id}" aria-label="Decrease quantity">−</button>
                <span class="qty-value">${item.quantity}</span>
                <button class="qty-btn" type="button" data-increase-id="${item.id}" aria-label="Increase quantity">+</button>
              </div>
            </div>
          </article>
        `
      )
      .join("");

    updatePaymentSummary();
  }

  function openModal(modal) {
    if (!modal) return;
    modal.hidden = false;
    document.body.classList.add("has-open-dialog");
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.hidden = true;

    const hasOpenModal = [paymentModal, receiptModal].some((entry) => entry && !entry.hidden);
    if (!hasOpenModal) {
      document.body.classList.remove("has-open-dialog");
    }
  }

  function openCheckout() {
    if (!state.cart.length) return;

    syncSelectionStates();
    updateTenderedMode();

    if (state.paymentMethod === "cash" && amountTenderedInput) {
      amountTenderedInput.value = "";
    }

    updatePaymentSummary();
    openModal(paymentModal);

    if (amountTenderedInput && !amountTenderedInput.disabled) {
      setTimeout(() => amountTenderedInput.focus(), 50);
    }
  }

  function renderReceiptItems(items = []) {
    if (!receiptItemsBody) return;

    if (!items.length) {
      receiptItemsBody.innerHTML = `
        <tr>
          <td colspan="4">No items found.</td>
        </tr>
      `;
      return;
    }

    receiptItemsBody.innerHTML = items
      .map((item) => {
        const lineTotal = Number(item.quantity || 0) * Number(item.price || 0);

        return `
          <tr>
            <td>
              <span class="receipt-item-name">${item.name || "Medicine"}</span>
              <span class="receipt-item-sub">${item.genericName || ""}${item.dosage ? ` • ${item.dosage}` : ""}</span>
            </td>
            <td>${item.quantity || 0}</td>
            <td>${formatMoney(item.price || 0)}</td>
            <td>${formatMoney(lineTotal)}</td>
          </tr>
        `;
      })
      .join("");
  }

  function showReceiptModal(receiptData) {
    if (!receiptModal) return;

    if (receiptTransactionId) receiptTransactionId.textContent = receiptData.transactionId || "—";
    if (receiptDateTime) receiptDateTime.textContent = receiptData.dateTime || new Date().toLocaleString();
    if (receiptCashier) receiptCashier.textContent = receiptData.cashier || "System User";
    if (receiptPaymentMethod) receiptPaymentMethod.textContent = receiptData.paymentMethod || "Cash";
    if (receiptItemCount) receiptItemCount.textContent = `${receiptData.items?.length || 0} item(s)`;

    if (receiptSubtotal) receiptSubtotal.textContent = formatMoney(receiptData.subtotal || 0);
    if (receiptDiscountType) receiptDiscountType.textContent = receiptData.discountType || "No Discount";
    if (receiptDiscountAmount) receiptDiscountAmount.textContent = formatMoney(receiptData.discountAmount || 0);
    if (receiptAmountTendered) receiptAmountTendered.textContent = formatMoney(receiptData.amountTendered || 0);
    if (receiptChange) receiptChange.textContent = formatMoney(receiptData.change || 0);
    if (receiptTotalPaid) receiptTotalPaid.textContent = formatMoney(receiptData.total || 0);

    renderReceiptItems(receiptData.items || []);
    openModal(receiptModal);
  }

  function closeReceiptModal() {
    closeModal(receiptModal);
  }

  function printReceipt() {
    window.print();
  }

  function completeSale() {
    const subtotal = getSubtotal();
    const discountAmount = getDiscountAmount();
    const total = getGrandTotal();
    const tendered = state.paymentMethod === "cash" ? getTendered() : total;
    const change = Math.max(tendered - total, 0);
    const itemCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);

    const transactionId = `POS-${Date.now().toString().slice(-6)}`;
    const paymentLabel = PAYMENT_METHODS[state.paymentMethod].label;
    const discountLabel = DISCOUNTS[state.discountType].label;

    if (state.cart.length === 0) return;
    if (state.paymentMethod === "cash" && tendered < total) return;

    const receiptItems = state.cart.map((item) => ({
      name: item.name,
      genericName: item.genericName || splitGenericText(item.generic).genericName,
      dosage: item.dosage || splitGenericText(item.generic).dosage,
      quantity: item.quantity,
      price: item.price
    }));

    const receiptData = {
      transactionId,
      dateTime: new Date().toLocaleString(),
      cashier: window.POS_CURRENT_USER?.fullName || "System User",
      paymentMethod: paymentLabel,
      discountType: discountLabel,
      subtotal,
      discountAmount,
      total,
      amountTendered: tendered,
      change,
      items: receiptItems
    };

    closeModal(paymentModal);
    showReceiptModal(receiptData);

    showToast("success", "Sale completed", `Transaction ${transactionId} was processed successfully.`);

    state.cart = [];
    state.paymentMethod = "cash";
    state.discountType = "none";

    if (amountTenderedInput) {
      amountTenderedInput.value = "";
    }

    renderCart();
    syncSelectionStates();
  }

  function showToast(type, title, message) {
    if (!toastStack) return;

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M12 8v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
        <circle cx="12" cy="16.5" r="1" fill="currentColor"></circle>
        <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"></circle>
      </svg>
      <div class="toast-copy">
        <strong>${title}</strong>
        <p>${message}</p>
      </div>
    `;

    toastStack.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3200);
  }

  function renderNotifications() {
    if (!notificationList || !notificationCount) return;

    notificationCount.textContent = String(notifications.length);

    notificationList.innerHTML = notifications
      .map(
        (item) => `
          <div class="notification-item">
            <span class="notification-item-dot ${item.type}"></span>
            <div class="notification-item-copy">
              <strong>${item.title}</strong>
              <p>${item.message}</p>
              <span>${item.time}</span>
            </div>
          </div>
        `
      )
      .join("");
  }

  function renderQuickSearchResults(query = "") {
    if (!quickSearchResults) return;

    const keyword = query.trim().toLowerCase();

    const baseResults = [
      { label: "Open checkout", description: "Finalize the current cart transaction." },
      { label: "Cash payment", description: "Collect tendered amount and issue change." },
      { label: "Senior / PWD discount", description: "Apply a supported discount inside the payment modal." }
    ];

    const productResults = products
      .filter((product) => {
        if (!keyword) return true;
        return (
          product.name.toLowerCase().includes(keyword) ||
          product.generic.toLowerCase().includes(keyword) ||
          product.sku.toLowerCase().includes(keyword)
        );
      })
      .slice(0, 5)
      .map((product) => ({
        label: product.name,
        description: `${product.generic} • ${product.sku}`
      }));

    const results = keyword ? productResults : [...baseResults, ...productResults.slice(0, 3)];

    quickSearchResults.innerHTML = results.length
      ? results
          .map(
            (result) => `
              <div class="notification-item">
                <span class="notification-item-dot success"></span>
                <div class="notification-item-copy">
                  <strong>${result.label}</strong>
                  <p>${result.description}</p>
                </div>
              </div>
            `
          )
          .join("")
      : `
          <div class="notification-item">
            <span class="notification-item-dot warning"></span>
            <div class="notification-item-copy">
              <strong>No results found</strong>
              <p>Try another medicine name or SKU.</p>
            </div>
          </div>
        `;
  }

  posProductGrid?.addEventListener("click", (event) => {
    const addBtn = event.target.closest("[data-add-id]");
    if (!addBtn) return;

    addToCart(Number(addBtn.dataset.addId));
  });

  saleCartList?.addEventListener("click", (event) => {
    const decreaseBtn = event.target.closest("[data-decrease-id]");
    const increaseBtn = event.target.closest("[data-increase-id]");

    if (decreaseBtn) {
      decreaseItem(Number(decreaseBtn.dataset.decreaseId));
      return;
    }

    if (increaseBtn) {
      increaseItem(Number(increaseBtn.dataset.increaseId));
    }
  });

  categoryChips?.addEventListener("click", (event) => {
    const chip = event.target.closest("[data-category]");
    if (!chip) return;

    state.activeCategory = chip.dataset.category;

    categoryChips.querySelectorAll(".filter-chip").forEach((entry) => {
      entry.classList.remove("active");
    });

    chip.classList.add("active");
    renderProducts();
  });

  paymentMethodGrid?.addEventListener("click", (event) => {
    const btn = event.target.closest("[data-payment-method]");
    if (!btn) return;

    state.paymentMethod = btn.dataset.paymentMethod;
    syncSelectionStates();
    updateTenderedMode();
    updatePaymentSummary();
  });

  discountTypeGrid?.addEventListener("click", (event) => {
    const btn = event.target.closest("[data-discount-type]");
    if (!btn) return;

    state.discountType = btn.dataset.discountType;
    syncSelectionStates();
    updateTenderedMode();
    updatePaymentSummary();
    renderCart();
  });

  if (productSearchInput) {
    productSearchInput.addEventListener("input", (event) => {
      state.search = event.target.value;
      renderProducts();
    });
  }

  if (quickSearchInput) {
    quickSearchInput.addEventListener("input", (event) => {
      renderQuickSearchResults(event.target.value);
    });
  }

  if (markAllReadBtn) {
    markAllReadBtn.addEventListener("click", () => {
      notifications.length = 0;
      renderNotifications();
    });
  }

  clearCartBtn?.addEventListener("click", () => {
    if (!state.cart.length) return;
    clearCart();
    showToast("success", "Cart cleared", "The current sale has been reset.");
  });

  openCheckoutBtn?.addEventListener("click", openCheckout);
  amountTenderedInput?.addEventListener("input", updatePaymentSummary);
  completeSaleBtn?.addEventListener("click", completeSale);
  printReceiptBtn?.addEventListener("click", printReceipt);

  doneReceiptBtn?.addEventListener("click", () => {
    closeReceiptModal();
    productSearchInput?.focus();
  });

  document.querySelectorAll("[data-close-modal]").forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.getAttribute("data-close-modal");
      if (target === "paymentModal") closeModal(paymentModal);
      if (target === "receiptModal") closeReceiptModal();
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModal(paymentModal);
      closeReceiptModal();
    }
  });

  updateClock();
  setInterval(updateClock, 1000);

  renderProducts();
  renderCart();
  renderNotifications();
  renderQuickSearchResults();
  syncSelectionStates();
});