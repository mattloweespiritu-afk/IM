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
  <title>Spirit's OS | Medicines</title>
  <link rel="stylesheet" href="../css/app-shell.css" />
  <link rel="stylesheet" href="../css/app-tools.css" />
  <link rel="stylesheet" href="../css/medicines.css" />
</head>
<body class="medicines-page">
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

              <a href="medicines.php" class="nav-item active" aria-current="page">
                <span class="nav-icon">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M7 17l10-10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
                    <path d="M6.3 20.2a4.2 4.2 0 0 1 0-5.9l6-6a4.2 4.2 0 1 1 5.9 5.9l-6 6a4.2 4.2 0 0 1-5.9 0Z" stroke="currentColor" stroke-width="1.8"></path>
                  </svg>
                </span>
                <span>Medicines</span>
                <span class="nav-arrow">›</span>
              </a>

              <a href="batches.html" class="nav-item">
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
            <h2>Medicines</h2>
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
                    <p>Search overview, filters, and inventory sections.</p>
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
                    placeholder="Search overview, search, inventory..."
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
                    <p>Inventory alerts and recent updates.</p>
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

      <main class="content-shell medicines-content">
        <section
          class="inventory-hero"
          id="medicineOverviewSection"
          data-search-title="Medicine Inventory Overview"
          data-search-description="Inventory summary, stats, and medicine actions"
          data-search-keywords="medicine overview inventory summary stats add export"
        >
          <div class="inventory-copy">
            <h1>Medicine Inventory</h1>
            <p>Manage your pharmaceutical stock and reorder levels</p>
          </div>

          <div class="inventory-toolbar">
            <div class="sync-pill">
              <span class="sync-dot"></span>
              <span>Live Inventory Sync</span>
            </div>

            <button class="ghost-btn" type="button" id="exportCsvBtn">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 4v9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
                <path d="M8.5 10.5L12 14l3.5-3.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
                <path d="M5 18h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
              </svg>
              <span>Export CSV</span>
            </button>

            <button class="primary-btn" type="button" id="openAddMedicineBtn">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
              </svg>
              <span>Add New Medicine</span>
            </button>
          </div>
        </section>

        <section class="stats-grid" aria-label="Medicine stats">
          <article class="metric-card">
            <div class="metric-top">
              <span class="metric-icon success">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M7 17l10-10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
                  <path d="M6.3 20.2a4.2 4.2 0 0 1 0-5.9l6-6a4.2 4.2 0 1 1 5.9 5.9l-6 6a4.2 4.2 0 0 1-5.9 0Z" stroke="currentColor" stroke-width="1.8"></path>
                </svg>
              </span>
            </div>
            <span class="metric-label">Total Medicines</span>
            <h3 id="totalMedicinesStat">0</h3>
            <p class="metric-note">Active inventory records</p>
          </article>

          <article class="metric-card">
            <div class="metric-top">
              <span class="metric-icon warning">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M12 4l8 14H4L12 4Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"></path>
                  <path d="M12 9v4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
                  <circle cx="12" cy="16.5" r=".8" fill="currentColor"></circle>
                </svg>
              </span>
            </div>
            <span class="metric-label">Low Stock Items</span>
            <h3 id="lowStockStat">0</h3>
            <p class="metric-note">Needs reorder soon</p>
          </article>

          <article class="metric-card">
            <div class="metric-top">
              <span class="metric-icon info">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h5l2-5 3 10 2-5h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
              </span>
            </div>
            <span class="metric-label">Recent Movements</span>
            <h3 id="recentMovementsStat">0</h3>
            <p class="metric-note">Last 7 days activity</p>
          </article>
        </section>

        <section
          class="controls-shell"
          id="medicineSearchSection"
          data-search-title="Medicine Search and Filters"
          data-search-description="Search, filter, sort, and switch medicine views"
          data-search-keywords="search filter sort medicine table grid"
        >
          <div class="inventory-controls">
            <label class="inventory-search">
              <span class="inventory-search-icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="6" stroke="currentColor" stroke-width="1.8"></circle>
                  <path d="M20 20l-3.5-3.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
                </svg>
              </span>
              <input
                type="search"
                id="inventorySearchInput"
                placeholder="Search by brand, generic name, or SKU..."
                autocomplete="off"
              />
            </label>

            <div class="inventory-control-actions">
              <div class="filter-group">
                <button class="ghost-btn compact-btn" type="button" id="toggleFiltersBtn" aria-expanded="false">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M5 7h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
                    <path d="M8 12h8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
                    <path d="M10 17h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
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
                        </select>
                      </div>
                    </label>

                    <label class="field">
                      <span>Stock State</span>
                      <div class="field-select">
                        <select id="stockFilter">
                          <option value="all">All States</option>
                          <option value="active">Healthy Stock</option>
                          <option value="low">Low Stock</option>
                          <option value="out">Out of Stock</option>
                        </select>
                      </div>
                    </label>

                    <label class="field">
                      <span>Sort By</span>
                      <div class="field-select">
                        <select id="sortSelect">
                          <option value="name-asc">Name (A-Z)</option>
                          <option value="name-desc">Name (Z-A)</option>
                          <option value="stock-desc">Stock (High-Low)</option>
                          <option value="stock-asc">Stock (Low-High)</option>
                          <option value="price-desc">Price (High-Low)</option>
                          <option value="price-asc">Price (Low-High)</option>
                        </select>
                      </div>
                    </label>
                  </div>

                  <div class="filters-actions">
                    <button type="button" class="text-action" id="resetFiltersBtn">Reset Filters</button>
                  </div>
                </div>
              </div>

              <div class="view-switch" aria-label="Change inventory view">
                <button type="button" class="view-btn active" data-view="table" aria-label="Table view">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M5 7h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
                    <path d="M5 12h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
                    <path d="M5 17h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
                  </svg>
                </button>

                <button type="button" class="view-btn" data-view="grid" aria-label="Grid view">
                  <svg viewBox="0 0 24 24" fill="none">
                    <rect x="4" y="4" width="6" height="6" rx="1.5" stroke="currentColor" stroke-width="1.8"></rect>
                    <rect x="14" y="4" width="6" height="6" rx="1.5" stroke="currentColor" stroke-width="1.8"></rect>
                    <rect x="4" y="14" width="6" height="6" rx="1.5" stroke="currentColor" stroke-width="1.8"></rect>
                    <rect x="14" y="14" width="6" height="6" rx="1.5" stroke="currentColor" stroke-width="1.8"></rect>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </section>

        <section
          class="inventory-shell"
          id="medicineInventorySection"
          data-search-title="Medicine Inventory Records"
          data-search-description="Medicine table and grid records with actions"
          data-search-keywords="inventory records medicine table grid edit restock archive"
        >
          <div class="inventory-card">
            <div class="table-shell" id="tableView">
              <div class="table-wrap">
                <table class="data-table">
                  <thead>
                    <tr>
                      <th>Medicine Details</th>
                      <th>Category</th>
                      <th>Pricing</th>
                      <th>Current Stock</th>
                      <th>Status</th>
                      <th class="actions-col">Actions</th>
                    </tr>
                  </thead>
                  <tbody id="medicineTableBody"></tbody>
                </table>
              </div>
            </div>

            <div class="grid-shell" id="gridView" hidden>
              <div class="medicine-grid" id="medicineGrid"></div>
            </div>

            <div class="inventory-empty" id="inventoryEmpty" hidden>
              <div class="empty-state-card">
                <div class="empty-icon">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M7 17l10-10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
                    <path d="M6.3 20.2a4.2 4.2 0 0 1 0-5.9l6-6a4.2 4.2 0 1 1 5.9 5.9l-6 6a4.2 4.2 0 0 1-5.9 0Z" stroke="currentColor" stroke-width="1.8"></path>
                  </svg>
                </div>
                <h3>No medicines found</h3>
                <p>Try another search, change filters, or add a new medicine record.</p>
                <button class="primary-btn" type="button" id="emptyStateAddBtn">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
                  </svg>
                  <span>Add New Medicine</span>
                </button>
              </div>
            </div>
          </div>

          <div class="inventory-footer">
            <p class="inventory-meta" id="inventoryMeta">Showing 0 of 0 items</p>
            <div class="pagination" id="pagination"></div>
          </div>
        </section>
      </main>
    </div>
  </div>

  <div class="dialog-backdrop" id="medicineModal" hidden>
    <div class="dialog-card dialog-lg" role="dialog" aria-modal="true" aria-labelledby="medicineModalTitle">
      <div class="dialog-head">
        <div>
          <h3 id="medicineModalTitle">New Medicine Record</h3>
          <p id="medicineModalSubtitle">Enter the details for the new pharmaceutical item.</p>
        </div>
        <button class="dialog-close" type="button" data-close-dialog="medicineModal" aria-label="Close">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
            <path d="M6 6L18 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
          </svg>
        </button>
      </div>

      <form id="medicineForm" class="dialog-form" novalidate>
        <input type="hidden" id="medicineIdInput" />

        <div class="dialog-body">
          <div class="form-grid">
            <label class="field">
              <span>SKU / Item Code</span>
              <input type="text" id="skuInput" placeholder="e.g. PAR-500" maxlength="32" required />
            </label>

            <label class="field">
              <span>Category</span>
              <div class="field-select">
                <select id="categoryInput" required>
                  <option value="">Select Category</option>
                  <option value="Analgesics">Analgesics</option>
                  <option value="Antibiotics">Antibiotics</option>
                  <option value="Antihistamines">Antihistamines</option>
                  <option value="Vitamins">Vitamins</option>
                  <option value="Gastrointestinal">Gastrointestinal</option>
                  <option value="Cough and Cold">Cough and Cold</option>
                  <option value="Cardiovascular">Cardiovascular</option>
                  <option value="Dermatological">Dermatological</option>
                </select>
              </div>
            </label>

            <label class="field">
              <span>Brand Name</span>
              <input type="text" id="brandNameInput" placeholder="e.g. Biogesic" maxlength="60" required />
            </label>

            <label class="field">
              <span>Generic Name</span>
              <input type="text" id="genericNameInput" placeholder="e.g. Paracetamol" maxlength="60" required />
            </label>

            <label class="field">
              <span>Dosage / Strength</span>
              <input type="text" id="dosageInput" placeholder="e.g. 500mg" maxlength="40" required />
            </label>

            <label class="field">
              <span>Selling Price (₱)</span>
              <input type="number" id="priceInput" min="0" step="0.01" placeholder="0.00" required />
            </label>

            <label class="field">
              <span>Form Type</span>
              <div class="field-select">
                <select id="formTypeInput" required>
                  <option value="">Select Form</option>
                  <option value="Tablet">Tablet</option>
                  <option value="Capsule">Capsule</option>
                  <option value="Syrup">Syrup</option>
                  <option value="Suspension">Suspension</option>
                  <option value="Injection">Injection</option>
                  <option value="Drops">Drops</option>
                  <option value="Ointment">Ointment</option>
                </select>
              </div>
            </label>

            <label class="field">
              <span>Unit Type</span>
              <div class="field-select">
                <select id="unitTypeInput" required>
                  <option value="">Select Unit</option>
                  <option value="Piece">Piece</option>
                  <option value="Box">Box</option>
                  <option value="Bottle">Bottle</option>
                  <option value="Strip">Strip</option>
                  <option value="Blister Pack">Blister Pack</option>
                  <option value="Tube">Tube</option>
                  <option value="Sachet">Sachet</option>
                </select>
              </div>
            </label>

            <label class="field">
              <span>Current Stock</span>
              <input type="number" id="stockInput" min="0" step="1" placeholder="0" required />
            </label>

            <label class="field">
              <span>Reorder Level</span>
              <input type="number" id="reorderLevelInput" min="0" step="1" placeholder="0" required />
            </label>
          </div>
        </div>

        <div class="dialog-foot">
          <button type="button" class="secondary-btn" data-close-dialog="medicineModal">Cancel</button>
          <button type="submit" class="primary-btn" id="saveMedicineBtn">
            <span>Create Record</span>
          </button>
        </div>
      </form>
    </div>
  </div>

  <div class="dialog-backdrop" id="detailsModal" hidden>
    <div class="dialog-card dialog-md" role="dialog" aria-modal="true" aria-labelledby="detailsModalTitle">
      <div class="dialog-head">
        <div>
          <h3 id="detailsModalTitle">Medicine Details</h3>
          <p>Inventory information and recent stock activity.</p>
        </div>
        <button class="dialog-close" type="button" data-close-dialog="detailsModal" aria-label="Close">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
            <path d="M6 6L18 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
          </svg>
        </button>
      </div>

      <div class="dialog-body detail-body">
        <div class="detail-grid" id="detailsContent"></div>

        <div class="detail-history">
          <h4>Recent Activity</h4>
          <div class="detail-history-list" id="detailsHistory"></div>
        </div>
      </div>

      <div class="dialog-foot">
        <button type="button" class="secondary-btn" data-close-dialog="detailsModal">Close</button>
        <button type="button" class="primary-btn" id="detailsRestockBtn">
          <span>Quick Restock</span>
        </button>
      </div>
    </div>
  </div>

  <div class="dialog-backdrop" id="restockModal" hidden>
    <div class="dialog-card dialog-sm" role="dialog" aria-modal="true" aria-labelledby="restockModalTitle">
      <div class="dialog-head">
        <div>
          <h3 id="restockModalTitle">Quick Restock</h3>
          <p>Increase the stock count for the selected medicine.</p>
        </div>
        <button class="dialog-close" type="button" data-close-dialog="restockModal" aria-label="Close">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
            <path d="M6 6L18 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
          </svg>
        </button>
      </div>

      <form id="restockForm" class="dialog-form" novalidate>
        <input type="hidden" id="restockMedicineId" />

        <div class="dialog-body">
          <div class="form-stack">
            <label class="field">
              <span>Medicine</span>
              <input type="text" id="restockMedicineName" readonly />
            </label>

            <label class="field">
              <span>Quantity to Add</span>
              <input type="number" id="restockQuantityInput" min="1" step="1" value="10" required />
            </label>
          </div>
        </div>

        <div class="dialog-foot">
          <button type="button" class="secondary-btn" data-close-dialog="restockModal">Cancel</button>
          <button type="submit" class="primary-btn">
            <span>Update Stock</span>
          </button>
        </div>
      </form>
    </div>
  </div>

  <div class="dialog-backdrop" id="confirmModal" hidden>
    <div class="dialog-card dialog-sm" role="dialog" aria-modal="true" aria-labelledby="confirmModalTitle">
      <div class="dialog-head">
        <div>
          <h3 id="confirmModalTitle">Archive Medicine</h3>
          <p>This action removes the record from the active inventory list.</p>
        </div>
        <button class="dialog-close" type="button" data-close-dialog="confirmModal" aria-label="Close">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
            <path d="M6 6L18 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
          </svg>
        </button>
      </div>

      <div class="dialog-body confirm-copy">
        <p id="confirmMessage">Are you sure you want to archive this medicine?</p>
      </div>

      <div class="dialog-foot">
        <button type="button" class="secondary-btn" data-close-dialog="confirmModal">Cancel</button>
        <button type="button" class="danger-btn" id="confirmArchiveBtn">Archive Item</button>
      </div>
    </div>
  </div>

  <div class="toast-stack" id="toastStack" aria-live="polite" aria-atomic="true"></div>

  <script src="../javascript/app-shell.js" defer></script>
  <script src="../javascript/app-tools.js" defer></script>
  <script src="../javascript/medicines.js" defer></script>
</body>
</html>