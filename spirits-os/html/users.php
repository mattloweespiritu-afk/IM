<?php
require_once __DIR__ . '/../php/auth/admin-only.php';

function e(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
}

$sessionName = $_SESSION['full_name'] ?? 'System Administrator';
$sessionRole = strtoupper($_SESSION['role'] ?? 'admin');
$avatarLetter = strtoupper(substr(trim($sessionName), 0, 1));
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Spirit's OS | Users</title>

  <link rel="stylesheet" href="../css/app-shell.css" />
  <link rel="stylesheet" href="../css/app-tools.css" />
  <link rel="stylesheet" href="../css/users.css" />
</head>
<body class="users-page">
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

              <a href="expenses.php" class="nav-item">
                <span class="nav-icon">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M12 3v18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
                    <path d="M16 7.5c0-1.7-1.8-3-4-3s-4 1.3-4 3 1.8 3 4 3 4 1.3 4 3-1.8 3-4 3-4-1.3-4-3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
                  </svg>
                </span>
                <span>Expenses</span>
              </a>

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
            </div>

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

              <a href="users.php" class="nav-item active" aria-current="page">
                <span class="nav-icon">
                  <svg viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="8" r="3.5" stroke="currentColor" stroke-width="1.8"></circle>
                    <path d="M5 19a7 7 0 0 1 14 0" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
                  </svg>
                </span>
                <span>Users</span>
                <span class="nav-arrow">›</span>
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
            <h2>Users</h2>
            <div class="live-time">
              <span class="time-dot"></span>
              <span>Admin Access Only</span>
            </div>
          </div>
        </div>

        <div class="topbar-right">
          <div class="date-chip">
            <span class="day">Role</span>
            <span class="date">Administrator</span>
          </div>
        </div>
      </header>

      <main class="content-shell users-content">
        <section class="users-overview">
          <div class="users-copy">
            <h1>System Users</h1>
            <p>Create and manage staff and administrator accounts with polished access control.</p>
          </div>

          <div class="users-actions">
            <button type="button" class="users-btn users-btn-secondary users-btn-md" id="refreshUsersBtn">
              <span class="users-btn-icon-wrap">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M20 11a8 8 0 1 1-2.34-5.66" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"></path>
                  <path d="M20 4v5h-5" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
              </span>
              <span>Refresh</span>
            </button>

            <button type="button" class="users-btn users-btn-primary users-btn-md" id="openCreateUserModalBtn">
              <span class="users-btn-icon-wrap">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M12 6v12M6 12h12" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
                </svg>
              </span>
              <span>Create System User</span>
            </button>
          </div>
        </section>

        <div id="usersPageAlert" class="users-page-alert" hidden></div>

        <section class="users-stats-grid">
          <article class="users-stat-card">
            <span class="users-stat-label">Total Users</span>
            <strong id="totalUsersCount">0</strong>
          </article>

          <article class="users-stat-card">
            <span class="users-stat-label">Administrators</span>
            <strong id="adminUsersCount">0</strong>
          </article>

          <article class="users-stat-card">
            <span class="users-stat-label">Staff Accounts</span>
            <strong id="staffUsersCount">0</strong>
          </article>

          <article class="users-stat-card">
            <span class="users-stat-label">Pending Password Change</span>
            <strong id="mustChangeCount">0</strong>
          </article>
        </section>

        <section class="users-toolbar-card">
          <div class="users-toolbar">
            <div class="users-search-wrap">
              <label for="usersSearch" class="sr-only">Search users</label>
              <input type="search" id="usersSearch" placeholder="Search full name, username, or email" />
            </div>

            <div class="users-filter-wrap">
              <label for="roleFilter" class="sr-only">Role Filter</label>
              <select id="roleFilter">
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="staff">Staff</option>
              </select>

              <label for="statusFilter" class="sr-only">Status Filter</label>
              <select id="statusFilter">
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </section>

        <section class="users-table-card">
          <div class="section-head">
            <div>
              <h3>User Directory</h3>
              <p>Authorized users with role, account status, first-login state, and last login record.</p>
            </div>
          </div>

          <div class="users-table-wrap">
            <table class="users-table">
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>First Login</th>
                  <th>Last Login</th>
                </tr>
              </thead>
              <tbody id="usersTableBody">
                <tr>
                  <td colspan="7" class="users-empty-state">Loading users...</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  </div>

  <div class="users-modal-backdrop" id="createUserModal" hidden>
    <div class="users-modal" role="dialog" aria-modal="true" aria-labelledby="createUserModalTitle">
      <div class="users-modal-head">
        <div>
          <h3 id="createUserModalTitle">Create System User</h3>
          <p>Create a new admin or staff account and set the initial login password.</p>
        </div>
        <button type="button" class="users-modal-close" id="closeCreateUserModalBtn" aria-label="Close create user modal">×</button>
      </div>

      <div id="createUserAlert" class="users-form-alert" hidden></div>

      <form id="createUserForm" class="users-form" novalidate>
        <div class="users-password-note">
          <strong>Admin-defined password</strong>
          <p>Set the starting password here. The user can keep this account and change the password later from their account settings.</p>
        </div>

        <div class="users-form-grid">
          <div class="form-field">
            <label for="fullName">Full Name</label>
            <input type="text" id="fullName" name="full_name" placeholder="Enter full name" required />
            <small class="field-error" id="fullNameError"></small>
          </div>

          <div class="form-field">
            <label for="username">Username</label>
            <input type="text" id="username" name="username" placeholder="Enter username" required />
            <small class="field-error" id="usernameError"></small>
          </div>

          <div class="form-field">
            <label for="email">Email Address</label>
            <input type="email" id="email" name="email" placeholder="Enter email address" required />
            <small class="field-error" id="emailError"></small>
          </div>

          <div class="form-field">
            <label for="role">Role</label>
            <select id="role" name="role" required>
              <option value="">Select role</option>
              <option value="admin">Admin</option>
              <option value="staff">Staff</option>
            </select>
            <small class="field-error" id="roleError"></small>
          </div>

          <div class="form-field">
            <label for="password">Password</label>
            <div class="password-wrap">
              <input type="password" id="password" name="password" placeholder="Enter initial password" required />
              <button type="button" class="password-toggle" data-password-target="password">Show</button>
            </div>
            <small class="field-error" id="passwordError"></small>
          </div>

          <div class="form-field">
            <label for="confirmPassword">Confirm Password</label>
            <div class="password-wrap">
              <input type="password" id="confirmPassword" name="confirm_password" placeholder="Confirm password" required />
              <button type="button" class="password-toggle" data-password-target="confirmPassword">Show</button>
            </div>
            <small class="field-error" id="confirmPasswordError"></small>
          </div>
        </div>

        <p class="users-form-helper">Use at least 8 characters. A mix of letters and numbers is recommended.</p>

        <div class="users-form-actions">
          <button type="button" class="users-btn users-btn-secondary users-btn-sm" id="cancelCreateUserBtn">
            <span>Cancel</span>
          </button>

          <button type="submit" class="users-btn users-btn-primary users-btn-sm" id="submitCreateUserBtn">
            <span class="users-btn-icon-wrap">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 6v12M6 12h12" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
              </svg>
            </span>
            <span class="btn-text">Create User</span>
          </button>
        </div>
      </form>
    </div>
  </div>

  <script src="../javascript/app-shell.js" defer></script>
  <script src="../javascript/app-tools.js" defer></script>
  <script src="../javascript/users.js" defer></script>
</body>
</html>