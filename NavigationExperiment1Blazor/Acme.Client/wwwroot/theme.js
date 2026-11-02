// Browser-only bridge: persistent browser preferences and global keyboard events.
(() => {
  try {
    if (localStorage.getItem("acme-theme") === "dark")
      document.documentElement.dataset.theme = "dark";
  } catch { }

  let dotnet = null;
  let attached = false;
  window.acmeBrowser = {
    loadTheme: () => document.documentElement.dataset.theme === "dark",
    setTheme: dark => {
      document.documentElement.dataset.theme = dark ? "dark" : "light";
      try { localStorage.setItem("acme-theme", dark ? "dark" : "light"); } catch { }
    },
    onboardingDismissed: () => {
      try { return localStorage.getItem("acme-onboarding-dismissed-v3") === "true"; }
      catch { return false; }
    },
    dismissOnboarding: () => {
      try { localStorage.setItem("acme-onboarding-dismissed-v3", "true"); } catch { }
    },
    attach: reference => {
      dotnet = reference;
      if (attached) return;
      attached = true;
      window.addEventListener("keydown", event => {
        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
          event.preventDefault();
          dotnet?.invokeMethodAsync("HandleBrowserKey", "search");
        } else if (event.key === "Escape") {
          dotnet?.invokeMethodAsync("HandleBrowserKey", "escape");
        }
      });
    },
    focusSearch: () => {
      const input = document.querySelector("#global-search");
      input?.focus();
      input?.select();
    },
    focusTourTarget: selector => {
      requestAnimationFrame(() => {
        const visible = [...document.querySelectorAll(selector)].find(element => element.getClientRects().length > 0);
        const target = visible?.matches("button,input,select") ? visible : visible?.querySelector("button,input,select");
        target?.focus({ preventScroll: true });
      });
    }
  };
})();
