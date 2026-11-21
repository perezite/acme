(() => {
  'use strict';

  // Every tile occupies one cell on the eight-column desktop grid.
  const tiles = [
    { id: 'projekte', title: 'Projekte', description: 'Projekte planen und steuern', icon: 'layers', column: 1, row: 1 },
    { id: 'aufgaben', title: 'Aufgaben', description: 'Aufgaben erledigen', icon: 'check-square', column: 3, row: 1 },
    { id: 'kunden', title: 'Kunden', description: 'Kunden und Kontakte verwalten', icon: 'users', column: 5, row: 1, purple: true },
    { id: 'kalender', title: 'Kalender', description: 'Termine im Blick', icon: 'calendar', column: 7, row: 1 },
    { id: 'kontakte', title: 'Kontakte', description: 'Kontaktdaten pflegen', icon: 'contact', column: 8, row: 1, purple: true },
    { id: 'dokumente', title: 'Dokumente', description: 'Dateien zentral ablegen und teilen', icon: 'document', column: 1, row: 2, purple: true },
    { id: 'team', title: 'Team', description: 'Rollen und Kapazitäten', icon: 'team', column: 3, row: 2, purple: true },
    { id: 'berichte', title: 'Berichte', description: 'Auswertungen und Übersichten', icon: 'bars', column: 4, row: 2 },
    { id: 'finanzen', title: 'Finanzen', description: 'Kosten, Rechnungen und Zahlungen', icon: 'coins', column: 7, row: 2 },
    { id: 'zeiterfassung', title: 'Zeiterfassung', description: 'Zeiten erfassen', icon: 'clock', column: 1, row: 3 },
    { id: 'angebote', title: 'Angebote', description: 'Angebote erstellen und versenden', icon: 'offer', column: 3, row: 3 },
    { id: 'freigaben', title: 'Freigaben', description: 'Anfragen prüfen', icon: 'shield', column: 5, row: 3 },
    { id: 'lager', title: 'Lager', description: 'Bestände und Waren', icon: 'package', column: 6, row: 3, purple: true },
    { id: 'auftraege', title: 'Aufträge', description: 'Aufträge planen und abwickeln', icon: 'clipboard', column: 7, row: 3, purple: true },
    { id: 'einkauf', title: 'Einkauf', description: 'Bedarfe anfragen und bestellen', icon: 'cart', column: 1, row: 4, purple: true },
    { id: 'anlagen', title: 'Anlagen', description: 'Anlagen verwalten', icon: 'settings', column: 3, row: 4 },
    { id: 'nachrichten', title: 'Nachrichten', description: 'Intern kommunizieren', icon: 'mail', column: 4, row: 4, purple: true },
    { id: 'wissen', title: 'Wissen', description: 'Informationen und Anleitungen', icon: 'book', column: 6, row: 4 },
    { id: 'personal', title: 'Personal', description: 'Mitarbeitende und Rollen verwalten', icon: 'team', column: 2, row: 5 },
    { id: 'reisen', title: 'Reisen', description: 'Dienstreisen organisieren', icon: 'briefcase', column: 4, row: 5, purple: true },
    { id: 'support', title: 'Support', description: 'Hilfe und Anfragen', icon: 'headset', column: 5, row: 5 },
    { id: 'statistik', title: 'Statistik', description: 'Kennzahlen im Blick', icon: 'bars', column: 6, row: 5, purple: true },
    { id: 'einstellungen', title: 'Einstellungen', description: 'System konfigurieren', icon: 'settings', column: 7, row: 5 },
    { id: 'automationen', title: 'Automationen', description: 'Abläufe automatisieren', icon: 'zap', column: 8, row: 5, purple: true },
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
  let selectedTileId = 'projekte';
  let toastTimer;
  let searchTimer;
  let activeResultIndex = -1;
  let arranging = false;
  let dragState = null;

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
    layout.replaceChildren();
    tileButtons.clear();
    const orderedTiles = [...tiles].sort((a, b) => a.row - b.row || a.column - b.column);
    const tilesByCell = new Map(orderedTiles.map(tile => [(tile.row - 1) * columns + tile.column - 1, tile]));
    const cellCount = Math.max(...tiles.map(tile => tile.row)) * columns;
    for (let cell = 0; cell < cellCount;) {
      const tile = tilesByCell.get(cell);
      if (!tile) {
        const gap = document.createElement('span');
        gap.className = 'tile-gap';
        gap.setAttribute('aria-hidden', 'true');
        gap.dataset.column = String(cell % columns + 1);
        gap.dataset.row = String(Math.floor(cell / columns) + 1);
        gap.style.setProperty('--column', String(cell % columns + 1));
        gap.style.setProperty('--row', String(Math.floor(cell / columns) + 1));
        layout.append(gap);
        cell += 1;
        continue;
      }
      cell += 1;
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `tile${tile.purple ? ' tile--purple' : ''}`;
      button.dataset.tileId = tile.id;
      button.draggable = false;
      button.setAttribute('aria-pressed', String(tile.id === selectedTileId));
      for (const property of ['column', 'row']) {
        button.style.setProperty(`--${property}`, String(tile[property]));
      }
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
      button.addEventListener('click', event => {
        selectTile(tile);
      });
      button.addEventListener('pointerdown', event => startTileDrag(event, tile, button));
      layout.append(button);
      tileButtons.set(tile.id, button);
    }
  }

  function startTileDrag(event, tile, button) {
    if (!arranging || event.button !== 0) return;
    event.preventDefault();
    const rect = button.getBoundingClientRect();
    const preview = button.cloneNode(true);
    preview.classList.add('tile-preview');
    preview.removeAttribute('aria-pressed');
    preview.style.position = 'fixed';
    preview.style.left = `${rect.left}px`;
    preview.style.top = `${rect.top}px`;
    sizeDragPreview(preview, rect);
    preview.style.setProperty('--column', String(tile.column));
    preview.style.setProperty('--row', String(tile.row));
    document.body.append(preview);
    button.classList.add('is-dragging');
    dragState = { tile, button, preview, target: null, targetColumn: null, emptyCell: null, startX: event.clientX, startY: event.clientY, moved: false };
    button.setPointerCapture(event.pointerId);
    button.addEventListener('pointermove', moveTileDrag);
    button.addEventListener('pointerup', endTileDrag, { once: true });
    button.addEventListener('pointercancel', endTileDrag, { once: true });
  }

  function sizeDragPreview(preview, rect) {
    const scale = Number.parseFloat(getComputedStyle(root).getPropertyValue('--stage-scale')) || 1;
    preview.style.width = `${rect.width / scale}px`;
    preview.style.height = `${rect.height / scale}px`;
    preview.style.transform = `scale(${scale})`;
  }

  function animateTileExchange(previousRects, participants) {
    const scale = Number.parseFloat(getComputedStyle(root).getPropertyValue('--stage-scale')) || 1;
    const movingButtons = [];

    tileButtons.forEach((button, id) => {
      const previous = previousRects.get(id);
      if (!previous) return;
      const current = button.getBoundingClientRect();
      const x = (previous.left - current.left) / scale;
      const y = (previous.top - current.top) / scale;
      if (Math.hypot(x, y) < 1) return;

      button.classList.add('tile-move-animating');
      if (participants.has(id)) button.classList.add('tile-swap-participant');
      button.style.transition = 'none';
      button.style.transform = `translate(${x}px, ${y}px) scale(.97)`;
      movingButtons.push(button);
    });

    if (!movingButtons.length) return;
    // Commit the starting offsets before easing every changed tile into its new slot.
    movingButtons[0].getBoundingClientRect();
    window.requestAnimationFrame(() => {
      movingButtons.forEach(button => {
        button.style.removeProperty('transition');
        button.style.transform = 'translate(0, 0) scale(1)';
      });
    });
    window.setTimeout(() => {
      movingButtons.forEach(button => {
        button.classList.remove('tile-move-animating', 'tile-swap-participant');
        button.style.removeProperty('transform');
      });
    }, 560);
  }

  function moveTileDrag(event) {
    if (!dragState) return;
    const { preview, button } = dragState;
    if (Math.hypot(event.clientX - dragState.startX, event.clientY - dragState.startY) > 6) dragState.moved = true;
    const rect = button.getBoundingClientRect();
    preview.style.left = `${event.clientX - Math.min(rect.width / 2, Math.max(24, event.clientX - rect.left))}px`;
    preview.style.top = `${event.clientY - Math.min(rect.height / 2, Math.max(24, event.clientY - rect.top))}px`;
    const hovered = document.elementFromPoint(event.clientX, event.clientY)?.closest('.tile');
    const target = hovered && hovered !== button ? tileButtons.get(hovered.dataset.tileId) : null;
    const emptyGap = !target ? document.elementFromPoint(event.clientX, event.clientY)?.closest('.tile-gap') : null;
    tileButtons.forEach(candidate => candidate.classList.toggle('drop-target', candidate === target));
    layout.querySelectorAll('.tile-gap').forEach(gap => gap.classList.toggle('drop-slot', gap === emptyGap));
    const targetTile = target ? tiles.find(item => item.id === target.dataset.tileId) : null;
    dragState.target = targetTile;
    if (target) {
      const targetRect = target.getBoundingClientRect();
      dragState.targetColumn = targetTile.column;
      preview.style.left = `${targetRect.left}px`;
      preview.style.top = `${targetRect.top}px`;
      dragState.emptyCell = null;
    } else if (emptyGap) {
      const rect = emptyGap.getBoundingClientRect();
      const emptyColumn = Number(emptyGap.dataset.column);
      const emptyRow = Number(emptyGap.dataset.row);
      const targetColumn = emptyColumn;
      dragState.targetColumn = null;
      dragState.emptyCell = { column: targetColumn, row: emptyRow };
      preview.style.left = `${rect.left}px`;
      preview.style.top = `${rect.top}px`;
    } else {
      dragState.targetColumn = null;
      dragState.emptyCell = null;
    }
  }

  function endTileDrag() {
    if (!dragState) return;
    const { tile, button, preview, target, targetColumn, emptyCell, moved } = dragState;
    button.removeEventListener('pointermove', moveTileDrag);
    button.classList.remove('is-dragging');
    tileButtons.forEach(candidate => candidate.classList.remove('drop-target'));
    layout.querySelectorAll('.tile-gap').forEach(gap => gap.classList.remove('drop-slot'));
    preview.remove();
    dragState = null;
    if (moved) {
      const suppressClick = event => {
        event.preventDefault();
        event.stopImmediatePropagation();
        button.removeEventListener('click', suppressClick, true);
      };
      button.addEventListener('click', suppressClick, true);
      window.setTimeout(() => button.removeEventListener('click', suppressClick, true), 500);
    }
    if ((!target && !emptyCell) || (target && target.id === tile.id)) return;
    const from = { column: tile.column, row: tile.row };
    const to = target ? { column: targetColumn ?? target.column, row: target.row } : emptyCell;
    const overlaps = (a, b) => a.row === b.row && a.column === b.column;
    const moving = { ...tile, ...to };
    const displaced = tiles.filter(item => item !== tile && overlaps(moving, item));
    const proposed = [moving, ...tiles.filter(item => item !== tile && !displaced.includes(item))];
    const displacedPositions = new Map();
    let noRoom = false;
    for (const item of displaced) {
      const candidates = [];
      for (let row = 1; row <= 5; row += 1) {
        for (let column = 1; column <= 8; column += 1) {
          candidates.push({ ...item, column, row });
        }
      }
      candidates.sort((a, b) => {
        const distance = candidate => Math.abs(candidate.row - from.row) * 9 + Math.abs(candidate.column - from.column);
        return distance(a) - distance(b);
      });
      const position = candidates.find(candidate => proposed.every(other => !overlaps(candidate, other)));
      if (!position) { noRoom = true; break; }
      displacedPositions.set(item, position);
      proposed.push(position);
    }
    const invalid = noRoom || moving.column < 1 || moving.column > 8
      || proposed.some(item => item.column < 1 || item.column > 8)
      || proposed.some((item, index) => proposed.slice(index + 1).some(other => overlaps(item, other)));
    if (invalid) {
      toast('Dort ist nicht genug Platz für diese Kachelbreiten.');
      return;
    }
    const previousRects = new Map([...tileButtons].map(([id, currentButton]) => [id, currentButton.getBoundingClientRect()]));
    const swapParticipants = new Set([tile.id]);
    if (target) swapParticipants.add(target.id);
    tile.column = to.column; tile.row = to.row;
    displacedPositions.forEach((position, item) => {
      item.column = position.column;
      item.row = position.row;
    });
    buildTiles();
    animateTileExchange(previousRects, swapParticipants);
    toast(target ? `${tile.title} und ${target.title} haben die Position getauscht.` : `${tile.title} verschoben.`);
  }

  function setArrangeMode(enabled) {
    arranging = enabled;
    layout.classList.toggle('is-arranging', enabled);
    const button = document.getElementById('arrange-button');
    button.setAttribute('aria-pressed', String(enabled));
    button.textContent = enabled ? 'Anordnen beenden' : 'Kacheln anordnen';
    toast(enabled ? 'Ziehe Kacheln aufeinander, um ihre Plätze zu tauschen.' : 'Anordnen beendet.');
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
    selectedTileId = tile.id;
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
  document.getElementById('arrange-button').addEventListener('click', event => setArrangeMode(event.currentTarget.getAttribute('aria-pressed') !== 'true'));
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
    selectedTileId = 'projekte';
    tileButtons.forEach((button, id) => button.setAttribute('aria-pressed', String(id === 'projekte')));
    window.scrollTo({ top: 0, behavior: 'auto' });
  });
})();
