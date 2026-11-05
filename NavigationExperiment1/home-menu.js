/* Personal start-menu layout. Business records and module definitions stay independent. */
class HomeMenuEditor {
  constructor({ groups, modules, icon, escape, render, notify }) {
    this.icon = icon;
    this.escape = escape;
    this.rerender = render;
    this.notify = notify;
    this.storageKey = "acme-home-menu-v1";
    this.catalog = new Map(modules.map(item => [`module:${item.id}`, {
      key: `module:${item.id}`, moduleId: item.id, title: item.title, area: item.group,
      description: item.desc, icon: item.icon, raw: false
    }]));
    for (const group of groups.filter(group => group.kind === "data")) {
      for (const id of group.ids) {
        const item = modules.find(item => item.id === id);
        this.catalog.set(`data:${id}`, { key: `data:${id}`, moduleId: id, title: item.title,
          area: "Rohdaten", description: "Rohdaten-Tabelle", icon: item.icon, raw: true });
      }
    }
    this.saved = groups.map((group, index) => ({ id: `category-${index}`, title: group.title,
      tiles: group.ids.map(id => `${group.kind === "data" ? "data" : "module"}:${id}`) }));
    try {
      const stored = JSON.parse(localStorage.getItem(this.storageKey));
      if (stored?.version === 1 && this.isValidLayout(stored.categories)) this.saved = stored.categories;
    } catch { /* Use the original menu if storage is unavailable or invalid. */ }
    this.draft = this.clone(this.saved);
    this.editing = false;
    this.panel = null;
    this.menu = null;
    this.drag = null;
    this.positionAnimations = new Map();
  }

  clone(value) { return JSON.parse(JSON.stringify(value)); }
  category(id) { return this.draft.find(category => category.id === id); }
  get dirty() { return this.editing && JSON.stringify(this.draft) !== JSON.stringify(this.saved); }

  isValidLayout(categories) {
    return Array.isArray(categories) && new Set(categories.map(category => category?.id)).size === categories.length
      && categories.every(category => category && typeof category.id === "string" && /^[a-z0-9-]+$/.test(category.id)
        && typeof category.title === "string" && category.title.trim().length > 0 && category.title.length <= 40
        && Array.isArray(category.tiles) && new Set(category.tiles).size === category.tiles.length
        && category.tiles.every(key => this.catalog.has(key)));
  }

  update({ focus, panel = false } = {}) {
    const root = document.querySelector("#app-main");
    const renderedCategories = [...(root?.querySelectorAll(".home-menu-category:not(.home-menu-category-placeholder)") || [])].map(node => node.dataset.homeCategory);
    const categories = this.drag?.kind === "category" || renderedCategories.join() !== this.draft.map(category => category.id).join();
    const positions = this.capturePositions(root, categories);
    this.rerender();
    this.animatePositions(root, positions);
    if (panel) {
      const editor = document.querySelector("#home-menu-panel");
      editor?.scrollIntoView({ block: "nearest" });
      (editor?.querySelector("input:not(:disabled), select") || editor?.querySelector("button"))?.focus({ preventScroll: true });
    } else if (focus) document.querySelector(focus)?.focus({ preventScroll: true });
  }

  button(action, text, icon, attrs = "", style = "home-menu-quiet") {
    return `<button type="button" class="home-menu-button ${style}" data-home-action="${action}" ${attrs}>${icon ? this.icon(icon) : ""}${text}</button>`;
  }

  iconButton(action, label, icon, attrs = "", style = "") {
    return this.button(action, "", icon, `aria-label="${this.escape(label)}" title="${this.escape(label)}" ${attrs}`, `home-menu-quiet home-menu-icon ${style}`);
  }

  attributes(category, key) {
    return `data-home-category="${category.id}"${key ? ` data-home-tile="${key}"` : ""}`;
  }

  renderMenu(category, tile) {
    const attrs = this.attributes(category, tile?.key);
    return `<div class="home-menu-popover" role="group" aria-label="${tile ? "Kachelaktionen" : "Kategorieaktionen"}">
      ${tile ? "" : this.button("rename", "Umbenennen", "pencil", attrs)}
      ${this.button("move", "Verschieben…", "move", attrs)}
      ${this.button("remove", tile ? "Entfernen" : "Kategorie entfernen", "trash", attrs, "home-menu-quiet home-menu-danger")}</div>`;
  }

