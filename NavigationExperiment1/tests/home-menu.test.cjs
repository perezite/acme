const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

function fixture() {
  const stored = new Map(), notifications = [];
  let storageFails = false;
  const context = vm.createContext({
    localStorage: { getItem: key => stored.get(key) || null, setItem: (key, value) => {
      if (storageFails) throw new Error("Storage unavailable");
      stored.set(key, value);
    } },
    document: { querySelector: () => null, querySelectorAll: () => [] }
  });
  vm.runInContext(fs.readFileSync(path.join(__dirname, "../home-menu.js"), "utf8") + "\nglobalThis.Editor = HomeMenuEditor;", context);
  const options = {
    modules: ["eins", "zwei", "drei", "vier"].map(id => ({ id, title: id, group: "Arbeit", icon: "folder", desc: id })),
    groups: [
      { title: "Arbeit", ids: ["eins", "zwei", "drei"] },
      { title: "Andere", ids: ["vier"] },
      { title: "Daten", kind: "data", ids: ["eins"] }
    ],
    icon: () => "", escape: String, render: () => {}, notify: message => notifications.push(message)
  };
  const editor = new context.Editor(options);
  editor.update = () => {};
  editor.editing = true;
  const start = (category = "category-0", tile = "module:eins") => {
    editor.drag = { category, tile, kind: "tile", destination: null };
  };
  const tiles = id => Array.from(editor.category(id).tiles);
  const startCategory = (category = "category-0") => {
    editor.drag = { category, kind: "category", destination: null };
  };
  const order = () => Array.from(editor.draft, category => category.id);
  return { editor, start, startCategory, order, tiles, notifications, failStorage: () => { storageFails = true; }, reload: () => new context.Editor(options),
    setScroll: (x, y) => { context.scrollX = x; context.scrollY = y; } };
}

test("Die Live-Vorschau ändert keine Daten und zeigt keine Meldung", () => {
  const { editor, start, tiles, notifications } = fixture();
  start();
  editor.previewTilePosition("category-0", "module:drei");
  editor.previewTilePosition("category-1", null);
  assert.deepEqual(tiles("category-0"), ["module:eins", "module:zwei", "module:drei"]);
  assert.deepEqual(tiles("category-1"), ["module:vier"]);
  assert.equal(editor.dirty, false);
  assert.deepEqual(notifications, []);
});

test("Loslassen übernimmt genau die letzte angezeigte Einfügeposition", () => {
  const { editor, start, tiles } = fixture();
  start();
  editor.previewTilePosition("category-1", null);
  editor.previewTilePosition("category-0", "module:drei");
  editor.commitTileDrag();
  assert.deepEqual(tiles("category-0"), ["module:zwei", "module:eins", "module:drei"]);
  assert.deepEqual(tiles("category-1"), ["module:vier"]);
});

test("Die erste Kachel kann hinter die dritte einsortiert werden", () => {
  const { editor, start, tiles } = fixture();
  start();
  editor.previewTilePosition("category-0", null);
  editor.commitTileDrag();
  assert.deepEqual(tiles("category-0"), ["module:zwei", "module:drei", "module:eins"]);
});

test("Eine Kachel kann von rechts nach links einsortiert werden", () => {
  const { editor, start, tiles } = fixture();
  start("category-0", "module:drei");
  editor.previewTilePosition("category-0", "module:eins");
  editor.commitTileDrag();
  assert.deepEqual(tiles("category-0"), ["module:drei", "module:eins", "module:zwei"]);
});

test("Kategorieübergreifendes Ziehen fügt vor der Zielkachel ein", () => {
  const { editor, start, tiles } = fixture();
  start("category-0", "module:zwei");
  editor.previewTilePosition("category-1", "module:vier");
  editor.commitTileDrag();
  assert.deepEqual(tiles("category-0"), ["module:eins", "module:drei"]);
  assert.deepEqual(tiles("category-1"), ["module:zwei", "module:vier"]);
});

test("Leere Kategorien können als Ziel gewählt werden", () => {
  const { editor, start, tiles } = fixture();
  editor.category("category-1").tiles = [];
  start();
  editor.previewTilePosition("category-1", null);
  editor.commitTileDrag();
  assert.deepEqual(tiles("category-1"), ["module:eins"]);
});

test("Rohdaten-Kacheln behalten ihre Identität", () => {
  const { editor, start, tiles } = fixture();
  start("category-2", "data:eins");
  editor.previewTilePosition("category-0", "module:eins");
  editor.commitTileDrag();
  assert.deepEqual(tiles("category-0"), ["data:eins", "module:eins", "module:zwei", "module:drei"]);
  assert.deepEqual(tiles("category-2"), []);
  assert.equal(editor.catalog.get(tiles("category-0")[0]).raw, true);
});

