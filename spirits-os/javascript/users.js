const usersTableBody = document.getElementById("usersTableBody");
const totalUsersCount = document.getElementById("totalUsersCount");
const adminUsersCount = document.getElementById("adminUsersCount");
const staffUsersCount = document.getElementById("staffUsersCount");
const mustChangeCount = document.getElementById("mustChangeCount");
const usersSearch = document.getElementById("usersSearch");
const roleFilter = document.getElementById("roleFilter");
const statusFilter = document.getElementById("statusFilter");
const refreshUsersBtn = document.getElementById("refreshUsersBtn");
const usersPageAlert = document.getElementById("usersPageAlert");

const createUserModal = document.getElementById("createUserModal");
const openCreateUserModalBtn = document.getElementById("openCreateUserModalBtn");
const closeCreateUserModalBtn = document.getElementById("closeCreateUserModalBtn");
const cancelCreateUserBtn = document.getElementById("cancelCreateUserBtn");
const createUserForm = document.getElementById("createUserForm");
const createUserAlert = document.getElementById("createUserAlert");
const submitCreateUserBtn = document.getElementById("submitCreateUserBtn");
const submitCreateUserBtnText = submitCreateUserBtn?.querySelector(".btn-text");

const fullNameInput = document.getElementById("fullName");
const usernameInput = document.getElementById("username");
const emailInput = document.getElementById("email");
const roleInput = document.getElementById("role");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");

const fullNameError = document.getElementById("fullNameError");
const usernameError = document.getElementById("usernameError");
const emailError = document.getElementById("emailError");
const roleError = document.getElementById("roleError");
const passwordError = document.getElementById("passwordError");
const confirmPasswordError = document.getElementById("confirmPasswordError");

let usersCache = [];

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function setPageAlert(message, type = "info") {
  usersPageAlert.textContent = message;
  usersPageAlert.className = `users-page-alert ${type}`;
  usersPageAlert.hidden = false;
}

function clearPageAlert() {
  usersPageAlert.textContent = "";
  usersPageAlert.className = "users-page-alert";
  usersPageAlert.hidden = true;
}

function setCreateUserAlert(message, type = "error") {
  createUserAlert.textContent = message;
  createUserAlert.className = `users-form-alert ${type}`;
  createUserAlert.hidden = false;
}

function clearCreateUserAlert() {
  createUserAlert.textContent = "";
  createUserAlert.className = "users-form-alert";
  createUserAlert.hidden = true;
}

function setFieldError(input, errorElement, message) {
  const field = input.closest(".form-field");
  field?.classList.add("invalid");
  errorElement.textContent = message;
}

function clearFieldError(input, errorElement) {
  const field = input.closest(".form-field");
  field?.classList.remove("invalid");
  errorElement.textContent = "";
}

function clearFormErrors() {
  clearFieldError(fullNameInput, fullNameError);
  clearFieldError(usernameInput, usernameError);
  clearFieldError(emailInput, emailError);
  clearFieldError(roleInput, roleError);
  clearFieldError(passwordInput, passwordError);
  clearFieldError(confirmPasswordInput, confirmPasswordError);
}

function resetCreateUserForm() {
  createUserForm.reset();
  clearCreateUserAlert();
  clearFormErrors();

  document.querySelectorAll(".password-toggle").forEach((button) => {
    const targetId = button.dataset.passwordTarget;
    const targetInput = document.getElementById(targetId);

    if (targetInput) {
      targetInput.type = "password";
      button.textContent = "Show";
    }
  });
}

function openModal() {
  resetCreateUserForm();
  createUserModal.hidden = false;
  document.body.classList.add("modal-open");
  fullNameInput.focus();
}

function closeModal() {
  createUserModal.hidden = true;
  document.body.classList.remove("modal-open");
  resetCreateUserForm();
}

function setCreateUserLoading(isLoading) {
  submitCreateUserBtn.disabled = isLoading;
  if (submitCreateUserBtnText) {
    submitCreateUserBtnText.textContent = isLoading ? "Creating..." : "Create User";
  } else {
    submitCreateUserBtn.textContent = isLoading ? "Creating..." : "Create User";
  }
}

function validateCreateUserForm() {
  let isValid = true;

  clearCreateUserAlert();
  clearFormErrors();

  const fullName = fullNameInput.value.trim();
  const username = usernameInput.value.trim();
  const email = emailInput.value.trim();
  const role = roleInput.value.trim();
  const password = passwordInput.value.trim();
  const confirmPassword = confirmPasswordInput.value.trim();

  if (!fullName) {
    setFieldError(fullNameInput, fullNameError, "Full name is required.");
    isValid = false;
  }

  if (!username) {
    setFieldError(usernameInput, usernameError, "Username is required.");
    isValid = false;
  } else if (!/^[a-zA-Z0-9._-]{3,30}$/.test(username)) {
    setFieldError(usernameInput, usernameError, "Use 3 to 30 characters with letters, numbers, dots, underscores, or hyphens.");
    isValid = false;
  }

  if (!email) {
    setFieldError(emailInput, emailError, "Email address is required.");
    isValid = false;
  } else if (!/^\S+@\S+\.\S+$/.test(email)) {
    setFieldError(emailInput, emailError, "Please enter a valid email address.");
    isValid = false;
  }

  if (!role) {
    setFieldError(roleInput, roleError, "Please select a role.");
    isValid = false;
  }

  if (!password) {
    setFieldError(passwordInput, passwordError, "Password is required.");
    isValid = false;
  } else if (password.length < 8) {
    setFieldError(passwordInput, passwordError, "Password must be at least 8 characters.");
    isValid = false;
  }

  if (!confirmPassword) {
    setFieldError(confirmPasswordInput, confirmPasswordError, "Please confirm the password.");
    isValid = false;
  } else if (password !== confirmPassword) {
    setFieldError(confirmPasswordInput, confirmPasswordError, "Passwords do not match.");
    isValid = false;
  }

  return isValid;
}