  renderTile(category, key) {
    const item = this.catalog.get(key), attrs = this.attributes(category, key);
    const open = this.editing ? `data-home-action="tile-menu" ${attrs}`
      : `${item.raw ? "data-data-object" : "data-module"}="${item.moduleId}"`;
    const tile = `<button type="button" class="nav-tile${item.raw ? " nav-tile-data" : ""}" ${open}
      aria-label="${this.escape(item.title)}${item.raw ? " Rohdaten" : ""} ${this.editing ? "anpassen" : "öffnen"}">
      <span class="tile-icon">${this.icon(item.icon)}</span>
      <span class="tile-copy"><span class="tile-title">${this.escape(item.title)}</span><span class="tile-desc">${this.escape(item.description)}</span></span>
      ${this.icon("arrow", "tile-arrow")}</button>`;
    if (!this.editing) return tile;
    const expanded = this.menu?.category === category.id && this.menu?.tile === key;
    return `<div class="home-menu-tile" ${attrs}>${tile}
      ${this.iconButton("move", `${item.title} verschieben`, "grip", `${attrs} draggable="true" data-home-drag="tile"`, "home-menu-tile-grip home-menu-grip")}
      <div class="home-menu-tile-actions">${this.iconButton("tile-menu", `Aktionen für ${item.title}`, "more", `${attrs} aria-expanded="${expanded}"`)}</div>
      ${expanded ? this.renderMenu(category, item) : ""}</div>`;
  }

  render() {
    const toolbar = this.editing ? `<section class="home-menu-toolbar" aria-label="Startseite bearbeiten"><div><strong>${this.icon("settings")} Startseite bearbeiten</strong><p>Nur für dich · Kacheln und Kategorien am Griff ziehen. Der Platzhalter zeigt die neue Position.</p></div><div class="home-menu-actions">${this.button("cancel", "Abbrechen")}${this.button("save", "Speichern", "check", "", "primary-button")}</div></section>` : "";
    return `${toolbar}${this.renderPanel()}<div class="section-stack${this.editing ? " home-menu-editing" : ""}">
      ${this.draft.map(category => {
        const attrs = this.attributes(category), expanded = this.menu?.category === category.id && !this.menu.tile;
        return `<section class="category-card home-menu-category" ${attrs} aria-labelledby="home-group-${category.id}">
          <header class="home-menu-category-header">
            ${this.editing ? this.iconButton("move", `${category.title} verschieben`, "grip", `${attrs} draggable="true" data-home-drag="category"`, "home-menu-grip") : ""}
            <h2 class="category-heading" id="home-group-${category.id}">${this.escape(category.title)}</h2>
            ${this.editing ? `${this.iconButton("category-menu", `Aktionen für ${category.title}`, "more", `${attrs} aria-expanded="${expanded}"`)}${this.button("add-tile", 'Kachel <span class="home-menu-add-word">hinzufügen</span>', "plus", `${attrs} aria-label="Kachel hinzufügen"`, "home-menu-quiet home-menu-add-tile")}${expanded ? this.renderMenu(category) : ""}` : ""}
          </header><div class="tile-grid">${category.tiles.map(key => this.renderTile(category, key)).join("")}</div>
          ${!category.tiles.length ? '<p class="home-menu-empty">Noch keine Kacheln. Füge einen App-Bereich hinzu.</p>' : ""}</section>`;
      }).join("")}
      ${!this.draft.length ? '<p class="home-menu-empty">Deine Startseite ist leer. Alle Bereiche bleiben über die Suche erreichbar.</p>' : ""}
      ${this.editing ? this.button("add-category", "Kategorie hinzufügen", "plus", "", "home-menu-add-category") : ""}</div>`;
  }

