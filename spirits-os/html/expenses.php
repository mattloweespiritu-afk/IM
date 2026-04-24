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
  <title>Spirit's OS | Expenses</title>

  <link rel="stylesheet" href="../css/app-shell.css" />
  <link rel="stylesheet" href="../css/app-tools.css" />
  <link rel="stylesheet" href="../css/expenses.css" />
</head>
<body class="expenses-page">
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

              <a href="expenses.php" class="nav-item active" aria-current="page">
                <span class="nav-icon">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M12 3v18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
                    <path d="M16 7.5c0-1.7-1.8-3-4-3s-4 1.3-4 3 1.8 3 4 3 4 1.3 4 3-1.8 3-4 3-4-1.3-4-3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
                  </svg>
                </span>
                <span>Expenses</span>
                <span class="nav-arrow">›</span>
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
            <h2>Expenses</h2>
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
                    <p>Search expenses, categories, and receipt records.</p>
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
                    placeholder="Search expense tracker..."
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
                    <p>Recent expense activity and reporting updates.</p>
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

      <main class="content-shell expenses-content">
        <section
          class="expenses-hero"
          id="expenseTrackerSection"
          data-search-title="Expense Tracker"
          data-search-description="Manage operational costs and overheads for Spirit's Drugstore"
          data-search-keywords="expense tracker record expense utilities salaries repairs category distribution"
        >
          <div class="expenses-hero__copy">
            <h1>Expense Tracker</h1>
            <p>Manage operational costs and overheads for Spirit's Drugstore</p>
          </div>

          <div class="expenses-hero__actions">
            <button type="button" class="ghost-btn" id="exportReportBtn">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 4v9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
                <path d="M8.5 10.5L12 14l3.5-3.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
                <path d="M5 18h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
              </svg>
              <span>Export Report</span>
            </button>

            <button type="button" class="primary-btn" id="openExpenseModalBtn">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 6v12M6 12h12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
              </svg>
              <span>Record New Expense</span>
            </button>
          </div>
        </section>

        <section
          class="expense-stats"
          id="expenseStatsSection"
          data-search-title="Expense Summary"
          data-search-description="Total expenses, monthly total, and category distribution"
          data-search-keywords="total expenses monthly expense category distribution chart"
        >
          <article class="expense-stat-card stat-total">
            <div class="expense-stat-card__icon">
              <svg viewBox="0 0 24 24" fill="none">
                <rect x="5" y="4" width="14" height="16" rx="2" stroke="currentColor" stroke-width="1.7"></rect>
                <path d="M8 8h8M8 12h6M8 16h5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"></path>
              </svg>
            </div>
            <div class="expense-stat-card__copy">
              <span>Total Expenses</span>
              <strong id="totalExpenses">₱0.00</strong>
              <p>All-time recorded overheads</p>
            </div>
          </article>

          <article class="expense-stat-card stat-month">
            <div class="expense-stat-card__icon">
              <svg viewBox="0 0 24 24" fill="none">
                <rect x="4" y="5" width="16" height="15" rx="2" stroke="currentColor" stroke-width="1.8"></rect>
                <path d="M8 3v4M16 3v4M4 10h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
              </svg>
            </div>
            <div class="expense-stat-card__copy">
              <span>This Month</span>
              <strong id="monthlyExpenses">₱0.00</strong>
              <p id="monthlyTransactions">0 records this month</p>
            </div>
          </article>

          <article class="expense-chart-card">
            <div class="expense-chart-card__head">
              <span>Category Distribution</span>
            </div>

            <div class="expense-chart-card__body">
              <div class="donut-chart" id="categoryDonutChart" aria-hidden="true">
                <div class="donut-chart__center"></div>
              </div>

              <div class="donut-legend" id="categoryLegend"></div>
            </div>
          </article>
        </section>

        <section
          class="expense-controls-card"
          id="expenseFilterSection"
          data-search-title="Expense Filters"
          data-search-description="Search and filter expense records"
          data-search-keywords="search expenses filters category date amount"
        >
          <div class="expense-controls">
            <label class="expense-search">
              <span class="expense-search__icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="6" stroke="currentColor" stroke-width="1.8"></circle>
                  <path d="M20 20l-3.5-3.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
                </svg>
              </span>
              <input
                type="search"
                id="expenseSearchInput"
                placeholder="Search by description, category or reference..."
                autocomplete="off"
              />
            </label>

            <div class="filter-group">
              <button type="button" class="ghost-btn compact-btn" id="toggleFiltersBtn" aria-expanded="false">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M4 7h16M7 12h10M10 17h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
                </svg>
                <span>Filters</span>
              </button>

              <div class="filters-panel" id="filtersPanel" hidden>
                <div class="filters-grid">
                  <label class="field">
                    <span>Category</span>
                    <div class="field-select">
                      <select id="categoryFilter">
                        <option value="all">All Categories</option>
                        <option value="Utilities">Utilities</option>
                        <option value="Rent / Lease">Rent / Lease</option>
                        <option value="Staff Salaries">Staff Salaries</option>
                        <option value="Office Supplies">Office Supplies</option>
                        <option value="Maintenance & Repair">Maintenance & Repair</option>
                        <option value="Marketing & Ads">Marketing & Ads</option>
                        <option value="Taxes & Licenses">Taxes & Licenses</option>
                        <option value="Others">Others</option>
                      </select>
                    </div>
                  </label>

                  <label class="field">
                    <span>From Date</span>
                    <input type="date" id="fromDateFilter" />
                  </label>

                  <label class="field">
                    <span>To Date</span>
                    <input type="date" id="toDateFilter" />
                  </label>
                </div>

                <div class="filters-actions">
                  <button type="button" class="secondary-btn" id="resetExpenseFiltersBtn">Reset Filters</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          class="expense-ledger-card"
          id="expenseTableSection"
          data-search-title="Expense Ledger"
          data-search-description="Expense date, category, description, amount, and row actions"
          data-search-keywords="expense ledger receipt edit delete amount"
        >
          <div class="table-wrap">
            <table class="expense-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th class="actions-col">Actions</th>
                </tr>
              </thead>
              <tbody id="expenseTableBody"></tbody>
            </table>
          </div>
        </section>

        <div class="expense-footer">
          <span class="expense-footer__meta" id="expenseResultsMeta">Showing 0 to 0 of 0 records</span>
          <div class="pagination" id="expensePagination"></div>
        </div>
      </main>
    </div>
  </div>

  <div class="menu-portal" id="menuPortal"></div>

  <div class="dialog-backdrop" id="expenseModal" hidden>
    <div class="dialog-card dialog-md" role="dialog" aria-modal="true" aria-labelledby="expenseModalTitle">
      <div class="dialog-head dialog-head-danger">
        <div>
          <h3 id="expenseModalTitle">Record Expense</h3>
          <p id="expenseModalSubtitle">Log operational costs for financial tracking.</p>
        </div>
        <button class="dialog-close" type="button" id="closeExpenseModalBtn" aria-label="Close">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
            <path d="M6 6L18 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
          </svg>
        </button>
      </div>

      <form id="expenseForm" class="dialog-form" novalidate>
        <div class="dialog-body">
          <div class="form-grid">
            <label class="field">
              <span>Category</span>
              <div class="field-select">
                <select id="expenseCategoryInput" required>
                  <option value="">Select Category</option>
                  <option value="Utilities">Utilities (Power, Water)</option>
                  <option value="Rent / Lease">Rent / Lease</option>
                  <option value="Staff Salaries">Staff Salaries</option>
                  <option value="Office Supplies">Office Supplies</option>
                  <option value="Maintenance & Repair">Maintenance & Repair</option>
                  <option value="Marketing & Ads">Marketing & Ads</option>
                  <option value="Taxes & Licenses">Taxes & Licenses</option>
                  <option value="Others">Others</option>
                </select>
              </div>
            </label>

            <label class="field">
              <span>Amount</span>
              <input type="number" id="expenseAmountInput" min="0.01" step="0.01" placeholder="0.00" required />
            </label>

            <label class="field field-full">
              <span>Description</span>
              <input type="text" id="expenseDescriptionInput" placeholder="e.g. Electricity Bill - March 2026" maxlength="100" required />
            </label>

            <label class="field">
              <span>Reference No.</span>
              <input type="text" id="expenseReferenceInput" placeholder="e.g. EXP-240415-001" maxlength="40" required />
            </label>

            <label class="field">
              <span>Date</span>
              <input type="date" id="expenseDateInput" required />
            </label>

            <label class="field field-full">
              <span>Receipt / Notes</span>
              <input type="text" id="expenseNotesInput" placeholder="e.g. Official receipt no. 001245" maxlength="140" />
            </label>
          </div>
        </div>

        <div class="dialog-foot">
          <button type="button" class="secondary-btn" id="cancelExpenseModalBtn">Cancel</button>
          <button type="submit" class="primary-btn" id="saveExpenseBtn">Save Expense</button>
        </div>
      </form>
    </div>
  </div>

  <div class="dialog-backdrop" id="expenseDetailsModal" hidden>
    <div class="dialog-card dialog-sm" role="dialog" aria-modal="true" aria-labelledby="expenseDetailsTitle">
      <div class="dialog-head dialog-head-danger">
        <div>
          <h3 id="expenseDetailsTitle">Expense Receipt</h3>
          <p>Expense record details and receipt information.</p>
        </div>
        <button class="dialog-close" type="button" id="closeExpenseDetailsBtn" aria-label="Close">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
            <path d="M6 6L18 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
          </svg>
        </button>
      </div>

      <div class="dialog-body detail-body">
        <div class="detail-grid" id="expenseDetailsContent"></div>
      </div>

      <div class="dialog-foot">
        <button type="button" class="secondary-btn" id="closeExpenseDetailsFooterBtn">Close</button>
      </div>
    </div>
  </div>

  <div class="dialog-backdrop" id="deleteExpenseModal" hidden>
    <div class="dialog-card dialog-sm" role="dialog" aria-modal="true" aria-labelledby="deleteExpenseTitle">
      <div class="dialog-head dialog-head-danger">
        <div>
          <h3 id="deleteExpenseTitle">Delete Expense Record</h3>
          <p>This action removes the expense entry from the ledger.</p>
        </div>
        <button class="dialog-close" type="button" id="closeDeleteExpenseBtn" aria-label="Close">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
            <path d="M6 6L18 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
          </svg>
        </button>
      </div>

      <div class="dialog-body detail-body">
        <div class="detail-grid">
          <div class="detail-item">
            <span>Selected Record</span>
            <strong id="deleteExpenseLabel">—</strong>
          </div>
        </div>

        <div class="confirm-copy">
          <p id="deleteExpenseMessage">This expense record will be permanently removed from this local ledger.</p>
        </div>
      </div>

      <div class="dialog-foot">
        <button type="button" class="secondary-btn" id="cancelDeleteExpenseBtn">Cancel</button>
        <button type="button" class="danger-btn" id="confirmDeleteExpenseBtn">Delete Record</button>
      </div>
    </div>
  </div>

  <div class="toast-stack" id="toastStack" aria-live="polite" aria-atomic="true"></div>

  <script src="../javascript/app-shell.js" defer></script>
  <script src="../javascript/app-tools.js" defer></script>
  <script src="../javascript/expenses.js" defer></script>
</body>
</html>