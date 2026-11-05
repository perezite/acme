(() => {
  'use strict';

  // Positions and dimensions are measured in the 1920 × 1080 reference canvas.
  // The responsive layout is defined separately in styles.css.
  const tiles = [
    { id: 'projekte', title: 'Projekte', description: 'Projekte planen und steuern', icon: 'layers', x: 86, y: 269, width: 447, height: 135 },
    { id: 'aufgaben', title: 'Aufgaben', description: 'Aufgaben erledigen', icon: 'check-square', x: 547, y: 268, width: 203, height: 137, narrow: true },
    { id: 'kunden', title: 'Kunden', description: 'Kunden und Kontakte verwalten', icon: 'users', x: 963, y: 268, width: 432, height: 137, purple: true },
    { id: 'kalender', title: 'Kalender', description: 'Termine im Blick', icon: 'calendar', x: 1410, y: 268, width: 205, height: 137, narrow: true },
    { id: 'kontakte', title: 'Kontakte', description: 'Kontaktdaten pflegen', icon: 'contact', x: 1629, y: 268, width: 205, height: 137, narrow: true, purple: true },
    { id: 'dokumente', title: 'Dokumente', description: 'Dateien zentral ablegen und teilen', icon: 'document', x: 86, y: 424, width: 448, height: 132, purple: true },
    { id: 'team', title: 'Team', description: 'Rollen und Kapazitäten', icon: 'team', x: 549, y: 424, width: 203, height: 132, narrow: true, purple: true },
    { id: 'berichte', title: 'Berichte', description: 'Auswertungen und Übersichten', icon: 'bars', x: 766, y: 424, width: 434, height: 132 },
    { id: 'finanzen', title: 'Finanzen', description: 'Kosten, Rechnungen und Zahlungen', icon: 'coins', x: 1396, y: 424, width: 438, height: 132, inset: 40, gap: 20 },
    { id: 'zeiterfassung', title: 'Zeiterfassung', description: 'Zeiten erfassen', icon: 'clock', x: 86, y: 575, width: 212, height: 134, narrow: true },
    { id: 'angebote', title: 'Angebote', description: 'Angebote erstellen und versenden', icon: 'offer', x: 513, y: 575, width: 441, height: 134, inset: 40 },
    { id: 'freigaben', title: 'Freigaben', description: 'Anfragen prüfen', icon: 'shield', x: 969, y: 575, width: 204, height: 134, narrow: true },
    { id: 'lager', title: 'Lager', description: 'Bestände und Waren', icon: 'package', x: 1188, y: 575, width: 204, height: 134, narrow: true, purple: true },
    { id: 'auftraege', title: 'Aufträge', description: 'Aufträge planen und abwickeln', icon: 'clipboard', x: 1406, y: 575, width: 428, height: 134, purple: true, inset: 40, gap: 27 },
    { id: 'einkauf', title: 'Einkauf', description: 'Bedarfe anfragen und bestellen', icon: 'cart', x: 86, y: 727, width: 443, height: 127, purple: true, gap: 35 },
    { id: 'anlagen', title: 'Anlagen', description: 'Anlagen verwalten', icon: 'settings', x: 544, y: 727, width: 201, height: 127, narrow: true },
    { id: 'nachrichten', title: 'Nachrichten', description: 'Intern kommunizieren', icon: 'mail', x: 759, y: 727, width: 201, height: 127, narrow: true, purple: true },
    { id: 'wissen', title: 'Wissen', description: 'Informationen und Anleitungen', icon: 'book', x: 1174, y: 727, width: 453, height: 127, inset: 40, gap: 32 },
    { id: 'personal', title: 'Personal', description: 'Mitarbeitende und Rollen verwalten', icon: 'team', x: 289, y: 872, width: 460, height: 133, inset: 40, gap: 26 },
    { id: 'reisen', title: 'Reisen', description: 'Dienstreisen organisieren', icon: 'briefcase', x: 762, y: 872, width: 201, height: 133, narrow: true, purple: true },
    { id: 'support', title: 'Support', description: 'Hilfe und Anfragen', icon: 'headset', x: 978, y: 872, width: 201, height: 133, narrow: true },
    { id: 'statistik', title: 'Statistik', description: 'Kennzahlen im Blick', icon: 'bars', x: 1195, y: 872, width: 201, height: 133, narrow: true, purple: true },
    { id: 'einstellungen', title: 'Einstellungen', description: 'System konfigurieren', icon: 'settings', x: 1412, y: 872, width: 205, height: 133, narrow: true },
    { id: 'automationen', title: 'Automationen', description: 'Abläufe automatisieren', icon: 'zap', x: 1634, y: 872, width: 200, height: 133, narrow: true, purple: true },
  ];

  const root = document.documentElement;
  const frame = document.getElementById('stage-frame');
  const layout = document.getElementById('tile-layout');
  const search = document.getElementById('tile-search');
  const notificationsButton = document.getElementById('notifications-button');
  const profileButton = document.getElementById('profile-button');
  const panels = [document.getElementById('notifications-panel'), document.getElementById('profile-panel')];
  const tileButtons = new Map();
  let toastTimer;
  let searchTimer;

  function makeIcon(name) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    svg.setAttribute('aria-hidden', 'true');
    use.setAttribute('href', `#i-${name}`);
    svg.append(use);
    return svg;
  }

  function buildTiles() {
    for (const tile of tiles) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `tile${tile.narrow ? ' tile--narrow' : ''}${tile.purple ? ' tile--purple' : ''}`;
      button.dataset.tileId = tile.id;
      button.setAttribute('aria-pressed', String(tile.id === 'projekte'));
      for (const property of ['x', 'y', 'width', 'height', 'inset']) {
        if (tile[property] !== undefined) button.style.setProperty(`--${property}`, `${tile[property]}px`);
      }
      if (tile.gap) button.style.setProperty('--icon-gap', `${tile.gap}px`);
      const icon = document.createElement('span');
      icon.className = 'tile-icon';
      icon.append(makeIcon(tile.icon));
      const copy = document.createElement('span');
      copy.className = 'tile-copy';
      const title = document.createElement('span');
      title.className = 'tile-title';
      title.textContent = tile.title;
      const description = document.createElement('span');
      description.className = 'tile-description';
      description.textContent = tile.description;
      copy.append(title, description);
      button.append(icon, copy);
      button.addEventListener('click', () => selectTile(tile));
      layout.append(button);
      tileButtons.set(tile.id, button);
    }
  }

  function fitReferenceCanvas() {
    const width = document.documentElement.clientWidth;
    // Use the same media query as CSS: clientWidth excludes a desktop scrollbar.
    if (window.matchMedia('(max-width: 1199px)').matches) {
      frame.style.removeProperty('width');
      frame.style.removeProperty('height');
      root.style.setProperty('--stage-scale', '1');
      return;
    }
    const scale = Math.min(1, width / 1920);
    root.style.setProperty('--stage-scale', String(scale));
    frame.style.width = `${1920 * scale}px`;
    frame.style.height = `${1080 * scale}px`;
  }

  function toast(message) {
    window.clearTimeout(toastTimer);
    const container = document.getElementById('toast-root');
    const node = document.createElement('div');
    node.className = 'toast';
    const text = document.createElement('span');
    text.textContent = message;
    node.append(makeIcon('check'), text);
    container.replaceChildren(node);
    toastTimer = window.setTimeout(() => container.replaceChildren(), 2600);
  }

  function closePanels() {
    panels.forEach(panel => { panel.hidden = true; });
    notificationsButton.setAttribute('aria-expanded', 'false');
    profileButton.setAttribute('aria-expanded', 'false');
  }

  function selectTile(tile) {
    closePanels();
    tileButtons.forEach((button, id) => button.setAttribute('aria-pressed', String(id === tile.id)));
    toast(`${tile.title} ausgewählt.`);
  }

  function setTheme(theme, persist = true) {
    const dark = theme === 'dark';
    root.dataset.theme = dark ? 'dark' : 'light';
    const action = dark ? 'Light Mode aktivieren' : 'Dark Mode aktivieren';
    const button = document.getElementById('theme-button');
    button.setAttribute('aria-label', action);
    button.title = action;
    button.setAttribute('aria-pressed', String(dark));
    button.replaceChildren(makeIcon(dark ? 'sun' : 'moon'));
    const profileTheme = document.getElementById('profile-theme-button');
    profileTheme.querySelector('use').setAttribute('href', dark ? '#i-sun' : '#i-moon');
    profileTheme.querySelector('span').textContent = dark ? 'Zum Light Mode wechseln' : 'Zum Dark Mode wechseln';
    document.getElementById('mode-label').textContent = dark ? 'Dark Mode' : 'Light Mode';
    document.querySelector('meta[name="theme-color"]').content = dark ? '#102330' : '#e9f2ff';
    if (persist) {
      try { localStorage.setItem('klarwerk-theme', root.dataset.theme); } catch { /* The prototype also works with storage disabled. */ }
    }
  }

  function matchingTiles() {
    const query = search.value.trim().toLocaleLowerCase('de');
    return tiles.filter(tile => `${tile.title} ${tile.description}`.toLocaleLowerCase('de').includes(query));
  }

  function updateSearch() {
    const query = search.value.trim();
    const matches = new Set(matchingTiles().map(tile => tile.id));
    tileButtons.forEach((button, id) => button.classList.toggle('is-dimmed', Boolean(query) && !matches.has(id)));
    document.getElementById('empty-search').hidden = !query || matches.size > 0;
    window.clearTimeout(searchTimer);
    searchTimer = window.setTimeout(() => {
      document.getElementById('search-status').textContent = query ? `${matches.size} passende Arbeitsbereiche.` : '';
    }, 220);
  }

  function togglePanel(panel, button) {
    const open = panel.hidden;
    closePanels();
    panel.hidden = !open;
    button.setAttribute('aria-expanded', String(open));
  }

  buildTiles();
  fitReferenceCanvas();
  setTheme(root.dataset.theme, false);
  window.addEventListener('resize', fitReferenceCanvas);
  document.fonts?.ready.then(fitReferenceCanvas);

  document.getElementById('theme-button').addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));
  document.getElementById('profile-theme-button').addEventListener('click', () => { setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'); closePanels(); });
  notificationsButton.addEventListener('click', () => {
    togglePanel(panels[0], notificationsButton);
    document.getElementById('notification-dot').hidden = true;
  });
  profileButton.addEventListener('click', () => togglePanel(panels[1], profileButton));
  document.addEventListener('click', event => {
    if (!event.target.closest('.header-panel, .notification-button, .profile-button')) closePanels();
  });
  document.addEventListener('keydown', event => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      search.focus();
      search.select();
    }
    if (event.key === 'Escape') {
      const activePanel = panels.findIndex(panel => !panel.hidden);
      closePanels();
      if (activePanel >= 0) (activePanel === 0 ? notificationsButton : profileButton).focus();
      if (search.value) { search.value = ''; updateSearch(); }
    }
  });
  search.addEventListener('input', updateSearch);
  document.getElementById('search-form').addEventListener('submit', event => {
    event.preventDefault();
    const matches = matchingTiles();
    if (!matches.length) return;
    selectTile(matches[0]);
    tileButtons.get(matches[0].id).focus();
  });
  document.getElementById('home-button').addEventListener('click', () => {
    search.value = '';
    updateSearch();
    closePanels();
    tileButtons.forEach((button, id) => button.setAttribute('aria-pressed', String(id === 'projekte')));
    window.scrollTo({ top: 0, behavior: 'auto' });
  });
})();