  renderPanel() {
    if (!this.panel) return "";
    const { kind } = this.panel, category = this.category(this.panel.category), tile = this.catalog.get(this.panel.tile);
    let title, subtitle = "", content;
    if (kind === "rename" || kind === "add-category") {
      title = kind === "rename" ? "Kategorie umbenennen" : "Kategorie hinzufügen";
      content = `<form class="home-menu-form" data-home-form="category"><div class="home-menu-field"><label for="home-menu-name">Name der Kategorie</label><input id="home-menu-name" name="name" required maxlength="40" value="${this.escape(category?.title || "")}" autocomplete="off" placeholder="Zum Beispiel: Mein Arbeitstag"></div><button class="primary-button" type="submit">${this.icon("check")} Übernehmen</button></form>`;
    } else if (kind === "add-tile") {
      title = "Kacheln hinzufügen";
      subtitle = `Zu „${category.title}“ · App-Bereiche auswählen`;
      content = `<form data-home-form="tiles"><div class="home-menu-catalog">${[...this.catalog.values()].map(item => {
        const exists = category.tiles.includes(item.key);
        return `<label class="home-menu-choice"><input type="checkbox" name="home-tile" value="${item.key}" ${exists ? "checked disabled" : ""}><span>${this.escape(item.title)}<small>${this.escape(item.area)}${exists ? " · vorhanden" : ""}</small></span></label>`;
      }).join("")}</div><button type="submit" class="primary-button" disabled>${this.icon("plus")} Auswahl hinzufügen</button></form>`;
    } else if (kind === "move") {
      title = `${tile ? "Kachel" : "Kategorie"} verschieben`;
      subtitle = tile ? `${tile.title} · ${tile.area}` : category.title;
      const target = this.category(this.panel.target) || category;
      const positions = tile ? target.tiles.filter(key => key !== tile.key).map(key => ({ id: key, title: this.catalog.get(key).title })) : this.draft.filter(item => item.id !== category.id);
      content = `<form class="home-menu-form" data-home-form="move">${tile ? `<div class="home-menu-field"><label for="home-menu-target">Zielkategorie</label><select id="home-menu-target" name="target">${this.draft.map(item => {
        const duplicate = item.id !== category.id && item.tiles.includes(tile.key);
        return `<option value="${item.id}" ${item.id === target.id ? "selected" : ""} ${duplicate ? "disabled" : ""}>${this.escape(item.title)}${duplicate ? " · bereits vorhanden" : ""}</option>`;
      }).join("")}</select></div>` : ""}<div class="home-menu-field"><label for="home-menu-position">Position</label><select id="home-menu-position" name="before"><option value="">Am Ende</option>${positions.map(item => `<option value="${item.id}">Vor ${this.escape(item.title)}</option>`).join("")}</select></div><button class="primary-button" type="submit">${this.icon("move")} Verschieben</button></form>`;
    } else if (kind === "remove-category") {
      title = `„${category.title}“ entfernen?`;
      subtitle = "Die Kategorie und ihre Kacheln werden aus deinem Startmenü entfernt. Alle App-Bereiche und Daten bleiben erhalten.";
      content = `<div class="home-menu-actions">${this.button("dismiss", "Behalten")}${this.button("confirm-remove", "Kategorie entfernen", "trash", this.attributes(category), "secondary-button home-menu-danger")}</div>`;
    }
    return `<section class="home-menu-panel" id="home-menu-panel" aria-labelledby="home-menu-panel-title"><header><div><h2 id="home-menu-panel-title">${this.escape(title)}</h2>${subtitle ? `<p>${this.escape(subtitle)}</p>` : ""}</div>${this.iconButton("dismiss", "Schliessen", "close")}</header>${content}</section>`;
  }

  openPanel(panel) {
    this.panel = panel;
    this.menu = null;
    this.update({ panel: true });
  }

  changed(message, focus) {
    this.panel = null;
    this.menu = null;
    this.update({ focus: focus || '[data-home-action="save"]' });
    this.notify(message);
  }

  moveItem(categoryId, tileKey, targetId, before) {
    const source = this.category(categoryId), target = this.category(targetId);
    if (!source) return false;
    if (tileKey) {
      if (!source.tiles.includes(tileKey) || !target || (source !== target && target.tiles.includes(tileKey)) || before === tileKey) return false;
      source.tiles = source.tiles.filter(key => key !== tileKey);
      const at = target.tiles.indexOf(before);
      target.tiles.splice(at < 0 ? target.tiles.length : at, 0, tileKey);
    } else {
      if (before === source.id) return false;
      this.draft = this.draft.filter(item => item.id !== source.id);
      const at = this.draft.findIndex(item => item.id === before);
      this.draft.splice(at < 0 ? this.draft.length : at, 0, source);
    }
    return true;
  }

