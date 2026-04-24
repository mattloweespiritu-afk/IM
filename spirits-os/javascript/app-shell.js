const DESKTOP_QUERY = "(min-width: 1101px)";
const DESKTOP_COLLAPSE_KEY = "spirits_os_shell_desktop_collapsed";

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const sidebar =
    document.getElementById("appSidebar") ||
    document.getElementById("sidebar");
  const backdrop = document.getElementById("sidebarBackdrop");
  const toggle = document.getElementById("menuToggle");
  const mediaQuery = window.matchMedia(DESKTOP_QUERY);

  if (!body || !sidebar || !backdrop || !toggle) return;

  let isDesktopCollapsed =
    localStorage.getItem(DESKTOP_COLLAPSE_KEY) === "true";

  function setExpanded(value) {
    toggle.setAttribute("aria-expanded", String(value));
  }

  function syncShellState() {
    const isDesktop = mediaQuery.matches;

    if (isDesktop) {
      body.classList.remove("shell-mobile-open");
      body.classList.toggle("shell-desktop-collapsed", isDesktopCollapsed);
      setExpanded(!isDesktopCollapsed);
      return;
    }

    body.classList.remove("shell-desktop-collapsed");
    setExpanded(body.classList.contains("shell-mobile-open"));
  }

  function closeMobileShell() {
    if (mediaQuery.matches) return;
    body.classList.remove("shell-mobile-open");
    setExpanded(false);
  }

  function toggleShell() {
    if (mediaQuery.matches) {
      isDesktopCollapsed = !isDesktopCollapsed;
      localStorage.setItem(
        DESKTOP_COLLAPSE_KEY,
        String(isDesktopCollapsed)
      );
      body.classList.toggle(
        "shell-desktop-collapsed",
        isDesktopCollapsed
      );
      setExpanded(!isDesktopCollapsed);
      return;
    }

    body.classList.toggle("shell-mobile-open");
    setExpanded(body.classList.contains("shell-mobile-open"));
  }

  toggle.addEventListener("click", toggleShell);
  backdrop.addEventListener("click", closeMobileShell);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMobileShell();
    }
  });

  sidebar.querySelectorAll('a[href]').forEach((link) => {
    link.addEventListener("click", () => {
      if (!mediaQuery.matches) {
        closeMobileShell();
      }
    });
  });

  if (typeof mediaQuery.addEventListener === "function") {
    mediaQuery.addEventListener("change", syncShellState);
  } else if (typeof mediaQuery.addListener === "function") {
    mediaQuery.addListener(syncShellState);
  }

  syncShellState();
});