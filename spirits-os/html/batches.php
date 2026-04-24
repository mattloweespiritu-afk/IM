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
  <title>Spirit's OS | Batches</title>

  <link rel="stylesheet" href="../css/app-shell.css" />
  <link rel="stylesheet" href="../css/app-tools.css" />
  <link rel="stylesheet" href="../css/batches.css" />
</head>
<body class="batches-page">
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

              <a href="batches.php" class="nav-item active" aria-current="page">
                <span class="nav-icon">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3Z" stroke="currentColor" stroke-width="1.7"></path>
                    <path d="M4 7.5L12 12l8-4.5" stroke="currentColor" stroke-width="1.7"></path>
                  </svg>
                </span>
                <span>Batches</span>
                <span class="nav-arrow">›</span>
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
            <h2>Batches</h2>
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
                    <p>Search batches, sections, and actions.</p>
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
                    placeholder="Search sections and actions..."
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
            <span class="day" id="dayName">Tuesday</span>
            <span class="date" id="todayDate">Apr 14, 2026</span>
          </div>
        </div>
      </header>

      <main class="content-shell">
        <section
          class="batch-hero"
          id="overviewSection"
          data-search-title="Batch Traceability"
          data-search-description="FEFO overview, stock-in actions, and batch health summary"
          data-search-keywords="batches fefo batch traceability stock in archive expiry"
        >
          <div class="batch-hero__copy">
            <h1>Batch Traceability</h1>
            <p>Track pharmaceutical batches and ensure FEFO compliance across received stock.</p>
          </div>

          <div class="batch-hero__actions">
            <span class="fefo-pill">
              <span class="fefo-dot"></span>
              FEFO Active
            </span>

            <button type="button" class="btn btn--ghost" id="exportLogBtn">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 4v9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
                <path d="M8.5 10.5L12 14l3.5-3.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
                <path d="M5 18h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
              </svg>
              <span>Export Log</span>
            </button>

            <button type="button" class="btn btn--primary" id="openBatchModalBtn">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
              </svg>
              <span>Receive New Batch</span>
            </button>
          </div>
        </section>

        <section
          class="summary-grid"
          id="summarySection"
          data-search-title="Batch Summary"
          data-search-description="Expired, near expiry, and active batch metrics"
          data-search-keywords="batch summary expired near expiry active healthy cards"
        >
          <article class="summary-card summary-card--danger">
            <div class="summary-card__icon">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 4l8 14H4L12 4Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"></path>
                <path d="M12 9v4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
                <circle cx="12" cy="16.5" r=".8" fill="currentColor"></circle>
              </svg>
            </div>
            <div class="summary-card__content">
              <span class="summary-card__label">Expired Batches</span>
              <strong class="summary-card__value" id="expiredCount">0</strong>
              <span class="summary-card__meta">Immediate disposal review</span>
            </div>
          </article>

          <article class="summary-card summary-card--warning">
            <div class="summary-card__icon">
              <svg viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="1.8"></circle>
                <path d="M12 8v4l2.2 1.8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
              </svg>
            </div>
            <div class="summary-card__content">
              <span class="summary-card__label">Near Expiry (60d)</span>
              <strong class="summary-card__value" id="nearExpiryCount">0</strong>
              <span class="summary-card__meta">Prioritize FEFO sales</span>
            </div>
          </article>

          <article class="summary-card summary-card--success">
            <div class="summary-card__icon">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3Z" stroke="currentColor" stroke-width="1.7"></path>
                <path d="M4 7.5L12 12l8-4.5" stroke="currentColor" stroke-width="1.7"></path>
              </svg>
            </div>
            <div class="summary-card__content">
              <span class="summary-card__label">Active Batches</span>
              <strong class="summary-card__value" id="activeCount">0</strong>
              <span class="summary-card__meta">Healthy inventory in circulation</span>
            </div>
          </article>
        </section>

        <section
          class="controls-card"
          id="filtersSection"
          data-search-title="Batch Filters"
          data-search-description="Search, filter, and refine the batch ledger"
          data-search-keywords="search filters supplier stock level status batches"
        >
          <div class="controls-toolbar">
            <label class="ledger-search">
              <span class="ledger-search__icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.8"></circle>
                  <path d="M20 20L16.6 16.6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
                </svg>
              </span>
              <input
                type="text"
                id="batchSearchInput"
                placeholder="Search by batch number, medicine, or supplier..."
                autocomplete="off"
              />
            </label>

            <button type="button" class="btn btn--ghost btn--compact" id="toggleFiltersBtn" aria-expanded="false">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M5 7h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
                <path d="M8 12h8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
                <path d="M10 17h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
              </svg>
              <span>Filters</span>
            </button>
          </div>

          <div class="filters-grid" id="filtersGrid" hidden>
            <label class="field">
              <span class="field__label">Status</span>
              <select id="statusFilter">
                <option value="all">All statuses</option>
                <option value="healthy">Healthy</option>
                <option value="near-expiry">Near Expiry</option>
                <option value="expired">Expired</option>
                <option value="unknown">Unknown</option>
              </select>
            </label>

            <label class="field">
              <span class="field__label">Supplier</span>
              <select id="supplierFilter">
                <option value="all">All suppliers</option>
              </select>
            </label>

            <label class="field">
              <span class="field__label">Stock Level</span>
              <select id="stockFilter">
                <option value="all">All stock</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
                <option value="empty">Empty</option>
              </select>
            </label>

            <div class="filters-actions">
              <button type="button" class="btn btn--ghost btn--compact" id="resetFiltersBtn">
                Reset Filters
              </button>
            </div>
          </div>
        </section>

        <section
          class="ledger-card"
          id="ledgerSection"
          data-search-title="Batch Ledger"
          data-search-description="Batch table with stock, expiry, status, and actions"
          data-search-keywords="ledger table batch records stock expiration status actions"
        >
          <div class="ledger-card__head">
            <div>
              <h3>Batch Ledger</h3>
              <p>Received stock, expiry dates, and action controls</p>
            </div>

            <span class="ledger-meta" id="resultsText">Showing 0 to 0 of 0 batches</span>
          </div>

          <div class="table-wrap">
            <table class="batch-table">
              <thead>
                <tr>
                  <th>Batch Info</th>
                  <th>Medicine</th>
                  <th>Stock Level</th>
                  <th>Expiration</th>
                  <th>Status</th>
                  <th class="actions-col">Actions</th>
                </tr>
              </thead>
              <tbody id="batchTableBody"></tbody>
            </table>
          </div>
        </section>

        <div class="table-footer">
          <span class="footer-meta" id="footerMeta">Showing 0 to 0 of 0 batches</span>
          <div class="pagination" id="pagination"></div>
        </div>
      </main>
    </div>
  </div>

  <div class="menu-portal" id="menuPortal"></div>

  <div class="modal-backdrop" id="batchModal" hidden>
    <div class="modal modal--large" role="dialog" aria-modal="true" aria-labelledby="batchModalTitle">
      <div class="modal__hero">
        <div>
          <h3 id="batchModalTitle">Stock-In Batch</h3>
          <p id="batchModalSubtitle">Register new stock arrival with batch and expiry details.</p>
        </div>

        <button type="button" class="modal__close" id="closeBatchModalBtn" aria-label="Close batch modal">
          ×
        </button>
      </div>

      <form class="modal__body" id="batchForm">
        <div class="field field--full">
          <span class="field__label">Medicine</span>
          <select id="medicineSelect" required></select>
        </div>

        <div class="modal-grid">
          <label class="field">
            <span class="field__label">Batch / Lot Number</span>
            <input type="text" id="batchNumberInput" placeholder="e.g. LOT-2026-001" required />
          </label>

          <label class="field">
            <span class="field__label">Supplier</span>
            <select id="batchSupplierSelect" required></select>
          </label>

          <label class="field">
            <span class="field__label">Quantity Received</span>
            <input type="number" id="quantityInput" min="0" step="1" placeholder="0" required />
          </label>

          <label class="field">
            <span class="field__label">Unit Cost (₱)</span>
            <input type="number" id="unitCostInput" min="0" step="0.01" placeholder="0.00" required />
          </label>

          <label class="field field--full">
            <span class="field__label">Expiration Date</span>
            <input type="date" id="expiryInput" required />
          </label>
        </div>

        <div class="modal__footer">
          <button type="button" class="btn btn--text" id="cancelBatchModalBtn">Cancel</button>
          <button type="submit" class="btn btn--primary" id="submitBatchBtn">Confirm Stock-In</button>
        </div>
      </form>
    </div>
  </div>

  <div class="modal-backdrop" id="adjustModal" hidden>
    <div class="modal modal--small" role="dialog" aria-modal="true" aria-labelledby="adjustModalTitle">
      <div class="modal__header">
        <div>
          <h3 id="adjustModalTitle">Stock Adjustment</h3>
          <p>Update the on-hand quantity for the selected batch.</p>
        </div>

        <button type="button" class="modal__close modal__close--light" id="closeAdjustModalBtn" aria-label="Close stock adjustment modal">
          ×
        </button>
      </div>

      <form class="modal__body modal__body--compact" id="adjustForm">
        <label class="field">
          <span class="field__label">New Quantity</span>
          <input type="number" id="adjustQuantityInput" min="0" step="1" required />
        </label>

        <label class="field">
          <span class="field__label">Reason</span>
          <input type="text" id="adjustReasonInput" placeholder="e.g. Cycle count correction" required />
        </label>

        <div class="modal__footer">
          <button type="button" class="btn btn--text" id="cancelAdjustModalBtn">Cancel</button>
          <button type="submit" class="btn btn--primary">Save Adjustment</button>
        </div>
      </form>
    </div>
  </div>

  <div class="modal-backdrop" id="archiveModal" hidden>
    <div class="modal modal--small" role="dialog" aria-modal="true" aria-labelledby="archiveModalTitle">
      <div class="modal__header">
        <div>
          <h3 id="archiveModalTitle">Archive Batch</h3>
          <p>This will remove the batch from the active ledger view.</p>
        </div>

        <button type="button" class="modal__close modal__close--light" id="closeArchiveModalBtn" aria-label="Close archive modal">
          ×
        </button>
      </div>

      <div class="modal__body modal__body--compact">
        <p class="confirm-copy" id="archiveBatchText">
          You are about to archive this batch.
        </p>

        <div class="modal__footer">
          <button type="button" class="btn btn--text" id="cancelArchiveModalBtn">Cancel</button>
          <button type="button" class="btn btn--danger" id="confirmArchiveBtn">Archive Batch</button>
        </div>
      </div>
    </div>
  </div>

  <div class="toast-stack" id="toastStack"></div>

  <script src="../javascript/app-shell.js" defer></script>
  <script src="../javascript/app-tools.js" defer></script>
  <script src="../javascript/batches.js" defer></script>
</body>
</html>