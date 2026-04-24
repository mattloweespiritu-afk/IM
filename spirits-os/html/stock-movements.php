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
  <title>Spirit's OS | Stock Movements</title>

  <link rel="stylesheet" href="../css/app-shell.css" />
  <link rel="stylesheet" href="../css/app-tools.css" />
  <link rel="stylesheet" href="../css/stock-movements.css" />
</head>
<body class="stock-movements-page">
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

              <a href="batches.php" class="nav-item">
                <span class="nav-icon">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3Z" stroke="currentColor" stroke-width="1.7"></path>
                    <path d="M4 7.5L12 12l8-4.5" stroke="currentColor" stroke-width="1.7"></path>
                  </svg>
                </span>
                <span>Batches</span>
              </a>

              <a href="stock-movements.php" class="nav-item active" aria-current="page">
                <span class="nav-icon">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M7 7h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
                    <path d="M7 12h10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
                    <path d="M7 17h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
                    <path d="M3 7h.01M3 12h.01M3 17h.01" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"></path>
                  </svg>
                </span>
                <span>Stock Movements</span>
                <span class="nav-arrow">›</span>
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
            <h2>Stock Movements</h2>
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
                    <p>Search movement sections, filters, and actions.</p>
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
                    placeholder="Search stock movements..."
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
                    <p>Recent movement activity and audit reminders.</p>
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
            <span class="day" id="dayName">Wednesday</span>
            <span class="date" id="todayDate">Apr 15, 2026</span>
          </div>
        </div>
      </header>

      <main class="content-shell stock-movements-content">
        <section
          class="movement-hero"
          id="movementOverviewSection"
          data-search-title="Inventory Logistics"
          data-search-description="Stock inflow and outflow monitoring"
          data-search-keywords="stock movements logistics stock in stock out audit export adjustment reverse"
        >
          <div class="movement-hero__copy">
            <h1>Inventory Logistics</h1>
            <p>Real-time tracking of all stock inflows and outflows</p>
          </div>

          <div class="movement-hero__actions">
            <button type="button" class="ghost-btn" id="exportLedgerBtn">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 4v9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
                <path d="M8.5 10.5L12 14l3.5-3.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
                <path d="M5 18h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
              </svg>
              <span>Export Ledger</span>
            </button>

            <button type="button" class="primary-btn" id="openAuditModalBtn">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 6v12M6 12h12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
              </svg>
              <span>Stock Audit</span>
            </button>
          </div>
        </section>

        <section
          class="movement-stats"
          id="movementStatsSection"
          data-search-title="Movement Summary"
          data-search-description="Stock in, stock out, and net movement totals"
          data-search-keywords="stock in stock out net movement summary stats"
        >
          <article class="movement-stat-card stat-in">
            <div class="movement-stat-card__icon">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M7 17L17 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
                <path d="M9 7h8v8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
            </div>
            <div class="movement-stat-card__copy">
              <span>Total Stock In</span>
              <strong id="totalStockIn">0 units</strong>
            </div>
          </article>

          <article class="movement-stat-card stat-out">
            <div class="movement-stat-card__icon">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M7 7l10 10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
                <path d="M15 17H7V9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
            </div>
            <div class="movement-stat-card__copy">
              <span>Total Stock Out</span>
              <strong id="totalStockOut">0 units</strong>
            </div>
          </article>

          <article class="movement-stat-card stat-net">
            <div class="movement-stat-card__icon">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M5 12h4l2-5 3 10 2-5h3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
            </div>
            <div class="movement-stat-card__copy">
              <span>Net Movement</span>
              <strong id="netMovement">0 units</strong>
            </div>
          </article>
        </section>

        <section
          class="movement-controls-card"
          id="movementFilterSection"
          data-search-title="Movement Filters"
          data-search-description="Search, type filter, and date range filter"
          data-search-keywords="search movement type date range filters"
        >
          <div class="movement-controls">
            <label class="movement-search">
              <span class="movement-search__icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="6" stroke="currentColor" stroke-width="1.8"></circle>
                  <path d="M20 20l-3.5-3.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
                </svg>
              </span>
              <input
                type="search"
                id="movementSearchInput"
                placeholder="Search by medicine name or reference number..."
                autocomplete="off"
              />
            </label>

            <div class="movement-controls__actions">
              <div class="field-select compact-select">
                <select id="movementTypeFilter">
                  <option value="all">All</option>
                  <option value="stock-in">Stock In</option>
                  <option value="stock-out">Stock Out</option>
                  <option value="adjustment">Adjustment</option>
                  <option value="audit">Audit</option>
                  <option value="reversal">Reversal</option>
                </select>
              </div>

              <button type="button" class="ghost-btn compact-btn" id="toggleDateRangeBtn" aria-expanded="false">
                <svg viewBox="0 0 24 24" fill="none">
                  <rect x="4" y="5" width="16" height="15" rx="2" stroke="currentColor" stroke-width="1.8"></rect>
                  <path d="M8 3v4M16 3v4M4 10h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
                </svg>
                <span>Date Range</span>
              </button>
            </div>
          </div>

          <div class="date-range-panel" id="dateRangePanel" hidden>
            <label class="field">
              <span>From Date</span>
              <input type="date" id="fromDateInput" />
            </label>

            <label class="field">
              <span>To Date</span>
              <input type="date" id="toDateInput" />
            </label>

            <div class="date-range-panel__actions">
              <button type="button" class="secondary-btn" id="clearDateRangeBtn">Clear Range</button>
            </div>
          </div>
        </section>

        <section
          class="movement-ledger-card"
          id="movementLedgerSection"
          data-search-title="Movement Ledger"
          data-search-description="Inventory movement table and row actions"
          data-search-keywords="movement ledger table quantity reason reference actions adjustment reverse"
        >
          <div class="table-wrap">
            <table class="movement-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Movement Type</th>
                  <th>Medicine Details</th>
                  <th>Quantity</th>
                  <th>Reason / Reference</th>
                  <th class="actions-col">Actions</th>
                </tr>
              </thead>
              <tbody id="movementTableBody"></tbody>
            </table>
          </div>
        </section>

        <div class="movement-footer">
          <span class="movement-footer__meta" id="movementResultsMeta">Showing 0 to 0 of 0 entries</span>
          <div class="pagination" id="movementPagination"></div>
        </div>
      </main>
    </div>
  </div>

  <div class="menu-portal" id="menuPortal"></div>

  <div class="dialog-backdrop" id="auditModal" hidden>
    <div class="dialog-card dialog-md" role="dialog" aria-modal="true" aria-labelledby="auditModalTitle">
      <div class="dialog-head">
        <div>
          <h3 id="auditModalTitle">Stock Audit Entry</h3>
          <p>Create a new ledger entry for audit, correction, or manual stock movement.</p>
        </div>
        <button class="dialog-close" type="button" id="closeAuditModalBtn" aria-label="Close">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
            <path d="M6 6L18 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
          </svg>
        </button>
      </div>

      <form id="auditForm" class="dialog-form" novalidate>
        <div class="dialog-body">
          <div class="form-grid">
            <label class="field">
              <span>Medicine</span>
              <div class="field-select">
                <select id="auditMedicineInput" required></select>
              </div>
            </label>

            <label class="field">
              <span>Movement Type</span>
              <div class="field-select">
                <select id="auditTypeInput" required>
                  <option value="audit">Audit</option>
                  <option value="adjustment">Adjustment</option>
                  <option value="stock-in">Stock In</option>
                  <option value="stock-out">Stock Out</option>
                </select>
              </div>
            </label>

            <label class="field">
              <span>Effect</span>
              <div class="field-select">
                <select id="auditEffectInput" required>
                  <option value="increase">Increase Stock</option>
                  <option value="decrease">Decrease Stock</option>
                </select>
              </div>
            </label>

            <label class="field">
              <span>Quantity</span>
              <input type="number" id="auditQuantityInput" min="1" step="1" placeholder="0" required />
            </label>

            <label class="field">
              <span>Reference No.</span>
              <input type="text" id="auditReferenceInput" placeholder="e.g. AUD-2026-001" maxlength="50" required />
            </label>

            <label class="field field-full">
              <span>Reason / Notes</span>
              <input type="text" id="auditReasonInput" placeholder="e.g. Cycle count correction for shelf A-03" maxlength="120" required />
            </label>
          </div>
        </div>

        <div class="dialog-foot">
          <button type="button" class="secondary-btn" id="cancelAuditModalBtn">Cancel</button>
          <button type="submit" class="primary-btn">Save Audit Entry</button>
        </div>
      </form>
    </div>
  </div>

  <div class="dialog-backdrop" id="adjustmentModal" hidden>
    <div class="dialog-card dialog-md" role="dialog" aria-modal="true" aria-labelledby="adjustmentModalTitle">
      <div class="dialog-head">
        <div>
          <h3 id="adjustmentModalTitle">Create Adjustment</h3>
          <p>Post a corrective ledger entry without changing the original movement record.</p>
        </div>
        <button class="dialog-close" type="button" id="closeAdjustmentModalBtn" aria-label="Close">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
            <path d="M6 6L18 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
          </svg>
        </button>
      </div>

      <form id="adjustmentForm" class="dialog-form" novalidate>
        <div class="dialog-body">
          <div class="form-grid">
            <label class="field">
              <span>Source Reference</span>
              <input type="text" id="adjustmentSourceReferenceInput" readonly />
            </label>

            <label class="field">
              <span>Medicine</span>
              <input type="text" id="adjustmentMedicineInput" readonly />
            </label>

            <label class="field">
              <span>Adjustment Effect</span>
              <div class="field-select">
                <select id="adjustmentEffectInput" required>
                  <option value="increase">Increase Stock</option>
                  <option value="decrease">Decrease Stock</option>
                </select>
              </div>
            </label>

            <label class="field">
              <span>Quantity</span>
              <input type="number" id="adjustmentQuantityInput" min="1" step="1" placeholder="0" required />
            </label>

            <label class="field">
              <span>New Reference No.</span>
              <input type="text" id="adjustmentReferenceInput" maxlength="50" required />
            </label>

            <label class="field field-full">
              <span>Reason / Notes</span>
              <input type="text" id="adjustmentReasonInput" placeholder="e.g. Count correction after recount" maxlength="120" required />
            </label>
          </div>
        </div>

        <div class="dialog-foot">
          <button type="button" class="secondary-btn" id="cancelAdjustmentModalBtn">Cancel</button>
          <button type="submit" class="primary-btn">Post Adjustment</button>
        </div>
      </form>
    </div>
  </div>

  <div class="dialog-backdrop" id="reverseModal" hidden>
    <div class="dialog-card dialog-sm" role="dialog" aria-modal="true" aria-labelledby="reverseModalTitle">
      <div class="dialog-head">
        <div>
          <h3 id="reverseModalTitle">Reverse Entry</h3>
          <p>Create a new reversal entry while preserving the original movement.</p>
        </div>
        <button class="dialog-close" type="button" id="closeReverseModalBtn" aria-label="Close">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
            <path d="M6 6L18 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
          </svg>
        </button>
      </div>

      <div class="dialog-body detail-body">
        <div class="detail-grid">
          <div class="detail-item">
            <span>Source Reference</span>
            <strong id="reverseSourceReference">—</strong>
          </div>
          <div class="detail-item">
            <span>Medicine</span>
            <strong id="reverseMedicine">—</strong>
          </div>
          <div class="detail-item">
            <span>Original Quantity</span>
            <strong id="reverseQuantity">—</strong>
          </div>
          <div class="detail-item">
            <span>New Reversal Reference</span>
            <strong id="reverseNewReference">—</strong>
          </div>
        </div>

        <div class="confirm-copy">
          <p id="reverseConfirmMessage">This will create a new reversal record and keep the original posted row unchanged.</p>
        </div>
      </div>

      <div class="dialog-foot">
        <button type="button" class="secondary-btn" id="cancelReverseModalBtn">Cancel</button>
        <button type="button" class="primary-btn" id="confirmReverseBtn">Create Reversal</button>
      </div>
    </div>
  </div>

  <div class="dialog-backdrop" id="detailsModal" hidden>
    <div class="dialog-card dialog-sm" role="dialog" aria-modal="true" aria-labelledby="detailsModalTitle">
      <div class="dialog-head">
        <div>
          <h3 id="detailsModalTitle">Movement Details</h3>
          <p>Detailed information for the selected stock movement.</p>
        </div>
        <button class="dialog-close" type="button" id="closeDetailsModalBtn" aria-label="Close">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
            <path d="M6 6L18 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
          </svg>
        </button>
      </div>

      <div class="dialog-body detail-body">
        <div class="detail-grid" id="movementDetailsContent"></div>
      </div>

      <div class="dialog-foot">
        <button type="button" class="secondary-btn" id="closeDetailsFooterBtn">Close</button>
      </div>
    </div>
  </div>

  <div class="toast-stack" id="toastStack" aria-live="polite" aria-atomic="true"></div>

  <script src="../javascript/app-shell.js" defer></script>
  <script src="../javascript/app-tools.js" defer></script>
  <script src="../javascript/stock-movements.js" defer></script>
</body>
</html>