function renderStats(users) {
  totalUsersCount.textContent = users.length;
  adminUsersCount.textContent = users.filter((user) => String(user.role).toLowerCase() === "admin").length;
  staffUsersCount.textContent = users.filter((user) => String(user.role).toLowerCase() === "staff").length;
  mustChangeCount.textContent = users.filter((user) => Number(user.must_change_password) === 1).length;
}

function renderRoleBadge(role) {
  const normalized = String(role || "").toLowerCase();
  return `<span class="role-badge ${escapeHtml(normalized)}">${escapeHtml(normalized || "—")}</span>`;
}

function renderStatusBadge(status) {
  const normalized = String(status || "").toLowerCase();
  return `<span class="status-badge ${escapeHtml(normalized)}">${escapeHtml(normalized || "—")}</span>`;
}

function renderLoginBadge(mustChangePassword) {
  const pending = Number(mustChangePassword) === 1;
  return pending
    ? `<span class="login-badge pending">Pending</span>`
    : `<span class="login-badge completed">Completed</span>`;
}

function renderUsers(users) {
  if (!users.length) {
    usersTableBody.innerHTML = `
      <tr>
        <td colspan="7" class="users-empty-state">No users found.</td>
      </tr>
    `;
    return;
  }

  usersTableBody.innerHTML = users
    .map((user) => {
      return `
        <tr>
          <td>${escapeHtml(user.full_name ?? "—")}</td>
          <td>${escapeHtml(user.username ?? "—")}</td>
          <td>${escapeHtml(user.email ?? "—")}</td>
          <td>${renderRoleBadge(user.role)}</td>
          <td>${renderStatusBadge(user.status)}</td>
          <td>${renderLoginBadge(user.must_change_password)}</td>
          <td>${escapeHtml(user.last_login || "—")}</td>
        </tr>
      `;
    })
    .join("");
}

function applyFilters() {
  const searchValue = usersSearch.value.trim().toLowerCase();
  const roleValue = roleFilter.value;
  const statusValue = statusFilter.value;

  const filteredUsers = usersCache.filter((user) => {
    const haystack = [
      user.full_name ?? "",
      user.username ?? "",
      user.email ?? ""
    ]
      .join(" ")
      .toLowerCase();

    const matchesSearch = !searchValue || haystack.includes(searchValue);
    const matchesRole = roleValue === "all" || String(user.role).toLowerCase() === roleValue;
    const matchesStatus = statusValue === "all" || String(user.status).toLowerCase() === statusValue;

    return matchesSearch && matchesRole && matchesStatus;
  });

  renderUsers(filteredUsers);
}

async function fetchUsers() {
  clearPageAlert();

  usersTableBody.innerHTML = `
    <tr>
      <td colspan="7" class="users-empty-state">Loading users...</td>
    </tr>
  `;

  try {
    const response = await fetch("../php/users/list-users.php", {
      method: "GET",
      headers: {
        Accept: "application/json"
      }
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to load users.");
    }

    usersCache = Array.isArray(data.users) ? data.users : [];
    renderStats(usersCache);
    applyFilters();
  } catch (error) {
    usersCache = [];
    renderStats(usersCache);
    renderUsers([]);
    setPageAlert(error.message || "Unable to load users.", "error");
  }
}

async function handleCreateUserSubmit(event) {
  event.preventDefault();

  if (!validateCreateUserForm()) {
    setCreateUserAlert("Please correct the highlighted fields and try again.", "error");
    return;
  }

  setCreateUserLoading(true);
  clearCreateUserAlert();

  try {
    const response = await fetch("../php/users/create-users.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        full_name: fullNameInput.value.trim(),
        username: usernameInput.value.trim(),
        email: emailInput.value.trim(),
        role: roleInput.value.trim().toLowerCase(),
        password: passwordInput.value.trim(),
        confirm_password: confirmPasswordInput.value.trim()
      })
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to create user.");
    }

    closeModal();
    setPageAlert(data.message || "User created successfully.", "success");
    await fetchUsers();
  } catch (error) {
    setCreateUserAlert(error.message || "Failed to create user.", "error");
  } finally {
    setCreateUserLoading(false);
  }
}

document.querySelectorAll(".password-toggle").forEach((button) => {
  button.addEventListener("click", () => {
    const targetId = button.dataset.passwordTarget;
    const targetInput = document.getElementById(targetId);

    if (!targetInput) return;

    const shouldShow = targetInput.type === "password";
    targetInput.type = shouldShow ? "text" : "password";
    button.textContent = shouldShow ? "Hide" : "Show";
  });
});

openCreateUserModalBtn?.addEventListener("click", openModal);
closeCreateUserModalBtn?.addEventListener("click", closeModal);
cancelCreateUserBtn?.addEventListener("click", closeModal);
createUserForm?.addEventListener("submit", handleCreateUserSubmit);
refreshUsersBtn?.addEventListener("click", fetchUsers);

usersSearch?.addEventListener("input", applyFilters);
roleFilter?.addEventListener("change", applyFilters);
statusFilter?.addEventListener("change", applyFilters);

createUserModal?.addEventListener("click", (event) => {
  if (event.target === createUserModal) {
    closeModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !createUserModal.hidden) {
    closeModal();
  }
});

document.addEventListener("DOMContentLoaded", fetchUsers);