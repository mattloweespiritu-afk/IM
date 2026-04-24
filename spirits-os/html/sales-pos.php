<?php
require_once __DIR__ . '/../php/auth/staff-or-admin.php';

function e(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
}

$sessionName = $_SESSION['full_name'] ?? 'System Administrator';
$sessionRole = strtoupper($_SESSION['role'] ?? 'staff');
$avatarLetter = strtoupper(substr(trim($sessionName), 0, 1));
$isAdmin = strtolower((string) ($_SESSION['role'] ?? '')) === 'admin';
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Spirit's OS | Sales / POS</title>
  <link rel="stylesheet" href="../css/app-shell.css" />
  <link rel="stylesheet" href="../css/app-tools.css" />
  <link rel="stylesheet" href="../css/sales-pos.css" />
</head>
<body class="sales-pos-page">
  <div class="app-shell">
    <div class="sidebar-backdrop" id="sidebarBackdrop"></div>

    <aside class="sidebar" id="appSidebar">
      <div class="sidebar-inner">
        <div class="sidebar-top">
          <a href="dashboard.php" class="brand-block">
            <div class="brand-mark">
              <img src="../images/pharmacy-logo.jpg" alt="Spirit's Pharmacy Logo" />
            </div>
            <div class="brand-text">
              <h1>SPIRIT'S OS</h1>
              <p>PHARMACY V1.0</p>
            </div>
          </a>

          <nav class="sidebar-nav">
            <div class="nav-group">
              <span class="nav-label">Operations</span>

              <a href="dashboard.php" class="nav-item">
                <span class="nav-icon">
                  <svg viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="3" width="7" height="7" rx="2" stroke="currentColor" stroke-width="1.8"></rect>
                    <rect x="14" y="3" width="7" height="7" rx="2" stroke="currentColor" stroke-width="1.8"></rect>
                    <rect x="3" y="14" width="7" height="7" rx="2" stroke="currentColor" stroke-width="1.8"></rect>
                    <rect x="14" y="14" width="7" height="7" rx="2" stroke="currentColor" stroke-width="1.8"></rect>
                  </svg>
                </span>
                <span>Dashboard</span>
              </a>

              <a href="sales-pos.php" class="nav-item active" aria-current="page">
                <span class="nav-icon">
                  <svg viewBox="0 0 24 24" fill="none">
                    <circle cx="9" cy="19" r="1.7" stroke="currentColor" stroke-width="1.7"></circle>
                    <circle cx="18" cy="19" r="1.7" stroke="currentColor" stroke-width="1.7"></circle>
                    <path d="M4 5h2l2.2 9.2a1 1 0 0 0 1 .8h8.7a1 1 0 0 0 1-.7L21 8H7.1" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"></path>
                  </svg>
                </span>
                <span>Sales / POS</span>
                <span class="nav-arrow">›</span>
              </a>

              <a href="medicines.php" class="nav-item">
                <span class="nav-icon">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M7 17l10-10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
                    <path d="M6.3 20.2a4.2 4.2 0 0 1 0-5.9l6-6a4.2 4.2 0 1 1 5.9 5.9l-6 6a4.2 4.2 0 0 1-5.9 0Z" stroke="currentColor" stroke-width="1.8"></path>
                  </svg>
                </span>
                <span>Medicines</span>
              </a>

              <a href="batches.php" class="nav-item">
                <span class="nav-icon">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3Z" stroke="currentColor" stroke-width="1.7"></path>
                    <path d="M4 7.5L12 12l8-4.5" stroke="currentColor" stroke-width="1.7"></path>
                  </svg>
                </span>
                <span>Batches</span>
              </a>

              <a href="stock-movements.php" class="nav-item">
                <span class="nav-icon">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M7 7h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
                    <path d="M7 12h10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
                    <path d="M7 17h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
                    <path d="M3 7h.01M3 12h.01M3 17h.01" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"></path>
                  </svg>
                </span>
                <span>Stock Movements</span>
              </a>

              <a href="expiration-alerts.php" class="nav-item">
                <span class="nav-icon">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M12 4l8 14H4L12 4Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"></path>
                    <path d="M12 9v4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
                    <circle cx="12" cy="16.5" r=".8" fill="currentColor"></circle>
                  </svg>
                </span>
                <span>Expiration Alerts</span>
              </a>
            </div>

            <div class="nav-group">
              <span class="nav-label">Finance</span>

              <a href="sales-history.php" class="nav-item">
                <span class="nav-icon">
                  <svg viewBox="0 0 24 24" fill="none">
                    <rect x="5" y="4" width="14" height="16" rx="2" stroke="currentColor" stroke-width="1.7"></rect>
                    <path d="M8 8h8M8 12h6M8 16h5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"></path>
                  </svg>
                </span>
                <span>Sales History</span>
              </a>

              <a href="expenses.php" class="nav-item">
                <span class="nav-icon">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M12 3v18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
                    <path d="M16 7.5c0-1.7-1.8-3-4-3s-4 1.3-4 3 1.8 3 4 3 4 1.3 4 3-1.8 3-4 3-4-1.3-4-3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
                  </svg>
                </span>
                <span>Expenses</span>
              </a>

              <?php if ($isAdmin): ?>
              <a href="reports.html" class="nav-item">
                <span class="nav-icon">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M5 19V9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
                    <path d="M12 19V5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
                    <path d="M19 19v-7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
                  </svg>
                </span>
                <span>Reports</span>
              </a>
              <?php endif; ?>
            </div>

            <?php if ($isAdmin): ?>
            <div class="nav-group">
              <span class="nav-label">Administration</span>

              <a href="categories.html" class="nav-item">
                <span class="nav-icon">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M6 6h12v12H6z" stroke="currentColor" stroke-width="1.7"></path>
                    <path d="M6 10h12" stroke="currentColor" stroke-width="1.7"></path>
                  </svg>
                </span>
                <span>Categories</span>
              </a>

              <a href="suppliers.html" class="nav-item">
                <span class="nav-icon">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M4 16h12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
                    <path d="M16 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" stroke="currentColor" stroke-width="1.8"></path>
                    <path d="M4 12h6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
                  </svg>
                </span>
                <span>Suppliers</span>
              </a>

              <a href="users.php" class="nav-item">
                <span class="nav-icon">
                  <svg viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="8" r="3.5" stroke="currentColor" stroke-width="1.8"></circle>
                    <path d="M5 19a7 7 0 0 1 14 0" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
                  </svg>
                </span>
                <span>Users</span>
              </a>

              <a href="audit-logs.html" class="nav-item">
                <span class="nav-icon">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M12 8v4l2.5 1.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
                    <circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="1.8"></circle>
                  </svg>
                </span>
                <span>Audit Logs</span>
              </a>

              <a href="backup-restore.html" class="nav-item">
                <span class="nav-icon">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M12 4v10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
                    <path d="M8.5 10.5L12 14l3.5-3.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
                    <rect x="4" y="17" width="16" height="3" rx="1.5" stroke="currentColor" stroke-width="1.8"></rect>
                  </svg>
                </span>
                <span>Backup / Restore</span>
              </a>

              <a href="settings.html" class="nav-item">
                <span class="nav-icon">
                  <svg viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.8"></circle>
                    <path d="M19.4 15a1 1 0 0 0 .2 1.1l.1.1a1.7 1.7 0 0 1-2.4 2.4l-.1-.1a1 1 0 0 0-1.1-.2 1 1 0 0 0-.6.9V19a1.7 1.7 0 1 1-3.4 0v-.2a1 1 0 0 0-.7-.9 1 1 0 0 0-1.1.2l-.1.1a1.7 1.7 0 0 1-2.4-2.4l.1-.1a1 1 0 0 0 .2-1.1 1 1 0 0 0-.9-.6H5a1.7 1.7 0 1 1 0-3.4h.2a1 1 0 0 0 .9-.7 1 1 0 0 0-.2-1.1l-.1-.1a1.7 1.7 0 0 1 2.4-2.4l.1.1a1 1 0 0 0 1.1.2 1 1 0 0 0 .6-.9V5a1.7 1.7 0 1 1 3.4 0v.2a1 1 0 0 0 .7.9 1 1 0 0 0 1.1-.2l.1-.1a1.7 1.7 0 0 1 2.4 2.4l-.1.1a1 1 0 0 0-.2 1.1 1 1 0 0 0 .9.6H19a1.7 1.7 0 1 1 0 3.4h-.2a1 1 0 0 0-.9.6Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"></path>
                  </svg>
                </span>
                <span>Settings</span>
              </a>
            </div>
            <?php endif; ?>
          </nav>
        </div>

        <div class="sidebar-bottom">
          <div class="user-card">
            <div class="user-avatar"><?php echo e($avatarLetter); ?></div>
            <div class="user-meta">
              <h4><?php echo e($sessionName); ?></h4>
              <p><?php echo e($sessionRole); ?></p>
            </div>
          </div>

          <a href="../php/logout.php" class="signout-link">
            <span class="nav-icon">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M10 17l5-5-5-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
                <path d="M15 12H4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
                <path d="M20 5v14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
              </svg>
            </span>
            <span>Sign Out</span>
          </a>
        </div>
      </div>
    </aside>

    <div class="main-shell">
      <header class="topbar">
        <div class="topbar-left">
          <button class="menu-toggle" id="menuToggle" aria-label="Toggle sidebar" aria-expanded="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M5 7h14M5 12h14M5 17h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
            </svg>
          </button>

          <div class="page-meta">
            <h2>Sales / POS</h2>
            <div class="live-time">
              <span class="time-dot"></span>
              <span id="liveClock">00:00:00</span>
            </div>
          </div>
        </div>

        <div class="topbar-right">
          <div class="app-tools">
            <div class="topbar-search" data-search-root>
              <button
                type="button"
                class="topbar-search-trigger"
                data-search-toggle
                aria-expanded="false"
                aria-label="Open quick search"
              >
                <span class="tool-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke-width="2">
                    <circle cx="11" cy="11" r="7"></circle>
                    <path d="M20 20L16.65 16.65"></path>
                  </svg>
                </span>
                <span class="topbar-search-placeholder">Quick search</span>
                <span class="topbar-search-shortcut">Ctrl + K</span>
              </button>

              <div class="tool-dropdown search-panel" data-search-panel hidden>
                <div class="tool-panel-header">
                  <div>
                    <h3>Quick search</h3>
                    <p>Search medicine cards, cart state, and payment actions.</p>
                  </div>

                  <button
                    type="button"
                    class="tool-close-button"
                    data-search-close
                    aria-label="Close quick search"
                  >
                    <span class="tool-icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke-width="2">
                        <path d="M18 6L6 18"></path>
                        <path d="M6 6L18 18"></path>
                      </svg>
                    </span>
                  </button>
                </div>

                <label class="search-input-wrap">
                  <span class="tool-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke-width="2">
                      <circle cx="11" cy="11" r="7"></circle>
                      <path d="M20 20L16.65 16.65"></path>
                    </svg>
                  </span>
                  <input
                    type="text"
                    class="search-input-field"
                    data-search-input
                    placeholder="Search medicine names, SKU, cart, checkout..."
                    autocomplete="off"
                  />
                </label>

                <div class="search-results" data-search-results></div>
              </div>
            </div>

            <div class="topbar-notifications" data-notification-root>
              <button
                type="button"
                class="topbar-tool"
                data-notification-toggle
                aria-expanded="false"
                aria-label="Open notifications"
              >
                <span class="tool-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke-width="2">
                    <path d="M15 17H5.5C4.67 17 4 16.33 4 15.5V14.8C4 14.34 4.21 13.91 4.56 13.63L5.5 12.9V9.5C5.5 6.46 7.96 4 11 4C14.04 4 16.5 6.46 16.5 9.5V12.9L17.44 13.63C17.79 13.91 18 14.34 18 14.8V15.5C18 16.33 17.33 17 16.5 17H15Z"></path>
                    <path d="M9 20C9.34 20.62 10.07 21 11 21C11.93 21 12.66 20.62 13 20"></path>
                    <path d="M18 8C18.93 8 19.68 8.75 19.68 9.68C19.68 10.61 18.93 11.36 18 11.36"></path>
                  </svg>
                </span>
                <span class="notification-badge" data-notification-count>0</span>
              </button>

              <div class="tool-dropdown notification-panel" data-notification-panel hidden>
                <div class="tool-panel-header">
                  <div>
                    <h3>Notifications</h3>
                    <p>POS reminders and recent activity.</p>
                  </div>
                  <button type="button" class="tool-text-button" data-mark-all-read>
                    Mark all as read
                  </button>
                </div>

                <div class="notification-list" data-notification-list></div>
              </div>
            </div>
          </div>

          <div class="date-chip">
            <span class="day" id="dayName">Monday</span>
            <span class="date" id="todayDate">Apr 13, 2026</span>
          </div>
        </div>
      </header>

      <main class="content-shell sales-pos-content">
        <section class="pos-hero">
          <div class="pos-copy">
            <h1>Point of Sale</h1>
            <p>Spirit's Drugstore Terminal #1</p>
          </div>

          <div class="pos-hero-meta">
            <div class="sync-pill">
              <span class="sync-dot"></span>
              <span>System Online</span>
            </div>

            <div class="avatar-stack" aria-hidden="true">
              <span class="stack-avatar">M</span>
              <span class="stack-avatar">A</span>
              <span class="stack-avatar">S</span>
            </div>
          </div>
        </section>

        <section class="pos-toolbar">
          <label class="pos-search">
            <span class="pos-search-icon">
              <svg viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="6" stroke="currentColor" stroke-width="1.8"></circle>
                <path d="M20 20l-3.5-3.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
              </svg>
            </span>
            <input
              type="search"
              id="productSearchInput"
              placeholder="Scan barcode or search medicine..."
              autocomplete="off"
            />
            <span class="search-shortcut">⌘ K</span>
          </label>

          <div class="chip-row" id="categoryChips">
            <button type="button" class="filter-chip active" data-category="all">All Items</button>
            <button type="button" class="filter-chip" data-category="Analgesics">Analgesics</button>
            <button type="button" class="filter-chip" data-category="Antibiotics">Antibiotics</button>
            <button type="button" class="filter-chip" data-category="Vitamins">Vitamins</button>
          </div>

          <div class="catalog-meta">
            <span id="catalogCount">0 items available</span>
          </div>
        </section>

        <section class="pos-layout">
          <div class="catalog-shell">
            <div class="product-grid" id="posProductGrid"></div>
          </div>

          <aside class="sale-shell">
            <div class="sale-head">
              <div class="sale-title-wrap">
                <span class="sale-badge">
                  <svg viewBox="0 0 24 24" fill="none">
                    <circle cx="9" cy="19" r="1.7" stroke="currentColor" stroke-width="1.7"></circle>
                    <circle cx="18" cy="19" r="1.7" stroke="currentColor" stroke-width="1.7"></circle>
                    <path d="M4 5h2l2.2 9.2a1 1 0 0 0 1 .8h8.7a1 1 0 0 0 1-.7L21 8H7.1" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"></path>
                  </svg>
                </span>
                <div>
                  <h3>Current Sale</h3>
                  <p id="cartItemCount">0 items in cart</p>
                </div>
              </div>

              <button class="sale-clear-btn" type="button" id="clearCartBtn" aria-label="Clear cart">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M5 7h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
                  <path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
                  <path d="M7 7l.7 11.2A2 2 0 0 0 9.7 20h4.6a2 2 0 0 0 2-1.8L17 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
                </svg>
              </button>
            </div>

            <div class="sale-body" id="saleCartList">
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
            </div>

            <div class="sale-foot">
              <div class="sale-total-grid">
                <div class="sale-total-row subdued">
                  <span>Subtotal</span>
                  <strong id="subtotalValue">₱0.00</strong>
                </div>

                <div class="sale-total-row subdued">
                  <span>Discount</span>
                  <strong id="discountValue">₱0.00</strong>
                </div>

                <div class="sale-total-row total">
                  <span>Total Amount</span>
                  <strong id="totalValue">₱0.00</strong>
                </div>
              </div>

              <button class="checkout-btn" type="button" id="openCheckoutBtn" disabled>
                <span>Proceed to Checkout</span>
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
                  <path d="M13 7l5 5-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
              </button>
            </div>
          </aside>
        </section>
      </main>
    </div>
  </div>

  <div class="pos-modal" id="paymentModal" hidden>
    <div class="pos-modal-backdrop" data-close-modal="paymentModal"></div>

    <div class="pos-modal-card payment-card" role="dialog" aria-modal="true" aria-labelledby="paymentModalTitle">
      <div class="payment-head">
        <div>
          <h3 id="paymentModalTitle">Payment Details</h3>
          <p>Finalize transaction</p>
        </div>

        <button class="payment-close" type="button" data-close-modal="paymentModal" aria-label="Close payment modal">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
            <path d="M6 6L18 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
          </svg>
        </button>

        <div class="payment-head-graphic" aria-hidden="true"></div>
      </div>

      <div class="payment-body">
        <div class="payable-card">
          <div>
            <span>Total Payable</span>
            <strong id="modalTotalValue">₱0.00</strong>
          </div>

          <div class="payable-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 3v18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
              <path d="M16 7.5c0-1.7-1.8-3-4-3s-4 1.3-4 3 1.8 3 4 3 4 1.3 4 3-1.8 3-4 3-4-1.3-4-3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
            </svg>
          </div>
        </div>

        <div class="payment-section">
          <div class="section-label">Payment Method</div>
          <div class="selection-grid" id="paymentMethodGrid">
            <button type="button" class="selection-chip active" data-payment-method="cash">Cash</button>
            <button type="button" class="selection-chip" data-payment-method="gcash">GCash</button>
            <button type="button" class="selection-chip" data-payment-method="card">Card</button>
          </div>
        </div>

        <div class="payment-section">
          <div class="section-label">Discount Type</div>
          <div class="selection-grid" id="discountTypeGrid">
            <button type="button" class="selection-chip active" data-discount-type="none">No Discount</button>
            <button type="button" class="selection-chip" data-discount-type="senior">Senior Citizen</button>
            <button type="button" class="selection-chip" data-discount-type="pwd">PWD</button>
          </div>
        </div>

        <label class="payment-field">
          <span>Amount Tendered</span>
          <div class="payment-input-wrap">
            <span class="peso-symbol">₱</span>
            <input type="number" id="amountTenderedInput" min="0" step="0.01" placeholder="0.00" />
          </div>
          <small class="payment-help" id="paymentHelpText">Enter the amount received from the customer.</small>
        </label>

        <div class="payment-summary">
          <div class="payment-summary-row">
            <span>Subtotal</span>
            <strong id="modalSubtotalValue">₱0.00</strong>
          </div>

          <div class="payment-summary-row">
            <span>Discount</span>
            <strong id="modalDiscountValue">₱0.00</strong>
          </div>

          <div class="payment-summary-row emphasize">
            <span>Total Due</span>
            <strong id="modalGrandTotalValue">₱0.00</strong>
          </div>

          <div class="payment-summary-row">
            <span>Change</span>
            <strong id="changeValue">₱0.00</strong>
          </div>
        </div>
      </div>

      <div class="payment-foot">
        <button class="payment-cancel" type="button" data-close-modal="paymentModal">Cancel</button>
        <button class="payment-complete" type="button" id="completeSaleBtn" disabled>Complete Sale</button>
      </div>
    </div>
  </div>

  <div class="pos-modal" id="receiptModal" hidden>
    <div class="pos-modal-backdrop" data-close-modal="receiptModal"></div>

    <div class="pos-modal-card receipt-card" role="dialog" aria-modal="true" aria-labelledby="receiptModalTitle">
      <div class="receipt-head">
        <div class="receipt-brand">
          <div class="receipt-brand-mark">
            <img src="../images/pharmacy-logo.jpg" alt="Spirit's Pharmacy Logo" />
          </div>
          <div>
            <h3 id="receiptModalTitle">Spirit's Drugstore</h3>
            <p>Official Sales Receipt</p>
          </div>
        </div>

        <button class="payment-close" type="button" data-close-modal="receiptModal" aria-label="Close receipt modal">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
            <path d="M6 6L18 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
          </svg>
        </button>
      </div>

      <div class="receipt-body" id="receiptPrintableArea">
        <div class="receipt-status">
          <div class="receipt-status-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
          </div>
          <div>
            <strong>Sale Completed</strong>
            <p>Transaction recorded successfully.</p>
          </div>
        </div>

        <div class="receipt-meta-grid">
          <div class="receipt-meta-item">
            <span>Transaction No.</span>
            <strong id="receiptTransactionId">—</strong>
          </div>
          <div class="receipt-meta-item">
            <span>Date & Time</span>
            <strong id="receiptDateTime">—</strong>
          </div>
          <div class="receipt-meta-item">
            <span>Cashier</span>
            <strong id="receiptCashier">—</strong>
          </div>
          <div class="receipt-meta-item">
            <span>Payment Method</span>
            <strong id="receiptPaymentMethod">—</strong>
          </div>
        </div>

        <div class="receipt-items-card">
          <div class="receipt-items-head">
            <span>Items Purchased</span>
            <span id="receiptItemCount">0 items</span>
          </div>

          <div class="receipt-items-table-wrap">
            <table class="receipt-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody id="receiptItemsBody"></tbody>
            </table>
          </div>
        </div>

        <div class="receipt-summary-card">
          <div class="receipt-summary-row">
            <span>Subtotal</span>
            <strong id="receiptSubtotal">₱0.00</strong>
          </div>
          <div class="receipt-summary-row">
            <span>Discount Type</span>
            <strong id="receiptDiscountType">No Discount</strong>
          </div>
          <div class="receipt-summary-row">
            <span>Discount Amount</span>
            <strong id="receiptDiscountAmount">₱0.00</strong>
          </div>
          <div class="receipt-summary-row">
            <span>Amount Tendered</span>
            <strong id="receiptAmountTendered">₱0.00</strong>
          </div>
          <div class="receipt-summary-row">
            <span>Change</span>
            <strong id="receiptChange">₱0.00</strong>
          </div>
          <div class="receipt-summary-row total">
            <span>Total Paid</span>
            <strong id="receiptTotalPaid">₱0.00</strong>
          </div>
        </div>

        <div class="receipt-footer-note">
          <p>Thank you for choosing Spirit's Drugstore.</p>
          <small>Please keep this receipt for reference and return transactions.</small>
        </div>
      </div>

      <div class="receipt-foot">
        <button class="payment-cancel" type="button" data-close-modal="receiptModal">Close</button>
        <button class="payment-cancel receipt-print-btn" type="button" id="printReceiptBtn">Print Receipt</button>
        <button class="payment-complete" type="button" id="doneReceiptBtn">Done / New Sale</button>
      </div>
    </div>
  </div>

  <div class="toast-stack" id="toastStack" aria-live="polite" aria-atomic="true"></div>

  <script>
    window.POS_CURRENT_USER = {
      fullName: <?php echo json_encode($sessionName); ?>,
      role: <?php echo json_encode($sessionRole); ?>
    };
  </script>

  <script src="../javascript/app-shell.js" defer></script>
  <script src="../javascript/app-tools.js" defer></script>
  <script src="../javascript/sales-pos.js" defer></script>
</body>
</html>