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
  <title>Spirit's OS | Dashboard</title>

  <link rel="stylesheet" href="../css/app-shell.css" />
  <link rel="stylesheet" href="../css/app-tools.css" />
  <link rel="stylesheet" href="../css/dashboard.css" />
</head>
<body class="dashboard-page">
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

          <a href="dashboard.php" class="nav-item active" aria-current="page">
            <span class="nav-icon">
              <svg viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="7" height="7" rx="2" stroke="currentColor" stroke-width="1.8"></rect>
                <rect x="14" y="3" width="7" height="7" rx="2" stroke="currentColor" stroke-width="1.8"></rect>
                <rect x="3" y="14" width="7" height="7" rx="2" stroke="currentColor" stroke-width="1.8"></rect>
                <rect x="14" y="14" width="7" height="7" rx="2" stroke="currentColor" stroke-width="1.8"></rect>
              </svg>
            </span>
            <span>Dashboard</span>
            <span class="nav-arrow">›</span>
          </a>

          <a href="sales-pos.php" class="nav-item">
            <span class="nav-icon">
              <svg viewBox="0 0 24 24" fill="none">
                <circle cx="9" cy="19" r="1.7" stroke="currentColor" stroke-width="1.7"></circle>
                <circle cx="18" cy="19" r="1.7" stroke="currentColor" stroke-width="1.7"></circle>
                <path d="M4 5h2l2.2 9.2a1 1 0 0 0 1 .8h8.7a1 1 0 0 0 1-.7L21 8H7.1" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
            </span>
            <span>Sales / POS</span>
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

          <a href="stock-movements.html" class="nav-item">
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

          <a href="expiration-alerts.html" class="nav-item">
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

          <a href="sales-history.html" class="nav-item">
            <span class="nav-icon">
              <svg viewBox="0 0 24 24" fill="none">
                <rect x="5" y="4" width="14" height="16" rx="2" stroke="currentColor" stroke-width="1.7"></rect>
                <path d="M8 8h8M8 12h6M8 16h5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"></path>
              </svg>
            </span>
            <span>Sales History</span>
          </a>

          <a href="expenses.html" class="nav-item">
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
            <h2>Dashboard</h2>
            <div class="live-time">
              <span class="time-dot"></span>
              <span id="liveClock">00:00:00</span>
            </div>
          </div>
        </div>

        <div class="topbar-right">
          <div class="app-tools">
            <div class="topbar-search" data-search-root>
              <button type="button" class="topbar-search-trigger" data-search-toggle aria-expanded="false" aria-label="Open quick search">
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
                    <p>Search pages, sections, and actions.</p>
                  </div>
                  <button type="button" class="tool-close-button" data-search-close aria-label="Close quick search">
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
                    placeholder="Search inventory, revenue, transactions, POS..."
                    autocomplete="off"
                  />
                </label>

                <div class="search-results" data-search-results></div>
              </div>
            </div>

            <div class="topbar-notifications" data-notification-root>
              <button type="button" class="topbar-tool" data-notification-toggle aria-expanded="false" aria-label="Open notifications">
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
                    <p>Alerts, reminders, and quick jumps.</p>
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
            <span class="day" id="dayName">Sunday</span>
            <span class="date" id="todayDate">Apr 12, 2026</span>
          </div>
        </div>
      </header>

      <main class="content-shell dashboard-content">
        <section
          class="overview-head"
          id="overviewSection"
          data-search-title="Operational Overview"
          data-search-description="KPI cards, overview metrics, and alert summaries"
          data-search-keywords="dashboard overview kpi metrics alerts summary performance"
        >
          <div class="overview-copy">
            <h1>Operational Overview</h1>
            <p>Real-time performance and inventory health</p>
          </div>

          <div class="overview-actions">
            <button class="ghost-btn" type="button">
              <svg viewBox="0 0 24 24" fill="none">
                <rect x="4" y="5" width="16" height="15" rx="2" stroke="currentColor" stroke-width="1.7"></rect>
                <path d="M8 3v4M16 3v4M4 10h16" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"></path>
              </svg>
              <span>Last 30 Days</span>
            </button>

            <div class="quick-action-wrap">
              <button class="primary-btn" id="quickActionBtn" type="button">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M13 3L4 14h6l-1 7 9-11h-6l1-7Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"></path>
                </svg>
                <span>Quick Action</span>
              </button>

              <div class="quick-action-menu" id="quickActionMenu">
                <a href="medicines.html">Add Medicine</a>
                <a href="batches.html">New Batch</a>
                <a href="sales-pos.html#currentSaleSection">Start Sale</a>
                <a href="expenses.html">Record Expense</a>
              </div>
            </div>
          </div>
        </section>

        <section class="stats-grid" aria-label="Dashboard metrics">
          <article class="metric-card">
            <div class="metric-top">
              <span class="metric-icon success">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M12 3v18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
                  <path d="M16 7.5c0-1.7-1.8-3-4-3s-4 1.3-4 3 1.8 3 4 3 4 1.3 4 3-1.8 3-4 3-4-1.3-4-3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
                </svg>
              </span>
              <span class="metric-badge good">↑ +12.5%</span>
            </div>
            <span class="metric-label">Today's Revenue</span>
            <h3>₱20</h3>
          </article>

          <article class="metric-card">
            <div class="metric-top">
              <span class="metric-icon info">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M5 16l5-5 3 3 6-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
                  <path d="M15 8h4v4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
              </span>
              <span class="metric-badge good">↑ +8.2%</span>
            </div>
            <span class="metric-label">Monthly Sales</span>
            <h3>₱20</h3>
          </article>

          <article class="metric-card">
            <div class="metric-top">
              <span class="metric-icon danger">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M7 16l5-5 3 3 4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
                  <path d="M15 10h4v-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
              </span>
              <span class="metric-badge bad">↓ -2.4%</span>
            </div>
            <span class="metric-label">Total Expenses</span>
            <h3>₱11</h3>
          </article>

          <article class="metric-card">
            <div class="metric-top">
              <span class="metric-icon warning">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3Z" stroke="currentColor" stroke-width="1.8"></path>
                </svg>
              </span>
              <span class="metric-tag">Units</span>
            </div>
            <span class="metric-label">Active Inventory</span>
            <h3>10,000,446</h3>
          </article>
        </section>

        <section class="alert-grid" aria-label="Dashboard alerts">
          <article class="alert-card critical">
            <div class="alert-top">
              <span class="alert-icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M12 4l8 14H4L12 4Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"></path>
                  <path d="M12 9v4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
                  <circle cx="12" cy="16.5" r=".8" fill="currentColor"></circle>
                </svg>
              </span>
              <strong>1</strong>
            </div>
            <h4>Critical Expiry</h4>
            <p>Batches have already expired and must be disposed.</p>
            <a href="expiration-alerts.html">Take Action ›</a>
          </article>

          <article class="alert-card warning">
            <div class="alert-top">
              <span class="alert-icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M12 4l8 14H4L12 4Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"></path>
                  <path d="M12 9v4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
                  <circle cx="12" cy="16.5" r=".8" fill="currentColor"></circle>
                </svg>
              </span>
              <strong>0</strong>
            </div>
            <h4>Near Expiry</h4>
            <p>Items expiring within your set threshold (60 days).</p>
            <a href="expiration-alerts.html">Take Action ›</a>
          </article>

          <article class="alert-card info">
            <div class="alert-top">
              <span class="alert-icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M12 4l8 14H4L12 4Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"></path>
                </svg>
              </span>
              <strong>1</strong>
            </div>
            <h4>Low Stock</h4>
            <p>Medicines below their reorder level.</p>
            <a href="medicines.html">Take Action ›</a>
          </article>
        </section>

        <section class="chart-grid">
          <article
            class="chart-card"
            id="revenueSection"
            data-search-title="Revenue vs Expenses"
            data-search-description="Weekly financial performance comparison chart"
            data-search-keywords="revenue expenses chart finance weekly comparison"
          >
            <div class="chart-head">
              <div>
                <h3>Revenue vs Expenses</h3>
                <p>Weekly financial performance comparison</p>
              </div>
            </div>
            <canvas id="revenueChart" class="chart-canvas" aria-label="Revenue versus expenses chart"></canvas>
          </article>

          <article
            class="chart-card"
            id="inventorySection"
            data-search-title="Inventory Distribution"
            data-search-description="Stock level chart and inventory health area"
            data-search-keywords="inventory stock medicines categories distribution low stock expiry"
          >
            <div class="chart-head">
              <div>
                <h3>Inventory Distribution</h3>
                <p>Stock levels by category</p>
              </div>
            </div>
            <canvas id="inventoryChart" class="chart-canvas" aria-label="Inventory distribution chart"></canvas>
          </article>
        </section>

        <section class="dashboard-bottom-grid">
          <article
            class="table-card"
            id="transactionsSection"
            data-search-title="Recent Transactions"
            data-search-description="Latest sales history and cashier activity"
            data-search-keywords="transactions recent sales history cashier activity"
          >
            <div class="section-head">
              <div>
                <h3>Recent Transactions</h3>
                <p>Latest sales and financial activity</p>
              </div>
              <a href="sales-history.html">View All</a>
            </div>

            <div class="table-wrap">
              <table class="mini-table">
                <thead>
                  <tr>
                    <th>Transaction</th>
                    <th>Cashier</th>
                    <th>Time</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>#TXN-1001</td>
                    <td>System Admin</td>
                    <td>08:10 AM</td>
                    <td>₱20.00</td>
                    <td><span class="status-badge success">Completed</span></td>
                  </tr>
                  <tr>
                    <td>#TXN-1002</td>
                    <td>System Admin</td>
                    <td>09:42 AM</td>
                    <td>₱11.00</td>
                    <td><span class="status-badge muted">Recorded</span></td>
                  </tr>
                  <tr>
                    <td>#TXN-1003</td>
                    <td>System Admin</td>
                    <td>11:05 AM</td>
                    <td>₱18.00</td>
                    <td><span class="status-badge success">Completed</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </article>

          <article
            class="queue-card"
            id="priorityQueueSection"
            data-search-title="Priority Inventory Queue"
            data-search-description="Items that need immediate attention today"
            data-search-keywords="priority queue attention low stock expiry urgent"
          >
            <div class="section-head">
              <div>
                <h3>Priority Inventory Queue</h3>
                <p>Items that need attention today</p>
              </div>
              <a href="medicines.html">Manage</a>
            </div>

            <div class="queue-list">
              <div class="queue-item">
                <div class="queue-copy">
                  <strong>Biogesic</strong>
                  <span>Low stock threshold reached</span>
                </div>
                <span class="queue-tag info">Low Stock</span>
              </div>

              <div class="queue-item">
                <div class="queue-copy">
                  <strong>Amoxil Batch A-103</strong>
                  <span>Expiry review required</span>
                </div>
                <span class="queue-tag danger">Expiry</span>
              </div>

              <div class="queue-item">
                <div class="queue-copy">
                  <strong>Ceelin</strong>
                  <span>Reorder soon to avoid shortage</span>
                </div>
                <span class="queue-tag warning">Reorder</span>
              </div>
            </div>
          </article>
        </section>
      </main>
    </div>
  </div>

  <script src="../javascript/app-shell.js" defer></script>
  <script src="../javascript/app-tools.js" defer></script>
  <script src="../javascript/dashboard.js" defer></script>
</body>
</html>