  save() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify({ version: 1, categories: this.draft }));
    } catch {
      this.update({ focus: '[data-home-action="save"]' });
      this.notify("Die Startseite konnte nicht im Browser gespeichert werden. Prüfe den Browserspeicher und versuche es erneut.");
      return;
    }
    this.saved = this.clone(this.draft);
    this.editing = false;
    this.panel = this.menu = null;
    this.update({ focus: '[data-home-action="edit"]' });
    this.notify("Deine Startseite wurde gespeichert.");
  }

  cancel() {
    this.draft = this.clone(this.saved);
    this.editing = false;
    this.panel = this.menu = null;
    this.update({ focus: '[data-home-action="edit"]' });
    this.notify("Änderungen verworfen.");
  }

  allowNavigation() {
    if (!this.editing) return true;
    if (this.dirty) {
      this.notify("Bitte speichere deine Startseite oder brich die Bearbeitung ab.");
      document.querySelector('[data-home-action="save"]')?.focus();
      return false;
    }
    this.editing = false;
    this.panel = this.menu = null;
    return true;
  }

  closeMenu() {
    if (!this.menu) return;
    this.menu = null;
    document.querySelectorAll(".home-menu-popover").forEach(node => node.remove());
    document.querySelectorAll('[data-home-action][aria-expanded="true"]').forEach(node => node.setAttribute("aria-expanded", "false"));
  }

  handleClick(event) {
    const control = event.target.closest("[data-home-action]");
    if (!control) {
      if (!event.target.closest(".home-menu-popover")) this.closeMenu();
      return false;
    }
    const action = control.dataset.homeAction;
    const category = this.category(control.dataset.homeCategory), tile = this.catalog.get(control.dataset.homeTile);
    if (action === "edit") {
      this.draft = this.clone(this.saved);
      this.editing = true;
      this.update({ focus: '[data-home-action="save"]' });
      document.querySelector(".home-menu-toolbar")?.scrollIntoView({ block: "start" });
      return true;
    }
    if (!this.editing) return true;
    if (action === "save") this.save();
    if (action === "cancel") this.cancel();
    if (action === "dismiss") {
      this.panel = null;
      this.update({ focus: '[data-home-action="save"]' });
    }
    if (action === "tile-menu" || action === "category-menu") {
      const next = { category: category.id, tile: tile?.key };
      this.menu = this.menu?.category === next.category && this.menu?.tile === next.tile ? null : next;
      this.panel = null;
      this.update({ focus: this.menu ? '.home-menu-popover button' : `[data-home-action="${action}"][data-home-category="${category.id}"]${tile ? `[data-home-tile="${tile.key}"]` : ""}` });
    }
    if (["add-category", "rename", "add-tile", "move"].includes(action)) this.openPanel({ kind: action, category: category?.id, tile: tile?.key, target: category?.id });
    if (action === "remove" && tile) {
      category.tiles = category.tiles.filter(key => key !== tile.key);
      this.changed(`„${tile.title}“ aus „${category.title}“ entfernt.`);
    }
    if (action === "remove" && !tile) this.openPanel({ kind: "remove-category", category: category.id });
    if (action === "confirm-remove") {
      this.draft = this.draft.filter(item => item.id !== category.id);
      this.changed(`Kategorie „${category.title}“ entfernt.`);
    }
    return true;
  }

  handleSubmit(event) {
    const form = event.target.closest("[data-home-form]");
    if (!form || !this.editing) return false;
    event.preventDefault();
    const values = new FormData(form), category = this.category(this.panel.category);
    if (form.dataset.homeForm === "category") {
      const name = String(values.get("name") || "").trim(), input = form.elements.namedItem("name");
      if (!name || this.draft.some(item => item.id !== category?.id && item.title.toLocaleLowerCase() === name.toLocaleLowerCase())) {
        input.setCustomValidity(name ? "Diese Kategorie existiert bereits." : "Bitte einen Namen eingeben.");
        input.reportValidity();
        return true;
      }
      if (category) category.title = name;
      else this.draft.push({ id: `custom-${globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`}`, title: name, tiles: [] });
      this.changed(category ? "Kategorie umbenannt." : "Kategorie hinzugefügt.");
    }
    if (form.dataset.homeForm === "tiles") {
      const keys = [...new Set(values.getAll("home-tile"))].filter(key => this.catalog.has(key) && !category.tiles.includes(key));
      if (!keys.length) return true;
      category.tiles.push(...keys);
      this.changed(`${keys.length} ${keys.length === 1 ? "Kachel" : "Kacheln"} zu „${category.title}“ hinzugefügt.`);
    }
    if (form.dataset.homeForm === "move" && this.moveItem(category.id, this.panel.tile, values.get("target"), values.get("before"))) this.changed(`${this.panel.tile ? "Kachel" : "Kategorie"} verschoben.`);
    return true;
  }

  handleChange(event) {
    if (event.target.id === "home-menu-target") {
      this.panel.target = event.target.value;
      this.update({ focus: "#home-menu-position" });
    }
    if (event.target.name === "home-tile") {
      const form = event.target.closest("form");
      form.querySelector('[type="submit"]').disabled = !form.querySelector('input[name="home-tile"]:checked:not(:disabled)');
    }
  }

  handleKeydown(event) {
    if (event.key === "Escape" && this.drag) {
      event.preventDefault();
      this.clearDrag(document.querySelector("#app-main"));
      return true;
    }
    if (event.key !== "Escape" || (!this.menu && !this.panel)) return false;
    event.preventDefault();
    const menu = this.menu;
    this.panel = this.menu = null;
    this.update({ focus: menu ? `[data-home-action="${menu.tile ? "tile-menu" : "category-menu"}"][data-home-category="${menu.category}"]${menu.tile ? `[data-home-tile="${menu.tile}"]` : ""}` : '[data-home-action="save"]' });
    return true;
  }

  // Preview state is separate from the draft: Escape and dragend never need to undo data changes.
  previewTilePosition(targetId, before) {
    const drag = this.drag, source = this.category(drag?.category), target = this.category(targetId);
    if (!drag?.tile || !source?.tiles.includes(drag.tile) || !target
      || (source !== target && target.tiles.includes(drag.tile))) {
      if (drag) drag.destination = null;
      return false;
    }
    drag.destination = { category: targetId, before: before && before !== drag.tile && target.tiles.includes(before) ? before : null };
    return true;
  }

  tileInsertionBefore(rectangles, x, y) {
    // Row-major insertion, including the gaps and partial last row of a responsive CSS grid.
    return rectangles.find(rect => y < rect.top || (y <= rect.bottom && x < rect.left + rect.width / 2))?.key ?? null;
  }

  pointerMotion(event) {
    // Include scrolling so native edge scrolling can advance the destination even
    // when the pointer stays near the viewport edge.
    const point = { x: event.clientX + (globalThis.scrollX || 0), y: event.clientY + (globalThis.scrollY || 0) };
    const previous = this.drag.pointer;
    const dx = previous ? point.x - previous.x : 0, dy = previous ? point.y - previous.y : 0;
    const moved = !previous || Math.hypot(dx, dy) >= 3;
    if (moved) this.drag.pointer = point;
    return { ...point, dx, dy, moved };
  }

  entryInsertionBefore(rectangles, placeholder, currentBefore, point, motion, scope, vertical = false) {
    const currentIndex = currentBefore ? rectangles.findIndex(rect => rect.key === currentBefore) : rectangles.length;
    const hitIndex = rectangles.findIndex(rect => point.y >= rect.top && point.y <= rect.bottom
      && (vertical || (point.x >= rect.left && point.x <= rect.left + rect.width)));
    let before;
    if (hitIndex >= 0) {
      const hit = rectangles[hitIndex];
      const axis = vertical || Math.abs(motion.dy) > Math.abs(motion.dx) ? "y" : "x";
      const delta = axis === "y" ? motion.dy : motion.dx;
      const coordinate = axis === "y" ? point.y : point.x;
      const start = axis === "y" ? hit.top : hit.left;
      const size = axis === "y" ? hit.bottom - hit.top : hit.width;
      const inset = Math.min(6, size / 4);
      if (!delta || (delta > 0 ? coordinate < start + inset : coordinate > start + size - inset)) return currentBefore;
      if (placeholder) {
        const towardX = vertical ? 0 : hit.left + hit.width / 2 - (placeholder.left + placeholder.width / 2);
        const towardY = (hit.top + hit.bottom) / 2 - (placeholder.top + placeholder.bottom) / 2;
        if (motion.dx * towardX + motion.dy * towardY <= 0) return currentBefore;
      }
      // Entering a tile ahead of the placeholder moves past it; entering a tile
      // behind the placeholder moves before it. The midpoint is no longer a gate.
      before = hitIndex < currentIndex ? hit.key : rectangles[hitIndex + 1]?.key ?? null;
    } else {
      if (placeholder && point.y >= placeholder.top && point.y <= placeholder.bottom
        && (vertical || (point.x >= placeholder.left && point.x <= placeholder.left + placeholder.width))) return currentBefore;
      before = vertical ? this.categoryInsertionBefore(rectangles, point.y) : this.tileInsertionBefore(rectangles, point.x, point.y);
    }
    if (before === currentBefore) return currentBefore;
    const nextIndex = before ? rectangles.findIndex(rect => rect.key === before) : rectangles.length;
    const direction = Math.sign(nextIndex - currentIndex);
    const last = this.drag.entrySwitch;
    if (last?.scope === scope && direction === -last.direction
      && Math.hypot(motion.x - last.x, motion.y - last.y) < 12) return currentBefore;
    this.drag.entrySwitch = { scope, direction, x: motion.x, y: motion.y };
    return before;
  }

  capturePositions(root, categories = this.drag?.kind === "category") {
    const selector = categories ? ".home-menu-category:not(.home-menu-drag-source)" : ".home-menu-tile:not(.home-menu-drag-source)";
    return [...(root?.querySelectorAll(selector) || [])].map(node => {
      if (categories) {
        const category = node.classList.contains("home-menu-category-placeholder") ? this.drag?.category : node.dataset.homeCategory;
        const rect = node.getBoundingClientRect();
        return { node, key: `category:${category}`, categories: true, left: rect.left, top: rect.top };
      }
      const category = node.closest(".home-menu-category")?.dataset.homeCategory;
      const tile = node.classList.contains("home-menu-placeholder") ? this.drag?.tile : node.dataset.homeTile;
      const rect = node.getBoundingClientRect();
      return { node, key: `tile:${category}:${tile}`, categories: false, left: rect.left, top: rect.top };
    });
  }

  animatePositions(root, previous) {
    // Capture the current visual positions before cancelling an unfinished movement.
    // This lets frequent drag updates continue smoothly instead of snapping back.
    for (const animation of this.positionAnimations.values()) animation.cancel();
    this.positionAnimations.clear();
    if (!previous.length || globalThis.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const byNode = new Map(previous.map(position => [position.node, position]));
    const byKey = new Map(previous.map(position => [position.key, position]));
    for (const position of this.capturePositions(root, previous[0].categories)) {
      const before = byNode.get(position.node) || byKey.get(position.key);
      if (!before || !position.node.animate) continue;
      const x = before.left - position.left, y = before.top - position.top;
      if (Math.abs(x) < .5 && Math.abs(y) < .5) continue;
      const animation = position.node.animate([
        { transform: `translate(${x}px, ${y}px)` },
        { transform: "translate(0, 0)" }
      ], { duration: 160, easing: "cubic-bezier(.2, 0, .2, 1)" });
      this.positionAnimations.set(position.node, animation);
      const cleanup = () => {
        if (this.positionAnimations.get(position.node) === animation) this.positionAnimations.delete(position.node);
      };
      animation.onfinish = cleanup;
      animation.oncancel = cleanup;
    }
  }

  layoutRect(node) {
    const rect = node.getBoundingClientRect();
    // Hit-test the final grid slots, independent of the visual animation offset.
    // Otherwise tiles moving under the pointer could repeatedly change the drop target.
    let x = 0, y = 0;
    for (let ancestor = node; ancestor; ancestor = ancestor.parentElement) {
      const transform = this.positionAnimations.has(ancestor) ? getComputedStyle(ancestor).transform : "none";
      if (transform === "none") continue;
      const offset = new DOMMatrixReadOnly(transform);
      x += offset.m41;
      y += offset.m42;
    }
    return { left: rect.left - x, top: rect.top - y, bottom: rect.bottom - y, width: rect.width, height: rect.height };
  }

  placePlaceholder(root, grid, next) {
    const placeholder = this.drag?.placeholder;
    if (!placeholder || !grid || (placeholder.parentElement === grid && placeholder.nextElementSibling === next)) return;
    const positions = this.capturePositions(root);
    grid.insertBefore(placeholder, next);
    this.animatePositions(root, positions);
  }

  commitTileDrag() {
    const drag = this.drag;
    if (!drag?.tile || !drag.destination) return false;
    const previous = this.clone(this.draft);
    if (!this.moveItem(drag.category, drag.tile, drag.destination.category, drag.destination.before)
      || JSON.stringify(previous) === JSON.stringify(this.draft)) return false;
    this.changed("Kachel verschoben.");
    return true;
  }

  startTilePreview(root, handle, event) {
    const source = handle.closest(".home-menu-tile"), drag = this.drag;
    if (!source) return;
    const rect = source.getBoundingClientRect();
    const placeholder = source.cloneNode(true);
    placeholder.classList.add("home-menu-placeholder");
    placeholder.removeAttribute("data-home-tile");
    placeholder.setAttribute("aria-hidden", "true");
    placeholder.setAttribute("inert", "");
    placeholder.querySelectorAll(".home-menu-tile-grip, .home-menu-tile-actions, .home-menu-popover").forEach(node => node.remove());
    const face = placeholder.querySelector(".nav-tile");
    face.removeAttribute("data-home-action");
    face.disabled = true;
    drag.source = source;
    drag.placeholder = placeholder;
    drag.grid = source.parentElement;
    drag.minHeight = drag.grid.style.minHeight;
    drag.grid.style.minHeight = `${drag.grid.getBoundingClientRect().height}px`;
    drag.destination = { category: drag.category, before: this.category(drag.category).tiles[this.category(drag.category).tiles.indexOf(drag.tile) + 1] ?? null };
    event.dataTransfer.setDragImage(source, Math.max(0, event.clientX - rect.left), Math.max(0, event.clientY - rect.top));
    // Keep the native drag source attached. Moving it out of the layout after the browser
    // captures its drag image avoids cancelling the native drag or showing it twice.
    drag.frame = requestAnimationFrame(() => {
      if (this.drag !== drag) return;
      drag.frame = null;
      this.activateDragPreview(root);
    });
  }

  activateDragPreview(root) {
    const drag = this.drag;
    if (!drag?.source || drag.active) return;
    if (drag.frame != null) cancelAnimationFrame(drag.frame);
    drag.frame = null;
    drag.source.classList.add("home-menu-drag-source");
    drag.source.before(drag.placeholder);
    root.classList.add("home-menu-dragging");
    if (drag.kind === "category") root.classList.add("home-menu-category-dragging");
    drag.active = true;
  }

  previewTileDrag(root, event) {
    this.activateDragPreview(root);
    const drag = this.drag;
    const category = event.target.closest(".home-menu-category");
    root.querySelectorAll(".home-menu-drop-invalid").forEach(node => node.classList.remove("home-menu-drop-invalid"));
    if (!category) {
      drag.destination = null;
      if (drag.placeholder?.isConnected) this.placePlaceholder(root, drag.grid, drag.source);
      return false;
    }
    const grid = category.querySelector(".tile-grid");
    const motion = this.pointerMotion(event);
    if (!motion.moved && drag.destination) return drag.destination.category === category.dataset.homeCategory;
    const tiles = [...grid.querySelectorAll(".home-menu-tile:not(.home-menu-placeholder):not(.home-menu-drag-source)")];
    const rectangles = tiles.map(tile => {
      const rect = this.layoutRect(tile);
      return { key: tile.dataset.homeTile, left: rect.left, top: rect.top, bottom: rect.bottom, width: rect.width };
    });
    const before = drag.destination?.category === category.dataset.homeCategory
      ? this.entryInsertionBefore(rectangles, this.layoutRect(drag.placeholder), drag.destination.before,
        { x: event.clientX, y: event.clientY }, motion, category.dataset.homeCategory)
      : this.tileInsertionBefore(rectangles, event.clientX, event.clientY);
    if (!this.previewTilePosition(category.dataset.homeCategory, before)) {
      category.classList.add("home-menu-drop-invalid");
      if (drag.placeholder?.isConnected) this.placePlaceholder(root, drag.grid, drag.source);
      return false;
    }
    const next = tiles.find(tile => tile.dataset.homeTile === before) || null;
    this.placePlaceholder(root, grid, next);
    return true;
  }

  previewCategoryPosition(before) {
    const drag = this.drag;
    if (drag?.kind !== "category" || !this.category(drag.category)
      || (before && (before === drag.category || !this.category(before)))) {
      if (drag) drag.destination = null;
      return false;
    }
    drag.destination = { before: before || null };
    return true;
  }

  categoryInsertionBefore(rectangles, y) {
    return rectangles.find(rect => y < rect.top + rect.height / 2)?.key ?? null;
  }

  commitCategoryDrag() {
    const drag = this.drag;
    if (drag?.kind !== "category" || !drag.destination) return false;
    const previous = this.clone(this.draft);
    if (!this.moveItem(drag.category, null, null, drag.destination.before)
      || JSON.stringify(previous) === JSON.stringify(this.draft)) return false;
    this.changed("Kategorie verschoben.");
    return true;
  }

  startCategoryPreview(root, handle, event) {
    const source = handle.closest(".home-menu-category"), drag = this.drag;
    if (!source) return;
    const rect = source.getBoundingClientRect();
    const placeholder = source.cloneNode(true);
    placeholder.classList.add("home-menu-category-placeholder");
    placeholder.removeAttribute("data-home-category");
    placeholder.removeAttribute("aria-labelledby");
    placeholder.setAttribute("aria-hidden", "true");
    placeholder.setAttribute("inert", "");
    placeholder.style.height = `${rect.height}px`;
    placeholder.querySelectorAll("[id]").forEach(node => node.removeAttribute("id"));
    placeholder.querySelectorAll("[draggable]").forEach(node => node.removeAttribute("draggable"));
    placeholder.querySelectorAll(".home-menu-popover").forEach(node => node.remove());
    drag.source = source;
    drag.placeholder = placeholder;
    drag.grid = source.parentElement;
    drag.minHeight = drag.grid.style.minHeight;
    drag.grid.style.minHeight = `${drag.grid.getBoundingClientRect().height}px`;
    drag.destination = { before: this.draft[this.draft.findIndex(category => category.id === drag.category) + 1]?.id ?? null };
    event.dataTransfer.setDragImage(source, Math.max(0, event.clientX - rect.left), Math.max(0, event.clientY - rect.top));
    drag.frame = requestAnimationFrame(() => {
      if (this.drag !== drag) return;
      drag.frame = null;
      this.activateDragPreview(root);
    });
  }

  previewCategoryDrag(root, event) {
    this.activateDragPreview(root);
    const drag = this.drag;
    if (event.target.closest(".home-menu-editing") !== drag.grid) {
      drag.destination = null;
      if (drag.placeholder?.isConnected) this.placePlaceholder(root, drag.grid, drag.source);
      return false;
    }
    const categories = [...drag.grid.querySelectorAll(".home-menu-category:not(.home-menu-category-placeholder):not(.home-menu-drag-source)")];
    const motion = this.pointerMotion(event);
    if (!motion.moved && drag.destination) return true;
    const rectangles = categories.map(category => {
      const rect = this.layoutRect(category);
      return { key: category.dataset.homeCategory, top: rect.top, bottom: rect.bottom, height: rect.height };
    });
    const before = drag.destination
      ? this.entryInsertionBefore(rectangles, this.layoutRect(drag.placeholder), drag.destination.before,
        { x: event.clientX, y: event.clientY }, motion, "categories", true)
      : this.categoryInsertionBefore(rectangles, event.clientY);
    if (!this.previewCategoryPosition(before)) return false;
    const next = categories.find(category => category.dataset.homeCategory === before)
      || drag.grid.querySelector('[data-home-action="add-category"]');
    this.placePlaceholder(root, drag.grid, next);
    return true;
  }

  clearDrag(root) {
    const drag = this.drag;
    if (!drag) return;
    const positions = this.capturePositions(root);
    if (drag?.frame != null) cancelAnimationFrame(drag.frame);
    drag?.placeholder?.remove();
    drag?.source?.classList.remove("home-menu-drag-source");
    if (drag?.grid) drag.grid.style.minHeight = drag.minHeight;
    root?.classList.remove("home-menu-dragging", "home-menu-category-dragging");
    root?.querySelectorAll(".home-menu-drop, .home-menu-drop-invalid").forEach(node => node.classList.remove("home-menu-drop", "home-menu-drop-invalid"));
    this.drag = null;
    this.animatePositions(root, positions);
  }

  bindDrag(root) {
    root.addEventListener("dragenter", event => {
      if (this.drag && event.target.closest(this.drag.tile ? ".home-menu-category" : ".home-menu-editing")) event.preventDefault();
    });
    root.addEventListener("dragstart", event => {
      const handle = event.target.closest("[data-home-drag]");
      if (!this.editing || !handle) return;
      this.closeMenu();
      this.drag = { category: handle.dataset.homeCategory, tile: handle.dataset.homeTile, kind: handle.dataset.homeDrag };
      this.pointerMotion(event);
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", "acme-home-menu");
      if (this.drag.tile) this.startTilePreview(root, handle, event);
      else this.startCategoryPreview(root, handle, event);
    });
    root.addEventListener("dragover", event => {
      if (!this.drag) return;
      if (this.drag.tile) {
        event.preventDefault();
        event.dataTransfer.dropEffect = this.previewTileDrag(root, event) ? "move" : "none";
        return;
      }
      event.preventDefault();
      event.dataTransfer.dropEffect = this.previewCategoryDrag(root, event) ? "move" : "none";
    });
    root.addEventListener("drop", event => {
      if (!this.drag) return;
      event.preventDefault();
      if (this.drag.tile) {
        // Commit precisely the last visible placeholder position, not a fresh hit-test
        // against tiles which have already moved aside for that placeholder.
        const target = event.target.closest(".home-menu-category");
        if (target?.dataset.homeCategory === this.drag.destination?.category) this.commitTileDrag();
        this.clearDrag(root);
        return;
      }
      if (event.target.closest(".home-menu-editing") === this.drag.grid) this.commitCategoryDrag();
      this.clearDrag(root);
    });
    root.addEventListener("dragend", () => this.clearDrag(root));
  }
}
