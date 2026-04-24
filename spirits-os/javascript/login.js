const form = document.getElementById("loginForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const rememberInput = document.getElementById("remember");
const usernameError = document.getElementById("usernameError");
const passwordError = document.getElementById("passwordError");
const loginButton = document.getElementById("loginButton");
const formAlert = document.getElementById("formAlert");
const togglePassword = document.getElementById("togglePassword");
const eyeOpen = document.getElementById("eyeOpen");
const eyeClosed = document.getElementById("eyeClosed");
const btnText = loginButton.querySelector(".btn-text");
const btnSpinner = loginButton.querySelector(".btn-spinner");
const btnArrow = loginButton.querySelector(".btn-arrow");

const fallbackRedirectUrl = "html/dashboard.php";

function setAlert(message, type = "error") {
  formAlert.textContent = message;
  formAlert.className = `form-alert show ${type}`;
}

function clearAlert() {
  formAlert.textContent = "";
  formAlert.className = "form-alert";
}

function setFieldError(input, errorElement, message) {
  const wrapper = input.closest(".field-control");
  if (wrapper) wrapper.classList.add("invalid");
  errorElement.textContent = message;
}

function clearFieldError(input, errorElement) {
  const wrapper = input.closest(".field-control");
  if (wrapper) wrapper.classList.remove("invalid");
  errorElement.textContent = "";
}

function validateForm() {
  let isValid = true;

  clearAlert();
  clearFieldError(usernameInput, usernameError);
  clearFieldError(passwordInput, passwordError);

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (!username) {
    setFieldError(usernameInput, usernameError, "Username is required.");
    isValid = false;
  }

  if (!password) {
    setFieldError(passwordInput, passwordError, "Password is required.");
    isValid = false;
  } else if (password.length < 6) {
    setFieldError(passwordInput, passwordError, "Password must be at least 6 characters.");
    isValid = false;
  }

  return isValid;
}

function setLoadingState(isLoading) {
  loginButton.disabled = isLoading;
  btnSpinner.classList.toggle("hidden", !isLoading);
  btnArrow.classList.toggle("hidden", isLoading);
  btnText.textContent = isLoading ? "Signing In..." : "Access System";
}

if (togglePassword) {
  togglePassword.addEventListener("click", () => {
    const isPassword = passwordInput.type === "password";
    passwordInput.type = isPassword ? "text" : "password";
    togglePassword.setAttribute("aria-label", isPassword ? "Hide password" : "Show password");
    eyeOpen.classList.toggle("hidden", isPassword);
    eyeClosed.classList.toggle("hidden", !isPassword);
  });
}

usernameInput.addEventListener("input", () => clearFieldError(usernameInput, usernameError));
passwordInput.addEventListener("input", () => clearFieldError(passwordInput, passwordError));

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!validateForm()) {
    setAlert("Please correct the highlighted fields and try again.");
    return;
  }

  setLoadingState(true);
  clearAlert();

  try {
    const response = await fetch("php/login.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: usernameInput.value.trim(),
        password: passwordInput.value.trim(),
        remember: rememberInput.checked,
      }),
    });

    const rawText = await response.text();
    console.log("Raw login response:", rawText);

    let data;
    try {
      data = JSON.parse(rawText);
    } catch (parseError) {
      throw new Error("Invalid JSON response from PHP: " + rawText);
    }

    if (!response.ok || !data.success) {
      setAlert(data.message || "Unable to sign in. Please try again.");
      setLoadingState(false);
      return;
    }

    setAlert(data.message || "Login successful. Redirecting...", "success");

    const nextUrl = data.redirect || fallbackRedirectUrl;

    setTimeout(() => {
      window.location.href = nextUrl;
    }, 900);
  } catch (error) {
    console.error("Login error:", error);
    setAlert("Server connection failed. Check browser console.");
    setLoadingState(false);
  }
});