test("Ein ungültiges Ziel verwirft die letzte gültige Vorschau", () => {
  const { editor, start, tiles } = fixture();
  editor.category("category-1").tiles.push("module:eins");
  start();
  editor.previewTilePosition("category-0", "module:drei");
  assert.equal(editor.previewTilePosition("category-1", null), false);
  assert.equal(editor.commitTileDrag(), false);
  assert.deepEqual(tiles("category-0"), ["module:eins", "module:zwei", "module:drei"]);
});

test("Abbrechen des Ziehens behält Daten und zeigt keine Meldung", () => {
  const { editor, start, tiles, notifications } = fixture();
  start();
  editor.previewTilePosition("category-0", null);
  editor.clearDrag(null);
  assert.deepEqual(tiles("category-0"), ["module:eins", "module:zwei", "module:drei"]);
  assert.deepEqual(notifications, []);
  assert.equal(editor.drag, null);
});

test("Zur ursprünglichen Stelle zurückziehen erzeugt keine Änderung", () => {
  const { editor, start, notifications } = fixture();
  start();
  editor.previewTilePosition("category-0", "module:zwei");
  assert.equal(editor.commitTileDrag(), false);
  assert.equal(editor.dirty, false);
  assert.deepEqual(notifications, []);
});

test("Verschiebungen lassen sich vor dem Speichern mit Abbrechen verwerfen", () => {
  const { editor, start, tiles, reload } = fixture();
  start();
  editor.previewTilePosition("category-1", null);
  editor.commitTileDrag();
  editor.clearDrag(null);
  editor.cancel();
  assert.deepEqual(tiles("category-0"), ["module:eins", "module:zwei", "module:drei"]);
  assert.deepEqual(tiles("category-1"), ["module:vier"]);
  editor.editing = true;
  start();
  editor.previewTilePosition("category-0", null);
  editor.commitTileDrag();
  editor.clearDrag(null);
  editor.save();
  assert.deepEqual(Array.from(reload().category("category-0").tiles), ["module:zwei", "module:drei", "module:eins"]);
});

test("Die genaue Position kann weiterhin ohne Ziehen ausgewählt werden", () => {
  const { editor, tiles } = fixture();
  editor.moveItem("category-0", "module:eins", "category-0", "module:drei");
  assert.deepEqual(tiles("category-0"), ["module:zwei", "module:eins", "module:drei"]);
});

test("Einfügepositionen folgen den Zeilen und Kachelmitten im responsiven Raster", () => {
  const { editor } = fixture();
  const rectangles = [
    { key: "a", left: 0, top: 0, width: 100, bottom: 80 },
    { key: "b", left: 112, top: 0, width: 100, bottom: 80 },
    { key: "c", left: 0, top: 92, width: 100, bottom: 172 }
  ];
  assert.equal(editor.tileInsertionBefore(rectangles, 20, 40), "a");
  assert.equal(editor.tileInsertionBefore(rectangles, 75, 40), "b");
  assert.equal(editor.tileInsertionBefore(rectangles, 200, 40), "c");
  assert.equal(editor.tileInsertionBefore(rectangles, 20, 130), "c");
  assert.equal(editor.tileInsertionBefore(rectangles, 75, 130), null);
  assert.equal(editor.tileInsertionBefore(rectangles, 200, 85), "c");
  assert.equal(editor.tileInsertionBefore(rectangles, 0, 200), null);
  assert.equal(editor.tileInsertionBefore([], 0, 0), null);
});

test("Kategorie-Vorschauen ändern weder Reihenfolge noch Daten", () => {
  const { editor, startCategory, order, tiles, notifications } = fixture();
  startCategory();
  editor.previewCategoryPosition(null);
  editor.previewCategoryPosition("category-2");
  assert.deepEqual(order(), ["category-0", "category-1", "category-2"]);
  assert.deepEqual(tiles("category-0"), ["module:eins", "module:zwei", "module:drei"]);
  assert.equal(editor.dirty, false);
  assert.deepEqual(notifications, []);
});

test("Loslassen übernimmt die letzte Kategorie-Vorschau samt Kacheln", () => {
  const { editor, startCategory, order, tiles } = fixture();
  startCategory();
  editor.previewCategoryPosition("category-1");
  editor.previewCategoryPosition(null);
  editor.commitCategoryDrag();
  assert.deepEqual(order(), ["category-1", "category-2", "category-0"]);
  assert.deepEqual(tiles("category-0"), ["module:eins", "module:zwei", "module:drei"]);
});

test("Kategorien können nach oben einsortiert werden", () => {
  const { editor, startCategory, order } = fixture();
  startCategory("category-2");
  editor.previewCategoryPosition("category-0");
  editor.commitCategoryDrag();
  assert.deepEqual(order(), ["category-2", "category-0", "category-1"]);
});

