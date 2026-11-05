(() => {
  'use strict';

  // Desktop placement on an eight-column grid. Wide tiles span two columns;
  // smaller viewports reflow the same sequence, including its empty cells.
  const tiles = [
    { id: 'projekte', title: 'Projekte', description: 'Projekte planen und steuern', icon: 'layers', column: 1, row: 1 },
    { id: 'aufgaben', title: 'Aufgaben', description: 'Aufgaben erledigen', icon: 'check-square', column: 3, row: 1, narrow: true },
    { id: 'kunden', title: 'Kunden', description: 'Kunden und Kontakte verwalten', icon: 'users', column: 5, row: 1, purple: true },
    { id: 'kalender', title: 'Kalender', description: 'Termine im Blick', icon: 'calendar', column: 7, row: 1, narrow: true },
    { id: 'kontakte', title: 'Kontakte', description: 'Kontaktdaten pflegen', icon: 'contact', column: 8, row: 1, narrow: true, purple: true },
    { id: 'dokumente', title: 'Dokumente', description: 'Dateien zentral ablegen und teilen', icon: 'document', column: 1, row: 2, purple: true },
    { id: 'team', title: 'Team', description: 'Rollen und Kapazitäten', icon: 'team', column: 3, row: 2, narrow: true, purple: true },
    { id: 'berichte', title: 'Berichte', description: 'Auswertungen und Übersichten', icon: 'bars', column: 4, row: 2 },
    { id: 'finanzen', title: 'Finanzen', description: 'Kosten, Rechnungen und Zahlungen', icon: 'coins', column: 7, row: 2 },
    { id: 'zeiterfassung', title: 'Zeiterfassung', description: 'Zeiten erfassen', icon: 'clock', column: 1, row: 3, narrow: true },
    { id: 'angebote', title: 'Angebote', description: 'Angebote erstellen und versenden', icon: 'offer', column: 3, row: 3 },
    { id: 'freigaben', title: 'Freigaben', description: 'Anfragen prüfen', icon: 'shield', column: 5, row: 3, narrow: true },
    { id: 'lager', title: 'Lager', description: 'Bestände und Waren', icon: 'package', column: 6, row: 3, narrow: true, purple: true },
    { id: 'auftraege', title: 'Aufträge', description: 'Aufträge planen und abwickeln', icon: 'clipboard', column: 7, row: 3, purple: true },
    { id: 'einkauf', title: 'Einkauf', description: 'Bedarfe anfragen und bestellen', icon: 'cart', column: 1, row: 4, purple: true },
    { id: 'anlagen', title: 'Anlagen', description: 'Anlagen verwalten', icon: 'settings', column: 3, row: 4, narrow: true },
    { id: 'nachrichten', title: 'Nachrichten', description: 'Intern kommunizieren', icon: 'mail', column: 4, row: 4, narrow: true, purple: true },
    { id: 'wissen', title: 'Wissen', description: 'Informationen und Anleitungen', icon: 'book', column: 6, row: 4 },
    { id: 'personal', title: 'Personal', description: 'Mitarbeitende und Rollen verwalten', icon: 'team', column: 2, row: 5 },
    { id: 'reisen', title: 'Reisen', description: 'Dienstreisen organisieren', icon: 'briefcase', column: 4, row: 5, narrow: true, purple: true },
    { id: 'support', title: 'Support', description: 'Hilfe und Anfragen', icon: 'headset', column: 5, row: 5, narrow: true },
    { id: 'statistik', title: 'Statistik', description: 'Kennzahlen im Blick', icon: 'bars', column: 6, row: 5, narrow: true, purple: true },
    { id: 'einstellungen', title: 'Einstellungen', description: 'System konfigurieren', icon: 'settings', column: 7, row: 5, narrow: true },
    { id: 'automationen', title: 'Automationen', description: 'Abläufe automatisieren', icon: 'zap', column: 8, row: 5, narrow: true, purple: true },
  ];

  const root = document.documentElement;
  const frame = document.getElementById('stage-frame');
  const layout = document.getElementById('tile-layout');
  const search = document.getElementById('tile-search');
  const searchForm = document.getElementById('search-form');
  const searchResults = document.getElementById('search-results');
  const searchResultList = document.getElementById('search-result-list');
  const notificationsButton = document.getElementById('notifications-button');
  const profileButton = document.getElementById('profile-button');
  const panels = [document.getElementById('notifications-panel'), document.getElementById('profile-panel')];
  const tileButtons = new Map();
  let toastTimer;
  let searchTimer;
  let activeResultIndex = -1;

  function makeIcon(name) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    svg.setAttribute('aria-hidden', 'true');
    use.setAttribute('href', `#i-${name}`);
    svg.append(use);
    return svg;
  }

  function buildTiles() {
    const columns = 8;
    const tilesByCell = new Map(tiles.map(tile => [(tile.row - 1) * columns + tile.column - 1, tile]));
    const cellCount = Math.max(...tiles.map(tile => tile.row)) * columns;
    for (let cell = 0; cell < cellCount;) {
      const tile = tilesByCell.get(cell);
      if (!tile) {
        const gap = document.createElement('span');
        gap.className = 'tile-gap';
        gap.setAttribute('aria-hidden', 'true');
        gap.style.setProperty('--column', String(cell % columns + 1));
        gap.style.setProperty('--row', String(Math.floor(cell / columns) + 1));
        layout.append(gap);
        cell += 1;
        continue;
      }
      const span = tile.narrow ? 1 : 2;
      cell += span;
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `tile${tile.narrow ? ' tile--narrow' : ''}${tile.purple ? ' tile--purple' : ''}`;
      button.dataset.tileId = tile.id;
      button.setAttribute('aria-pressed', String(tile.id === 'projekte'));
      for (const property of ['column', 'row']) {
        button.style.setProperty(`--${property}`, String(tile[property]));
      }
      button.style.setProperty('--span', String(span));
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
    closeSearchResults();
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
    document.querySelector('meta[name="theme-color"]').content = dark ? '#102330' : '#e9f2ff';
    if (persist) {
      try { localStorage.setItem('klarwerk-theme', root.dataset.theme); } catch { /* The prototype also works with storage disabled. */ }
    }
  }

  function matchingTiles() {
    const query = search.value.trim().toLocaleLowerCase('de');
    return tiles.filter(tile => `${tile.title} ${tile.description}`.toLocaleLowerCase('de').includes(query));
  }

  function setActiveResult(index, ensureVisible = false) {
    activeResultIndex = index;
    const options = Array.from(searchResultList.children);
    options.forEach((option, i) => option.setAttribute('aria-selected', String(i === index)));
    const active = options[index];
    if (active) {
      search.setAttribute('aria-activedescendant', active.id);
      if (ensureVisible) active.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    } else {
      search.removeAttribute('aria-activedescendant');
    }
  }

  function closeSearchResults() {
    searchResults.hidden = true;
    search.setAttribute('aria-expanded', 'false');
    setActiveResult(-1);
  }

  function resizeSearchResults() {
    if (searchResults.hidden) return;
    const viewport = window.visualViewport;
    const viewportBottom = viewport ? viewport.offsetTop + viewport.height : window.innerHeight;
    const available = viewportBottom - searchForm.getBoundingClientRect().bottom - 20;
    searchResults.style.setProperty('--search-results-room', `${Math.max(0, Math.min(360, available))}px`);
  }

  function activateSearchResult(tile) {
    search.value = '';
    updateSearch();
    selectTile(tile);
    const button = tileButtons.get(tile.id);
    button.focus({ preventScroll: true });
    button.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'auto' });
  }

  function showSearchResults(matches) {
    searchResultList.replaceChildren();
    matches.forEach((tile, index) => {
      const option = document.createElement('button');
      option.type = 'button';
      option.id = `search-option-${tile.id}`;
      option.className = `search-result${tile.purple ? ' search-result--purple' : ''}`;
      option.setAttribute('role', 'option');
      option.setAttribute('aria-selected', 'false');
      option.tabIndex = -1;
      const icon = document.createElement('span');
      icon.className = 'search-result-icon';
      icon.setAttribute('aria-hidden', 'true');
      icon.append(makeIcon(tile.icon));
      const copy = document.createElement('span');
      copy.className = 'search-result-copy';
      const title = document.createElement('span');
      title.className = 'search-result-title';
      title.textContent = tile.title;
      const description = document.createElement('span');
      description.className = 'search-result-description';
      description.textContent = tile.description;
      copy.append(title, description);
      const arrow = makeIcon('chevron');
      arrow.classList.add('search-result-chevron');
      option.append(icon, copy, arrow);
      option.addEventListener('click', () => activateSearchResult(tile));
      option.addEventListener('pointerenter', event => {
        if (event.pointerType === 'mouse') setActiveResult(index);
      });
      searchResultList.append(option);
    });
    document.getElementById('search-result-count').textContent = matches.length ? `${matches.length} Treffer` : 'Keine Treffer';
    document.getElementById('empty-search').hidden = matches.length > 0;
    searchResults.hidden = false;
    search.setAttribute('aria-expanded', 'true');
    setActiveResult(-1);
    resizeSearchResults();
  }

  function updateSearch() {
    const query = search.value.trim();
    const matches = matchingTiles();
    const matchIds = new Set(matches.map(tile => tile.id));
    tileButtons.forEach((button, id) => button.classList.toggle('is-dimmed', Boolean(query) && !matchIds.has(id)));
    if (query && document.activeElement === search) showSearchResults(matches);
    else closeSearchResults();
    window.clearTimeout(searchTimer);
    searchTimer = window.setTimeout(() => {
      document.getElementById('search-status').textContent = query ? (matches.length === 1 ? '1 passender Arbeitsbereich.' : `${matches.length} passende Arbeitsbereiche.`) : '';
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
  window.addEventListener('resize', resizeSearchResults);
  window.addEventListener('scroll', resizeSearchResults, { passive: true });
  window.visualViewport?.addEventListener('resize', resizeSearchResults);
  window.visualViewport?.addEventListener('scroll', resizeSearchResults);
  document.fonts?.ready.then(fitReferenceCanvas);
  document.fonts?.ready.then(resizeSearchResults);

  document.getElementById('theme-button').addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));
  document.getElementById('profile-theme-button').addEventListener('click', () => { setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'); closePanels(); });
  notificationsButton.addEventListener('click', () => {
    togglePanel(panels[0], notificationsButton);
    document.getElementById('notification-dot').hidden = true;
  });
  profileButton.addEventListener('click', () => togglePanel(panels[1], profileButton));
  document.addEventListener('click', event => {
    if (!event.target.closest('.header-panel, .notification-button, .profile-button')) closePanels();
    if (!event.target.closest('.global-search')) closeSearchResults();
  });
  document.addEventListener('focusin', event => {
    if (!searchForm.contains(event.target)) closeSearchResults();
  });
  document.addEventListener('keydown', event => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      search.focus();
      search.select();
      updateSearch();
    }
    if (event.key === 'Escape') {
      if (!searchResults.hidden) {
        event.preventDefault();
        search.focus();
        closeSearchResults();
        return;
      }
      const activePanel = panels.findIndex(panel => !panel.hidden);
      closePanels();
      if (activePanel >= 0) (activePanel === 0 ? notificationsButton : profileButton).focus();
      if (search.value) { search.value = ''; updateSearch(); }
    }
  });
  search.addEventListener('input', updateSearch);
  search.addEventListener('focus', () => { closePanels(); updateSearch(); });
  search.addEventListener('click', updateSearch);
  searchResultList.addEventListener('mousedown', event => event.preventDefault());
  search.addEventListener('keydown', event => {
    if (event.isComposing || !['ArrowDown', 'ArrowUp'].includes(event.key) || !search.value.trim()) return;
    const matches = matchingTiles();
    if (!matches.length) return;
    event.preventDefault();
    if (searchResults.hidden) showSearchResults(matches);
    const next = event.key === 'ArrowDown' ? activeResultIndex + 1 : (activeResultIndex < 0 ? matches.length - 1 : activeResultIndex - 1);
    setActiveResult((next + matches.length) % matches.length, true);
  });
  searchForm.addEventListener('submit', event => {
    event.preventDefault();
    const matches = matchingTiles();
    if (!matches.length) return;
    activateSearchResult(matches[activeResultIndex] || matches[0]);
  });
  document.getElementById('home-button').addEventListener('click', () => {
    search.value = '';
    updateSearch();
    closePanels();
    tileButtons.forEach((button, id) => button.setAttribute('aria-pressed', String(id === 'projekte')));
    window.scrollTo({ top: 0, behavior: 'auto' });
  });
})();
