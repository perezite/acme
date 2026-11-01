window.acmeTheme = {
  load: () => document.documentElement.dataset.theme === "dark",
  set: (dark) => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    try { localStorage.setItem("acme-theme", dark ? "dark" : "light"); } catch { }
  }
};

window.acmeKeys = {
  attach: () => {
    if (window.__acmeKeysAttached) return;
    window.__acmeKeysAttached = true;
    window.addEventListener("keydown", event => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        document.querySelector("#global-search")?.focus();
        document.querySelector("#global-search")?.select();
      }
      if (event.key === "Escape") {
        const search = document.querySelector("#global-search");
        if (search && search.value) { search.value = ""; search.dispatchEvent(new Event("input", { bubbles: true })); }
        else if (location.pathname !== "/") location.assign("/");
      }
    });
  }
};