test("Ein ungültiges Kategorie-Ziel löscht eine vorherige Vorschau", () => {
  const { editor, startCategory, order } = fixture();
  startCategory();
  editor.previewCategoryPosition(null);
  assert.equal(editor.previewCategoryPosition("missing"), false);
  assert.equal(editor.commitCategoryDrag(), false);
  assert.deepEqual(order(), ["category-0", "category-1", "category-2"]);
});

test("Abgebrochenes Kategorie-Ziehen erhält die Anordnung und zeigt keine Meldung", () => {
  const { editor, startCategory, order, notifications } = fixture();
  startCategory();
  editor.previewCategoryPosition(null);
  editor.clearDrag(null);
  assert.deepEqual(order(), ["category-0", "category-1", "category-2"]);
  assert.deepEqual(notifications, []);
});

test("Die bisherige Kategorie-Position erzeugt keine Meldung", () => {
  const { editor, startCategory, notifications } = fixture();
  startCategory();
  editor.previewCategoryPosition("category-1");
  assert.equal(editor.commitCategoryDrag(), false);
  assert.deepEqual(notifications, []);
  assert.equal(editor.dirty, false);
});

test("Kategorie-Verschiebungen unterstützen Abbrechen und Speicherung", () => {
  const { editor, startCategory, order, reload } = fixture();
  startCategory();
  editor.previewCategoryPosition(null);
  editor.commitCategoryDrag();
  editor.clearDrag(null);
  editor.cancel();
  assert.deepEqual(order(), ["category-0", "category-1", "category-2"]);
  editor.editing = true;
  startCategory("category-2");
  editor.previewCategoryPosition("category-0");
  editor.commitCategoryDrag();
  editor.clearDrag(null);
  editor.save();
  assert.deepEqual(Array.from(reload().draft, category => category.id), ["category-2", "category-0", "category-1"]);
});

test("Startseitenaktionen melden sich als Toast ohne statischen Text oder Rückgängig-Schaltfläche", () => {
  const { editor, start, startCategory, notifications } = fixture();
  start();
  editor.previewTilePosition("category-0", null);
  editor.commitTileDrag();
  editor.clearDrag(null);
  startCategory();
  editor.previewCategoryPosition(null);
  editor.commitCategoryDrag();
  editor.clearDrag(null);
  assert.deepEqual(notifications, ["Kachel verschoben.", "Kategorie verschoben."]);
  assert.doesNotMatch(editor.render(), /home-menu-notice|data-home-action="undo"|Kachel verschoben\.|Kategorie verschoben\./);
  editor.cancel();
  assert.equal(notifications.at(-1), "Änderungen verworfen.");
  assert.doesNotMatch(editor.render(), /Änderungen verworfen\./);
  editor.editing = true;
  editor.save();
  assert.equal(notifications.at(-1), "Deine Startseite wurde gespeichert.");
  assert.doesNotMatch(editor.render(), /Deine Startseite wurde gespeichert\./);
});

test("Ein Speicherfehler meldet sich als Toast und erhält die offenen Änderungen", () => {
  const { editor, start, notifications, failStorage, tiles } = fixture();
  start();
  editor.previewTilePosition("category-0", null);
  editor.commitTileDrag();
  editor.clearDrag(null);
  const saved = JSON.stringify(editor.saved);
  failStorage();
  editor.save();
  assert.equal(editor.editing, true);
  assert.equal(JSON.stringify(editor.saved), saved);
  assert.deepEqual(tiles("category-0"), ["module:zwei", "module:drei", "module:eins"]);
  assert.match(notifications.at(-1), /konnte nicht im Browser gespeichert werden/);
  assert.doesNotMatch(editor.render(), /konnte nicht im Browser gespeichert werden/);
});

test("Die Kategorie-Einfügeposition berücksichtigt unterschiedliche Gruppenhöhen", () => {
  const { editor } = fixture();
  const rectangles = [
    { key: "a", top: 0, height: 140 },
    { key: "b", top: 140, height: 240 },
    { key: "c", top: 380, height: 100 }
  ];
  assert.equal(editor.categoryInsertionBefore(rectangles, 69), "a");
  assert.equal(editor.categoryInsertionBefore(rectangles, 70), "b");
  assert.equal(editor.categoryInsertionBefore(rectangles, 259), "b");
  assert.equal(editor.categoryInsertionBefore(rectangles, 260), "c");
  assert.equal(editor.categoryInsertionBefore(rectangles, 430), null);
  assert.equal(editor.categoryInsertionBefore([], 0), null);
});

test("Eine Nachbarkachel reagiert bereits kurz hinter dem linken Rand", () => {
  const { editor, start } = fixture();
  start();
  const rectangles = [
    { key: "b", left: 112, top: 0, bottom: 80, width: 100 },
    { key: "c", left: 224, top: 0, bottom: 80, width: 100 }
  ];
  const placeholder = { left: 0, top: 0, bottom: 80, width: 100 };
  assert.equal(editor.entryInsertionBefore(rectangles, placeholder, "b", { x: 114, y: 40 },
    { dx: 8, dy: 0, x: 114, y: 40 }, "work"), "b", "Direkt am Rand bleibt eine kleine Toleranz");
  assert.equal(editor.entryInsertionBefore(rectangles, placeholder, "b", { x: 120, y: 40 },
    { dx: 6, dy: 0, x: 120, y: 40 }, "work"), "c", "Acht Pixel hinter dem Rand genügen, die Mitte liegt bei 162");
});

test("Eintritt von rechts funktioniert ebenfalls ohne Überschreiten der Kachelmitte", () => {
  const { editor, start } = fixture();
  start();
  const rectangles = [{ key: "a", left: 0, top: 0, bottom: 80, width: 100 }];
  const placeholder = { left: 112, top: 0, bottom: 80, width: 100 };
  assert.equal(editor.entryInsertionBefore(rectangles, placeholder, null, { x: 92, y: 40 },
    { dx: -8, dy: 0, x: 92, y: 40 }, "work"), "a");
});

test("Bewegung weg von einer nachgerückten Kachel löst kein Zurückschieben aus", () => {
  const { editor, start } = fixture();
  start();
  const rectangles = [{ key: "b", left: 112, top: 0, bottom: 80, width: 100 }];
  const placeholder = { left: 0, top: 0, bottom: 80, width: 100 };
  assert.equal(editor.entryInsertionBefore(rectangles, placeholder, "b", { x: 120, y: 40 },
    { dx: -4, dy: 0, x: 120, y: 40 }, "work"), "b");
});

test("Kleine Rückbewegungen werden abgefangen, bewusstes Zurückziehen bleibt möglich", () => {
  const { editor, start } = fixture();
  start();
  editor.drag.entrySwitch = { scope: "work", direction: 1, x: 100, y: 40 };
  const rectangles = [
    { key: "a", left: 0, top: 0, bottom: 80, width: 100 },
    { key: "c", left: 224, top: 0, bottom: 80, width: 100 }
  ];
  const placeholder = { left: 112, top: 0, bottom: 80, width: 100 };
  assert.equal(editor.entryInsertionBefore(rectangles, placeholder, "c", { x: 92, y: 40 },
    { dx: -4, dy: 0, x: 92, y: 40 }, "work"), "c");
  assert.equal(editor.entryInsertionBefore(rectangles, placeholder, "c", { x: 86, y: 40 },
    { dx: -6, dy: 0, x: 86, y: 40 }, "work"), "a");
});

test("Ein stillstehender Mauszeiger und minimale Unruhe zählen nicht als Bewegung", () => {
  const { editor, start } = fixture();
  start();
  editor.pointerMotion({ clientX: 120, clientY: 40 });
  assert.equal(editor.pointerMotion({ clientX: 120, clientY: 40 }).moved, false);
  assert.equal(editor.pointerMotion({ clientX: 121, clientY: 41 }).moved, false);
  assert.equal(editor.pointerMotion({ clientX: 124, clientY: 40 }).moved, true);
});

test("Am Seitenrand scrollende Inhalte können trotz ruhendem Zeiger weiter einsortiert werden", () => {
  const { editor, start, setScroll } = fixture();
  start();
  editor.pointerMotion({ clientX: 120, clientY: 40 });
  setScroll(0, 20);
  const motion = editor.pointerMotion({ clientX: 120, clientY: 40 });
  assert.equal(motion.moved, true);
  assert.equal(motion.dy, 20);
});

test("Kategorien reagieren kurz nach Eintritt und behalten ihre Vorschau unter dem Zeiger", () => {
  const { editor, startCategory } = fixture();
  startCategory();
  const rectangles = [
    { key: "b", top: 112, bottom: 312, height: 200 },
    { key: "c", top: 324, bottom: 424, height: 100 }
  ];
  const placeholder = { top: 0, bottom: 100, height: 100 };
  assert.equal(editor.entryInsertionBefore(rectangles, placeholder, "b", { x: 0, y: 120 },
    { dx: 0, dy: 8, x: 0, y: 120 }, "categories", true), "c");
  const shifted = [
    { key: "b", top: 0, bottom: 200, height: 200 },
    { key: "c", top: 324, bottom: 424, height: 100 }
  ];
  assert.equal(editor.entryInsertionBefore(shifted, { top: 212, bottom: 312, height: 100 }, "c", { x: 0, y: 220 },
    { dx: 0, dy: 8, x: 0, y: 220 }, "categories", true), "c");
});
