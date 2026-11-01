window.acmePrototype = {
  start: async function () {
    if (window.__acmePrototypeStarted) return;
    window.__acmePrototypeStarted = true;

const modules = [
  { id: "kunden", group: "Vertrieb", title: "Kunden", subtitle: "Kundenstamm", desc: "Kontakte & Unternehmen", icon: "users", action: "Kunden hinzufügen", statLabels: ["Aktive Kunden", "Neue Kontakte", "Offene Angebote", "Kundenzufriedenheit"], stats: ["248", "+18", "32", "96 %"], records: [
    ["Nordlicht Studio", "Design & Medien", "Mia Lehmann", "Aktiv", "Heute, 09:42", "28.400 €"], ["Bergwerk AG", "Industrie", "Noah Keller", "Aktiv", "Heute, 08:16", "64.200 €"], ["Komet Digital", "Technologie", "Lea Baumann", "In Prüfung", "Gestern, 16:38", "12.800 €"], ["Morgenrot GmbH", "Handel", "Mia Lehmann", "Aktiv", "Gestern, 14:05", "19.500 €"]], activities: ["Nordlicht Studio wurde als neuer Kunde angelegt", "Angebot #A-2408 an Bergwerk AG gesendet", "Kontaktdaten bei Komet Digital aktualisiert"] },
  { id: "angebote", group: "Vertrieb", title: "Angebote", subtitle: "Angebotsübersicht", desc: "Erstellen & nachverfolgen", icon: "file", action: "Neues Angebot", statLabels: ["Offene Angebote", "Angebotswert", "Gewonnen diesen Monat", "Abschlussquote"], stats: ["32", "184.600 €", "12", "38 %"], records: [
    ["Website-Relaunch", "Nordlicht Studio · A-2408", "Mia Lehmann", "In Prüfung", "Heute, 09:42", "28.400 €"], ["CRM Lizenzen Q4", "Bergwerk AG · A-2407", "Noah Keller", "Versendet", "Heute, 08:16", "64.200 €"], ["Support-Paket Plus", "Komet Digital · A-2402", "Lea Baumann", "Entwurf", "Gestern, 16:38", "12.800 €"], ["Kampagnen-Setup", "Morgenrot GmbH · A-2398", "Mia Lehmann", "Gewonnen", "Gestern, 14:05", "19.500 €"]], activities: ["Angebot A-2408 wurde zur Prüfung eingereicht", "Bergwerk AG hat das Angebot geöffnet", "Angebot A-2398 wurde gewonnen"] },
  { id: "vertraege", group: "Vertrieb", title: "Verträge", subtitle: "Vertragsverwaltung", desc: "Laufzeiten & Vereinbarungen", icon: "file", action: "Neuer Vertrag", statLabels: ["Aktive Verträge", "Laufen bald aus", "Vertragswert", "Zur Unterschrift"], stats: ["86", "6", "1,24 Mio. €", "4"], records: [
    ["Servicevertrag 2025", "Nordlicht Studio · V-1193", "Mia Lehmann", "Aktiv", "Heute, 09:42", "28.400 €"], ["Rahmenvertrag", "Bergwerk AG · V-1188", "Noah Keller", "Unterschrift", "Heute, 08:16", "64.200 €"], ["Wartung & Support", "Komet Digital · V-1162", "Lea Baumann", "Läuft bald aus", "Gestern, 16:38", "12.800 €"], ["Jahreslizenz", "Morgenrot GmbH · V-1141", "Mia Lehmann", "Aktiv", "Gestern, 14:05", "19.500 €"]], activities: ["Rahmenvertrag wartet auf Unterschrift", "Vertragsverlängerung für Komet Digital vorgemerkt", "Servicevertrag 2025 wurde aktualisiert"] },
  { id: "aktivitaeten", group: "Vertrieb", title: "Aktivitäten", subtitle: "Team-Aktivitäten", desc: "Termine & Kundenkontakte", icon: "calendar", action: "Aktivität planen", statLabels: ["Heute geplant", "Diese Woche", "Abgeschlossen", "Offene Aufgaben"], stats: ["8", "24", "16", "11"], records: [
    ["Kick-off Website-Relaunch", "Nordlicht Studio · 10:30 Uhr", "Mia Lehmann", "Geplant", "Heute", "45 Min."], ["Angebotsbesprechung", "Bergwerk AG · 13:00 Uhr", "Noah Keller", "Geplant", "Heute", "30 Min."], ["Support-Check-in", "Komet Digital · 15:30 Uhr", "Lea Baumann", "Vorbereiten", "Morgen", "30 Min."], ["Quartalsgespräch", "Morgenrot GmbH · 09:00 Uhr", "Mia Lehmann", "Abgeschlossen", "Gestern", "1 Std."]], activities: ["Nächstes Meeting: Kick-off mit Nordlicht Studio", "Noah hat eine Angebotsbesprechung eingetragen", "Quartalsgespräch mit Morgenrot abgeschlossen"] },
  { id: "projekte", group: "Projekte", title: "Projekte", subtitle: "Projektübersicht", desc: "Planung & Umsetzung", icon: "folder", action: "Neues Projekt", statLabels: ["Laufende Projekte", "Im Zeitplan", "Team-Auslastung", "Abgeschlossene Projekte"], stats: ["12", "83 %", "76 %", "28"], records: [
    ["Website-Relaunch", "Nordlicht Studio · PR-104", "Mia Lehmann", "In Arbeit", "Heute, 09:42", "72 %"], ["CRM-Migration", "Bergwerk AG · PR-101", "Noah Keller", "In Arbeit", "Heute, 08:16", "48 %"], ["Kampagnen-Setup", "Morgenrot GmbH · PR-098", "Lea Baumann", "Planung", "Gestern, 16:38", "24 %"], ["Kundenportal", "Komet Digital · PR-091", "Mia Lehmann", "Abgeschlossen", "Gestern, 14:05", "100 %"]], activities: ["Design-Review für Website-Relaunch morgen um 10:30", "CRM-Migration: 3 Aufgaben als erledigt markiert", "Kundenportal wurde erfolgreich abgeschlossen"] },
  { id: "aufgaben", group: "Projekte", title: "Aufgaben", subtitle: "Aufgabenboard", desc: "Zuweisungen & Fristen", icon: "check", action: "Neue Aufgabe", statLabels: ["Offene Aufgaben", "Heute fällig", "Überfällig", "Erledigt diese Woche"], stats: ["48", "8", "3", "26"], records: [
    ["Startseite finalisieren", "Website-Relaunch", "Mia Lehmann", "In Arbeit", "Heute, 17:00", "Hoch"], ["Daten importieren", "CRM-Migration", "Noah Keller", "Offen", "Heute, 17:00", "Hoch"], ["Texte freigeben", "Kampagnen-Setup", "Lea Baumann", "Überfällig", "Gestern, 12:00", "Mittel"], ["Testfälle prüfen", "Kundenportal", "Mia Lehmann", "Erledigt", "Gestern, 14:05", "Niedrig"]], activities: ["Du hast 2 Aufgaben mit hoher Priorität", "Lea hat „Texte freigeben“ als überfällig markiert", "26 Aufgaben wurden diese Woche abgeschlossen"] },
  { id: "ressourcen", group: "Projekte", title: "Ressourcen", subtitle: "Team & Kapazitäten", desc: "Verfügbarkeit im Blick", icon: "users", action: "Ressource zuweisen", statLabels: ["Teammitglieder", "Verfügbar", "Durchschnittliche Auslastung", "Abwesenheiten"], stats: ["18", "5", "76 %", "2"], records: [
    ["Mia Lehmann", "Projektleitung", "Team Vertrieb", "Verfügbar", "Heute, 09:42", "82 %"], ["Noah Keller", "Consultant", "Team Projekte", "Verfügbar", "Heute, 08:16", "74 %"], ["Lea Baumann", "Design", "Team Projekte", "Ausgelastet", "Gestern, 16:38", "98 %"], ["Jonas Frei", "Entwicklung", "Team Technik", "Abwesend", "Gestern, 14:05", "0 %"]], activities: ["Lea Baumann erreicht diese Woche 98 % Auslastung", "Jonas Frei ist bis Freitag abwesend", "5 Teammitglieder haben noch freie Kapazität"] },
  { id: "zeiterfassung", group: "Projekte", title: "Zeiterfassung", subtitle: "Erfasste Stunden", desc: "Zeiten buchen & auswerten", icon: "clock", action: "Zeit erfassen", statLabels: ["Stunden diese Woche", "Noch nicht gebucht", "Abrechenbar", "Team im Fokus"], stats: ["186,5 h", "4,5 h", "142 h", "18"], records: [
    ["Website-Relaunch", "Mia Lehmann · Heute 2,5 h", "Mia Lehmann", "Freigegeben", "Heute, 11:20", "2,5 h"], ["CRM-Migration", "Noah Keller · Heute 3 h", "Noah Keller", "Zur Prüfung", "Heute, 10:05", "3 h"], ["Kampagnen-Setup", "Lea Baumann · Gestern 4 h", "Lea Baumann", "Freigegeben", "Gestern, 16:38", "4 h"], ["Kundenportal", "Jonas Frei · Gestern 6 h", "Jonas Frei", "Freigegeben", "Gestern, 14:05", "6 h"]], activities: ["Noah hat 3 Stunden zur Prüfung eingereicht", "Diese Woche wurden 142 Stunden abgerechnet", "Dir fehlen noch 4,5 Stunden für diese Woche"] },
  { id: "rechnungen", group: "Finanzen", title: "Rechnungen", subtitle: "Rechnungsübersicht", desc: "Eingänge & Zahlungsläufe", icon: "file", action: "Neue Rechnung", statLabels: ["Offene Rechnungen", "Überfällig", "Eingang diesen Monat", "Durchschnittliche Zahlung"], stats: ["12", "3", "84.200 €", "18 Tage"], records: [
    ["Rechnung #R-2098", "Nordlicht Studio · fällig 08.11.", "Mia Lehmann", "Offen", "Heute, 09:42", "8.400 €"], ["Rechnung #R-2093", "Bergwerk AG · fällig 03.11.", "Noah Keller", "Überfällig", "Heute, 08:16", "14.200 €"], ["Rechnung #R-2089", "Komet Digital · fällig 12.11.", "Lea Baumann", "Versendet", "Gestern, 16:38", "4.800 €"], ["Rechnung #R-2082", "Morgenrot GmbH · bezahlt", "Mia Lehmann", "Bezahlt", "Gestern, 14:05", "9.500 €"]], activities: ["Rechnung R-2098 an Nordlicht Studio versendet", "Rechnung R-2093 ist seit 3 Tagen überfällig", "Zahlung von Morgenrot GmbH eingegangen"] },
  { id: "kosten", group: "Finanzen", title: "Kosten", subtitle: "Kostenübersicht", desc: "Ausgaben & Belege", icon: "coins", action: "Kosten erfassen", statLabels: ["Ausgaben diesen Monat", "Zur Freigabe", "Belege erfasst", "Zum Budget"], stats: ["24.860 €", "6", "42", "68 %"], records: [
    ["Cloud-Infrastruktur", "Technik · monatlich", "Jonas Frei", "Freigegeben", "Heute, 09:42", "4.820 €"], ["Kampagnenbudget", "Marketing · Q4", "Lea Baumann", "Zur Prüfung", "Heute, 08:16", "2.400 €"], ["Team-Workshop", "Personal · Zürich", "Mia Lehmann", "Freigegeben", "Gestern, 16:38", "1.250 €"], ["Softwarelizenzen", "Technik · jährlich", "Noah Keller", "Eingereicht", "Gestern, 14:05", "890 €"]], activities: ["Kampagnenbudget wartet auf Freigabe", "42 Belege wurden im Oktober erfasst", "Cloud-Infrastruktur liegt im Plan"] },
  { id: "budgets", group: "Finanzen", title: "Budgets", subtitle: "Budgetplanung", desc: "Planung & Kontrolle", icon: "pie", action: "Neues Budget", statLabels: ["Aktive Budgets", "Gesamtbudget", "Bisher verwendet", "Verbleibend"], stats: ["9", "268.000 €", "182.240 €", "85.760 €"], records: [
    ["Marketing Q4", "Marketing · bis 31.12.", "Lea Baumann", "Im Plan", "Heute, 09:42", "68 %"], ["Produktentwicklung", "Technik · bis 31.12.", "Noah Keller", "Achtung", "Heute, 08:16", "84 %"], ["Team & Personal", "Personal · bis 31.12.", "Mia Lehmann", "Im Plan", "Gestern, 16:38", "52 %"], ["Kundenprojekte", "Projekte · bis 31.12.", "Noah Keller", "Im Plan", "Gestern, 14:05", "74 %"]], activities: ["Produktentwicklung hat 84 % des Budgets verwendet", "Marketing Q4 liegt im geplanten Rahmen", "Budgetreview ist für Donnerstag angesetzt"] },
  { id: "berichte", group: "Finanzen", title: "Berichte", subtitle: "Auswertungen", desc: "Zahlen & Entwicklungen", icon: "chart", action: "Bericht erstellen", statLabels: ["Verfügbare Berichte", "Geplant", "Letzte Aktualisierung", "Datenabdeckung"], stats: ["18", "4", "Vor 12 Min.", "98 %"], records: [
    ["Umsatzübersicht", "Finanzen · monatlich", "Mia Lehmann", "Aktuell", "Heute, 09:42", "Oktober"], ["Projektstatus", "Projekte · wöchentlich", "Noah Keller", "Aktuell", "Heute, 08:16", "KW 44"], ["Kundenentwicklung", "Vertrieb · monatlich", "Lea Baumann", "Wird erstellt", "Gestern, 16:38", "Oktober"], ["Team-Auslastung", "Ressourcen · wöchentlich", "Mia Lehmann", "Aktuell", "Gestern, 14:05", "KW 44"]], activities: ["Umsatzübersicht wurde vor 12 Minuten aktualisiert", "Kundenentwicklung wird gerade erstellt", "Der Wochenbericht ist für Montag geplant"] }
];

const groups = [
  { title: "Daten", subtitle: "Kompakte Rohdatenansichten", kind: "data", ids: ["kunden", "projekte"] },
  { title: "Vertrieb", subtitle: "Kundenbeziehungen und Verkaufsprozesse", ids: ["kunden", "angebote", "vertraege", "aktivitaeten"] },
  { title: "Projekte", subtitle: "Aufgaben, Teams und Zeiterfassung", ids: ["projekte", "aufgaben", "ressourcen", "zeiterfassung"] },
  { title: "Finanzen", subtitle: "Rechnungen, Kosten und Auswertungen", ids: ["rechnungen", "kosten", "budgets", "berichte"] }
];

const dataTableConfig = {
  kunden: {
    title: "Kunden",
    singular: "Kunde",
    statuses: ["Aktiv", "In Prüfung", "Offen", "Inaktiv"],
    columns: [
      { label: "Kundenname", index: 0 },
      { label: "Branche", index: 1 },
      { label: "Verantwortlich", index: 2 },
      { label: "Status", index: 3, type: "select" },
      { label: "Aktualisiert", index: 4, editable: false },
      { label: "Umsatz", index: 5 }
    ]
  },
  projekte: {
    title: "Projekte",
    singular: "Projekt",
    statuses: ["Planung", "In Arbeit", "Abgeschlossen", "Pausiert"],
    columns: [
      { label: "Projektname", index: 0 },
      { label: "Kunde / Kennung", index: 1 },
      { label: "Verantwortlich", index: 2 },
      { label: "Status", index: 3, type: "select" },
      { label: "Aktualisiert", index: 4, editable: false },
      { label: "Fortschritt", index: 5 }
    ]
  }
};

const rawModuleLabels = {
  angebote: "Angebot", vertraege: "Vertrag", aktivitaeten: "Aktivität", aufgaben: "Aufgabe",
  ressourcen: "Ressource", zeiterfassung: "Zeiteintrag", rechnungen: "Rechnung", kosten: "Kosten",
  budgets: "Budget", berichte: "Bericht"
};
const relationDefinitions = [
  { from: "projekte", to: "kunden", columnIndex: 1, match: (record, target) => record[1] === target[0] || record[1].startsWith(`${target[0]} ·`) },
  { from: "angebote", to: "kunden", columnIndex: 1, match: (record, target) => record[1].includes(target[0]) },
  { from: "vertraege", to: "kunden", columnIndex: 1, match: (record, target) => record[1].includes(target[0]) },
  { from: "aktivitaeten", to: "kunden", columnIndex: 1, match: (record, target) => record[1].includes(target[0]) },
  { from: "rechnungen", to: "kunden", columnIndex: 1, match: (record, target) => record[1].includes(target[0]) },
  { from: "aufgaben", to: "projekte", columnIndex: 1, match: (record, target) => record[1] === target[0] },
  { from: "zeiterfassung", to: "projekte", columnIndex: 0, match: (record, target) => record[0] === target[0] },
  ...modules.filter((item) => item.id !== "ressourcen").map((item) => ({
    from: item.id,
    to: "ressourcen",
    columnIndex: 2,
    match: (record, target) => record[2] === target[0]
  }))
];

const main = document.querySelector("#app-main");
const searchInput = document.querySelector("#global-search");
const searchResults = document.querySelector("#search-results");
const overlayRoot = document.querySelector("#overlay-root");
const onboardingRoot = document.querySelector("#onboarding-root");
const toastRoot = document.querySelector("#toast-root");
let currentModule = null;
let currentDataObject = null;
let tableFilter = "";
let onlyOpen = false;
let dataSearch = "";
let editingDataIndex = null;
let dataDraft = null;
let confirmDeleteIndex = null;
let dataEntityIds = {};
let dataRelations = [];
let apiReady = false;
let stateSaveTimer = null;
let dataNavigationPath = [];
let dataSelectedEntityId = null;
let dataActiveRelationObject = null;
let dataSelectedTargetEntityId = null;
let relationEditing = null;
let relationDraft = null;
let mobileDataDrafts = new Map();
const mobileReferenceEditKeys = new Set();
let mobilePickerState = null;
let mobileMasterPickerReturn = false;
const mobileMasterPickerMemory = new Map();
let onboardingStep = 0;
let onboardingReturnModule = null;
let onboardingReturnDataObject = null;
let onboardingReturnFocus = null;
let tourActive = false;
let tourTarget = null;
let tourTargetTabindex = null;

const onboardingSteps = [
  {
    route: "home",
    target: '[data-data-object="kunden"]',
    title: "Rohdaten für Kunden und Projekte",
    copy: "Die grauen Kacheln unter „Daten“ öffnen die Master-Detail-Ansicht: mit zwei Tabellen auf dem Desktop und editierbaren Datensatzkarten auf dem Smartphone."
  },
  {
    route: "daten-kunden",
    target: ".data-add",
    mobileTarget: '.mobile-card-actions [data-action="add-mobile-master"]',
    title: "Füge Datensätze direkt hinzu",
    copy: "Desktop fügt eine leere Tabellenzeile ein. Auf dem Smartphone erfasst du die Felder im Master-Formular und speicherst sie unten."
  },
  {
    route: "daten-kunden",
    target: '.data-sheet [data-action="edit-data-row"]',
    mobileTarget: ".mobile-master-card .mobile-record-field:not([readonly])",
    fallback: ".data-sheet-frame",
    title: "Bearbeite eine Zeile",
    copy: "Desktop bearbeitest du eine Tabellenzeile. Auf dem Smartphone kannst du Master- und Target-Felder direkt anpassen und unten gemeinsam speichern."
  },
  {
    route: "daten-kunden",
    target: '.data-sheet [data-action="delete-data-row"]',
    mobileTarget: '.mobile-master-card [data-action="delete-mobile-master"]',
    fallback: ".data-sheet-frame",
    title: "Lösche mit Bestätigung",
    copy: "Vor dem Löschen fragt Acme nach. So kannst du den Vorgang noch abbrechen."
  },
  {
    route: "home",
    target: "#global-search",
    title: "Springe direkt zu einem Bereich",
    copy: "Über die globale Suche findest du jeden Bereich. Mit Ctrl + K oder ⌘ + K kannst du sie jederzeit öffnen."
  },
  {
    route: "kunden",
    target: "#table-search",
    title: "Durchsuche die Kundenübersicht",
    copy: "Die Suche in der Übersicht filtert die Einträge nach Namen und Details. Diese Ansicht ergänzt die kompakte Rohdatentabelle."
  },
  {
    route: "kunden",
    target: '[data-action="filter"]',
    title: "Filtere die Kundenübersicht",
    copy: "Mit dem Filter kannst du die Liste auf offene Einträge eingrenzen und bei Bedarf wieder alle Kunden anzeigen."
  },
  {
    route: "kunden",
    target: '.avatar-button[data-action="profile"]',
    title: "Passe die Darstellung an",
    copy: "Im Profilmenü kannst du zwischen hellem und dunklem Erscheinungsbild wechseln."
  },
  {
    route: "kunden",
    target: '.icon-button[data-action="help"]',
    title: "Die Einführung bleibt erreichbar",
    copy: "Über dieses Hilfe-Symbol kannst du die Tour später jederzeit erneut starten."
  }
];

function hasDismissedOnboarding() {
  try { return localStorage.getItem("acme-onboarding-dismissed-v3") === "true"; }
  catch { return false; }
}

function rememberOnboardingDismissal() {
  try { localStorage.setItem("acme-onboarding-dismissed-v3", "true"); }
  catch { /* The tour remains dismissible for the current session. */ }
}

try {
  if (localStorage.getItem("acme-theme") === "dark") document.documentElement.dataset.theme = "dark";
} catch { /* Storage can be unavailable for local files in some browsers. */ }

const icon = (name, extra = "") => `<svg class="${extra}" aria-hidden="true"><use href="#i-${name}"></use></svg>`;
const esc = (value) => String(value).replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]);
const initials = (text) => text.split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase();
const current = () => modules.find((item) => item.id === currentModule);

function restoreDataRecords() {
  for (const module of modules) {
    try {
      const saved = localStorage.getItem(`acme-data-${module.id}-v1`);
      if (!saved) continue;
      const records = JSON.parse(saved);
      if (!Array.isArray(records)) continue;
      module.records = records.filter((record) => Array.isArray(record)).map((record) =>
        Array.from({ length: 6 }, (_, index) => String(record[index] ?? ""))
      );
    } catch { /* Keep the example rows if local browser storage is unavailable. */ }
  }
}

function newEntityId() {
  return globalThis.crypto?.randomUUID?.() ?? "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (part) => {
    const random = Math.floor(Math.random() * 16);
    return (part === "x" ? random : (random & 0x3) | 0x8).toString(16);
  });
}

function persistEntityIds() {
  // The API persists IDs together with the typed records in one transaction.
}

function persistDataRelations() {
  queueStateSave();
}

function initializeEntityData() {
  try {
    const savedIds = JSON.parse(localStorage.getItem("acme-entity-ids-v1") || "{}");
    if (savedIds && typeof savedIds === "object") dataEntityIds = savedIds;
  } catch { dataEntityIds = {}; }
  for (const item of modules) {
    const ids = Array.isArray(dataEntityIds[item.id]) ? dataEntityIds[item.id].slice(0, item.records.length) : [];
    while (ids.length < item.records.length) ids.push(newEntityId());
    dataEntityIds[item.id] = ids;
  }
  persistEntityIds();

  let savedRelationsLoaded = false;
  try {
    const savedRelations = JSON.parse(localStorage.getItem("acme-relations-v1") || "null");
    if (Array.isArray(savedRelations)) {
      dataRelations = savedRelations.filter((relation) => relation?.from?.id && relation?.to?.id);
      savedRelationsLoaded = true;
    }
  } catch { /* Recreate the example relations below. */ }

  if (!savedRelationsLoaded) dataRelations = [];
  for (const definition of relationDefinitions) {
    const source = modules.find((item) => item.id === definition.from);
    const target = modules.find((item) => item.id === definition.to);
    for (let sourceIndex = 0; source && sourceIndex < source.records.length; sourceIndex += 1) {
      const targetIndex = target?.records.findIndex((record) => definition.match(source.records[sourceIndex], record)) ?? -1;
      if (targetIndex < 0) continue;
      linkRelatedEntities(definition.from, dataEntityIds[definition.from][sourceIndex], definition.to, dataEntityIds[definition.to][targetIndex]);
    }
  }
  persistDataRelations();
}

function persistDataRecords(id) {
  queueStateSave();
  return apiReady;
}

async function loadApiState() {
  const response = await fetch("/api/prototype/state", { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const state = await response.json();
  for (const module of modules) {
    const rows = state.modules?.[module.id] ?? [];
    module.records = rows.map((row) => Array.from({ length: 6 }, (_, index) => String(row.fields?.[index] ?? "")));
    dataEntityIds[module.id] = rows.map((row) => String(row.id));
  }
  dataRelations = Array.isArray(state.relations) ? state.relations : [];
  apiReady = true;
}

function queueStateSave() {
  if (!apiReady) return;
  window.clearTimeout(stateSaveTimer);
  stateSaveTimer = window.setTimeout(async () => {
    const body = {
      modules: Object.fromEntries(modules.map((module) => [module.id, module.records.map((fields, index) => ({
        id: dataEntityIds[module.id]?.[index] ?? newEntityId(),
        fields: Array.from({ length: 6 }, (_, fieldIndex) => String(fields[fieldIndex] ?? ""))
      }))])),
      relations: dataRelations
    };
    try {
      const response = await fetch("/api/prototype/state", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(body)
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
    } catch (error) {
      toast(`Speichern fehlgeschlagen: ${error.message}`);
    }
  }, 120);
}

function navigateToModule(id) {
  if (!modules.some((item) => item.id === id)) return renderHome();
  currentDataObject = null;
  history.pushState({ module: id }, "", `#${id}`);
  renderModule(id);
}

function navigateToDataObject(id) {
  if (!modules.some((item) => item.id === id)) return renderHome();
  dataNavigationPath = [{ object: id, filterIds: null, label: dataTableConfig[id]?.title ?? modules.find((item) => item.id === id).title }];
  dataSelectedEntityId = null;
  dataActiveRelationObject = null;
  dataSelectedTargetEntityId = null;
  startMobileMasterSelection(id, { reset: true });
  history.pushState({ dataNavigationPath }, "", `#daten-${id}`);
  renderDataTable(id);
}

function openReferenceMaster(control) {
  const sourceObject = control.dataset.sourceObjectId;
  const sourceEntityId = control.dataset.sourceEntityId;
  const columnIndex = Number(control.dataset.referenceColumnIndex);
  const sourceRecord = recordForEntity(sourceObject, sourceEntityId);
  const reference = directReferenceForColumn(sourceObject, sourceRecord, columnIndex);
  if (!reference) {
    toast("Für diesen Wert wurde kein passender Datensatz gefunden.");
    return;
  }

  if (sourceObject !== currentDataObject) {
    const currentEntry = dataNavigationPath.at(-1);
    const currentMasterRecord = recordForEntity(currentDataObject, dataSelectedEntityId);
    const pathNamesCurrentMaster = currentEntry?.object === currentDataObject && currentEntry.filterIds?.length === 1 && currentEntry.filterIds[0] === dataSelectedEntityId;
    if (currentMasterRecord && !pathNamesCurrentMaster) {
      dataNavigationPath.push({ object: currentDataObject, filterIds: [dataSelectedEntityId], label: currentMasterRecord[0] });
    }
    const sourceEntry = dataNavigationPath.at(-1);
    const pathNamesSource = sourceEntry?.object === sourceObject && sourceEntry.filterIds?.length === 1 && sourceEntry.filterIds[0] === sourceEntityId;
    if (!pathNamesSource) dataNavigationPath.push({ object: sourceObject, filterIds: [sourceEntityId], label: sourceRecord?.[0] ?? getDataTableConfig(sourceObject).title });
    currentDataObject = sourceObject;
    dataSelectedEntityId = sourceEntityId;
  } else {
    dataSelectedEntityId = sourceEntityId;
  }

  dataActiveRelationObject = null;
  dataSelectedTargetEntityId = null;
  openRelatedDataObject(reference.objectId, reference.entityId);
}

function isMobileDataLayout() {
  return window.matchMedia("(max-width: 700px)").matches;
}

function mobileMasterPickerMemoryKey(objectId = currentDataObject, entry = dataNavigationPath.at(-1)) {
  const scope = Array.isArray(entry?.filterIds) ? [...entry.filterIds].sort().join(",") : "all";
  return `${objectId}:${scope}`;
}

function startMobileMasterSelection(objectId, { reset = false } = {}) {
  const entry = dataNavigationPath.at(-1);
  const isRootList = dataNavigationPath.length === 1 && !Array.isArray(entry?.filterIds);
  mobileMasterPickerReturn = isMobileDataLayout() && isRootList;
  mobilePickerState = mobileMasterPickerReturn ? { kind: "master", objectId, query: "", mode: "entry" } : null;
  if (!mobileMasterPickerReturn) return;
  const memoryKey = mobileMasterPickerMemoryKey(objectId, entry);
  if (reset || !mobileMasterPickerMemory.has(memoryKey)) mobileMasterPickerMemory.set(memoryKey, { query: "", scrollTop: 0 });
  else mobilePickerState.query = mobileMasterPickerMemory.get(memoryKey).query;
  window.requestAnimationFrame(() => window.scrollTo(0, 0));
}

function rememberMobileMasterPicker() {
  if (mobilePickerState?.kind !== "master") return;
  mobileMasterPickerMemory.set(mobileMasterPickerMemoryKey(), {
    query: mobilePickerState.query,
    scrollTop: window.scrollY
  });
}

function restoreMobileMasterPickerScroll(scrollTop) {
  window.requestAnimationFrame(() => window.scrollTo(0, scrollTop));
}

function openRelatedDataObject(id, entityId) {
  const item = modules.find((module) => module.id === id);
  const index = dataEntityIds[id]?.indexOf(entityId) ?? -1;
  if (!item || index < 0) return;
  const currentEntry = dataNavigationPath.at(-1) ?? { object: currentDataObject, filterIds: null, label: dataTableConfig[currentDataObject]?.title ?? current()?.title };
  const currentIds = currentEntry.filterIds?.length ? currentEntry.filterIds : dataEntityIds[currentDataObject] ?? [];
  const currentRecord = recordForEntity(currentDataObject, dataSelectedEntityId);
  const parentLabel = currentRecord?.[0] ?? currentEntry.label;
  const pathAlreadyNamesSelection = dataSelectedEntityId && currentEntry.filterIds?.length === 1 && currentEntry.filterIds[0] === dataSelectedEntityId;
  dataNavigationPath = [...dataNavigationPath];
  if (!pathAlreadyNamesSelection) dataNavigationPath.push({ object: currentDataObject, filterIds: dataSelectedEntityId ? [dataSelectedEntityId] : currentIds, label: parentLabel });
  dataNavigationPath.push({ object: id, filterIds: [entityId], label: recordForEntity(id, entityId)?.[0] ?? item.records[index][0] });
  dataSelectedEntityId = entityId;
  dataActiveRelationObject = null;
  dataSelectedTargetEntityId = null;
  mobileMasterPickerReturn = false;
  mobilePickerState = null;
  history.pushState({ dataNavigationPath, selectedEntityId: entityId }, "", `#daten-${id}`);
  renderDataTable(id);
}

function openRelatedDataGroup(id) {
  const target = modules.find((module) => module.id === id);
  if (!target || !dataSelectedEntityId) return;
  const refs = relatedEntitiesFor(currentDataObject, dataSelectedEntityId).filter((ref) => ref.object === id);
  const entityIds = refs.map((ref) => ref.id);
  if (!entityIds.length) return;
  const currentEntry = dataNavigationPath.at(-1);
  const currentIndex = dataEntityIds[currentDataObject]?.indexOf(dataSelectedEntityId) ?? -1;
  const currentLabel = modules.find((module) => module.id === currentDataObject)?.records[currentIndex]?.[0] ?? currentEntry.label;
  const pathAlreadyNamesSelection = currentEntry.filterIds?.length === 1 && currentEntry.filterIds[0] === dataSelectedEntityId;
  if (!pathAlreadyNamesSelection) dataNavigationPath.push({ object: currentDataObject, filterIds: [dataSelectedEntityId], label: currentLabel });
  dataNavigationPath.push({ object: id, filterIds: entityIds, label: `${target.title} (${entityIds.length})` });
  dataSelectedEntityId = entityIds.length === 1 ? entityIds[0] : null;
  dataActiveRelationObject = null;
  dataSelectedTargetEntityId = null;
  mobileMasterPickerReturn = false;
  mobilePickerState = null;
  history.pushState({ dataNavigationPath }, "", `#daten-${id}`);
  renderDataTable(id);
}

function navigateDataPath(index) {
  dataNavigationPath = dataNavigationPath.slice(0, index + 1);
  const entry = dataNavigationPath.at(-1);
  if (!entry) return renderHome();
  dataSelectedEntityId = entry.filterIds?.length === 1 ? entry.filterIds[0] : null;
  dataActiveRelationObject = null;
  dataSelectedTargetEntityId = null;
  mobileMasterPickerReturn = false;
  mobilePickerState = null;
  history.pushState({ dataNavigationPath }, "", `#daten-${entry.object}`);
  renderDataTable(entry.object);
}

function navigateHome() {
  if (location.hash) history.pushState({ module: null }, "", `${location.pathname}${location.search}`);
  dataNavigationPath = [];
  dataSelectedEntityId = null;
  mobilePickerState = null;
  mobileMasterPickerReturn = false;
  renderHome();
}

function renderHome() {
  currentModule = null;
  currentDataObject = null;
  mobilePickerState = null;
  mobileMasterPickerReturn = false;
  document.body.classList.remove("data-mode-active");
  main.classList.remove("data-mode");
  tableFilter = "";
  onlyOpen = false;
  main.innerHTML = `
    <section class="welcome-row">
      <div>
        <h1>Arbeitsbereiche</h1>
        <p class="welcome-copy">Wähle einen Bereich, um loszulegen.</p>
      </div>
      <div class="workspace-select"><span class="workspace-avatar">A</span><span>Arbeitsbereich</span><strong>Acme Studio</strong>${icon("more")}</div>
    </section>
    <div class="section-stack">
      ${groups.map((group) => `
        <section class="category-card" aria-labelledby="group-${group.title.toLowerCase()}">
          <h2 class="category-heading" id="group-${group.title.toLowerCase()}">${group.title}</h2>
          <p class="category-subtitle">${group.subtitle}</p>
          <div class="tile-grid">
            ${group.ids.map((id) => {
              const item = modules.find((entry) => entry.id === id);
              const isDataObject = group.kind === "data";
              return `<button class="nav-tile${isDataObject ? " nav-tile-data" : ""}" ${isDataObject ? `data-data-object="${item.id}"` : `data-module="${item.id}"`} aria-label="${isDataObject ? `${item.title} Rohdaten öffnen` : `${item.title} öffnen`}">
                <span class="tile-icon">${icon(item.icon)}</span>
                <span class="tile-copy"><span class="tile-title">${item.title}</span><span class="tile-desc">${isDataObject ? "Rohdaten-Tabelle" : item.desc}</span></span>
                ${icon("arrow", "tile-arrow")}
              </button>`;
            }).join("")}
          </div>
        </section>`).join("")}
    </div>
    <footer class="home-footer"><span class="tip">${icon("spark")} Tipp: Nutze die Suche, um direkt zu einem Bereich zu springen.</span><button class="text-button" data-action="show-shortcuts">Tastenkürzel anzeigen ${icon("arrow")}</button></footer>`;
}

function recordStatus(text) {
  const low = text.toLowerCase();
  if (/überfällig|achtung/.test(low)) return "overdue";
  if (/prüfung|versendet|entwurf|unterschrift|geplant|vorbereiten|offen|eingereicht|wird erstellt/.test(low)) return "pending";
  if (/arbeit|planung|prüfung/.test(low)) return "progress";
  return "";
}

function renderModule(id) {
  const item = modules.find((entry) => entry.id === id);
  if (!item) return renderHome();
  currentModule = id;
  currentDataObject = null;
  mobilePickerState = null;
  mobileMasterPickerReturn = false;
  document.body.classList.remove("data-mode-active");
  main.classList.remove("data-mode");
  tableFilter = "";
  onlyOpen = false;
  const category = item.group;
  const filtered = item.records;
  const labelHead = item.id === "aufgaben" ? "Aufgabe" : item.id === "aktivitaeten" ? "Aktivität" : item.id === "ressourcen" ? "Person" : item.id === "zeiterfassung" ? "Eintrag" : item.id === "berichte" ? "Bericht" : item.id === "budgets" ? "Budget" : item.id === "kosten" ? "Ausgabe" : item.id === "rechnungen" ? "Rechnung" : item.id === "projekte" ? "Projekt" : item.id === "vertraege" ? "Vertrag" : item.id === "angebote" ? "Angebot" : "Kunde";
  main.innerHTML = `
    <nav class="breadcrumbs" aria-label="Brotkrumennavigation"><button data-action="home">Arbeitsbereich</button>${icon("arrow")}<span>${category}</span>${icon("arrow")}<strong>${item.title}</strong></nav>
    <section class="module-header">
      <div class="module-title-wrap"><span class="module-icon">${icon(item.icon)}</span><div><p class="eyebrow">${category}</p><h1>${item.title}</h1><p>${item.subtitle} · Zuletzt aktualisiert vor wenigen Minuten</p></div></div>
      <button class="primary-button" data-action="new">${icon("plus")}${item.action}</button>
    </section>
    <section class="stats-row" aria-label="Kennzahlen">${item.stats.map((value, index) => `<article class="stat-card"><div class="stat-label">${item.statLabels[index]}</div><div class="stat-value-row"><strong class="stat-value">${value}</strong><span class="stat-icon">${icon(index === 0 ? item.icon : ["trend", "chart", "check"][index - 1])}</span></div><div class="stat-change">${index === 0 ? "↗ 8,4 %" : index === 1 ? "im Vergleich zum Vormonat" : index === 2 ? "Aktualisiert heute" : "im aktuellen Zeitraum"}</div></article>`).join("")}</section>
    <section class="content-card">
      <header class="content-card-header"><div><h2>${item.id === "aufgaben" ? "Aufgaben für dein Team" : `Alle ${item.title.toLowerCase()}`}</h2><p>Bleib auf dem Laufenden und verwalte deine ${item.title.toLowerCase()}.</p></div>
        <div class="table-tools"><label class="table-search">${icon("search")}<input id="table-search" type="search" placeholder="In ${item.title.toLowerCase()} suchen…" aria-label="Tabelle durchsuchen"></label><button class="filter-button" data-action="filter">${icon("filter")} ${onlyOpen ? "Alle anzeigen" : "Filter"}</button></div>
      </header>
      <div class="table-wrap"><table><colgroup><col class="col-name"><col class="col-owner"><col class="col-status"><col class="col-updated"><col class="col-value"><col class="col-actions"></colgroup><thead><tr><th>${labelHead}</th><th>Verantwortlich</th><th>Status</th><th>Aktualisiert</th><th>${item.id === "aufgaben" ? "Priorität" : item.id === "zeiterfassung" ? "Erfasste Zeit" : "Wert"}</th><th></th></tr></thead><tbody id="record-rows">${renderRows(filtered, labelHead)}</tbody></table></div>
      <footer class="table-footer"><span id="table-count">${filtered.length} Einträge</span><div class="pagination"><span>Seite</span><button class="page-button active" data-action="page">1</button><button class="page-button" data-action="page">2</button><button class="page-button" data-action="page">3</button>${icon("arrow")}</div></footer>
    </section>
    <div class="secondary-grid">
      <section class="content-card"><header class="content-card-header"><div><h2>Letzte Aktivitäten</h2><p>Was in diesem Bereich passiert ist</p></div><button class="text-button" data-action="activity">Alle ansehen ${icon("arrow")}</button></header><div class="activity-list">${item.activities.map((activity, index) => `<div class="activity-item"><span class="activity-dot"></span><span>${activity}</span><span class="activity-time">${["Vor 12 Min.", "Vor 1 Std.", "Gestern"][index]}</span></div>`).join("")}</div></section>
      <section class="content-card"><header class="content-card-header"><div><h2>Bereichsfortschritt</h2><p>Dein Team ist gut unterwegs</p></div><button class="row-menu" data-action="progress-menu" aria-label="Optionen">${icon("more")}</button></header><div class="progress-content"><div class="progress-title"><span>Monatsziel</span><strong>72 %</strong></div><div class="progress-track"><span></span></div><p class="progress-caption">Noch 8 Tage bis zum Monatsende</p></div></section>
    </div>`;
}

function renderDataTable(id, { keepSearch = false } = {}) {
  const config = getDataTableConfig(id);
  const item = modules.find((module) => module.id === id);
  if (!config || !item) return renderHome();
  if (!dataNavigationPath.length || dataNavigationPath.at(-1).object !== id) {
    dataNavigationPath = [{ object: id, filterIds: null, label: config.title }];
  }
  currentModule = null;
  currentDataObject = id;
  document.body.classList.add("data-mode-active");
  main.classList.add("data-mode");
  tableFilter = "";
  onlyOpen = false;
  if (!keepSearch) dataSearch = "";
  editingDataIndex = null;
  dataDraft = null;
  confirmDeleteIndex = null;
  relationEditing = null;
  relationDraft = null;

  const currentEntry = dataNavigationPath.at(-1);
  const isScoped = Array.isArray(currentEntry.filterIds);
  main.innerHTML = `<section class="data-view">
    <header class="data-toolbar desktop-data-toolbar"><div class="data-title-block"><nav class="data-breadcrumbs" aria-label="Datenpfad"><button class="data-back" data-action="home">${icon("arrow")} Arbeitsbereiche</button>${dataNavigationPath.map((entry, index) => `${icon("arrow")}<button class="data-crumb ${index === dataNavigationPath.length - 1 ? "active" : ""}" data-action="data-path" data-path-index="${index}" ${index === dataNavigationPath.length - 1 ? "aria-current=\"page\"" : ""}>${esc(entry.label)}</button>`).join("")}</nav><p class="data-eyebrow">Rohdaten${isScoped ? " · Verknüpfte Einträge" : ""}</p><h1>${config.title}</h1></div>
      <div class="data-tools"><label class="data-search">${icon("search")}<input id="data-search" type="search" value="${esc(dataSearch)}" placeholder="Tabelle durchsuchen…" aria-label="${config.title} durchsuchen"></label>${isScoped ? `<button class="data-add" data-action="show-all-data">Alle ${config.title.toLowerCase()} anzeigen</button>` : `<button class="data-add" data-action="add-data-row">${icon("plus")} ${config.singular} hinzufügen</button>`}</div>
    </header>
    <section class="data-sheet-frame desktop-master-table" aria-label="${config.title} Mastertabelle"><div class="data-sheet-scroll"><table class="data-sheet"><thead><tr><th class="sheet-index" aria-label="Master auswählen"></th>${config.columns.map((column) => `<th>${esc(column.label)}</th>`).join("")}<th class="sheet-actions-heading">Aktionen</th></tr></thead><tbody id="data-rows"></tbody></table></div>
      <footer class="sheet-footer"><span id="data-count"></span><span class="sheet-hint">Zeile auswählen, Beziehungen unten ansehen</span></footer>
    </section>
    <div id="data-relations-root" class="desktop-master-detail-root"></div>
    <div id="mobile-master-detail-root" class="mobile-master-detail-root"></div>
  </section>`;
  renderDataRows();
}

function getDataTableConfig(id) {
  if (dataTableConfig[id]) return dataTableConfig[id];
  const item = modules.find((module) => module.id === id);
  if (!item) return null;
  const label = rawModuleLabels[id] ?? item.title;
  return {
    title: item.title,
    singular: label,
    statuses: [...new Set(item.records.map((record) => record[3]).filter(Boolean))],
    columns: [
      { label, index: 0 }, { label: "Bezug / Details", index: 1 },
      { label: "Verantwortlich", index: 2 }, { label: "Status", index: 3, type: "select" },
      { label: "Aktualisiert", index: 4 }, { label: "Wert / Kennzahl", index: 5 }
    ]
  };
}

function renderDataRow(record, index, config) {
  const rowKey = String(index);
  const isEditing = editingDataIndex === index;
  const isConfirmingDelete = confirmDeleteIndex === index;
  const entityId = index === "new" ? "" : dataEntityIds[currentDataObject]?.[index];
  const cells = config.columns.map((column) => {
    const value = String(record[column.index] ?? "");
    const directReference = !isEditing && entityId ? directReferenceForColumn(currentDataObject, record, column.index) : null;
    if (isEditing && column.editable !== false) {
      if (column.type === "select") {
        const statuses = [...new Set([...config.statuses, value])];
        return `<td><select class="sheet-cell-editor" data-column-index="${column.index}" aria-label="${column.label}">${statuses.map((status) => `<option value="${esc(status)}" ${status === value ? "selected" : ""}>${esc(status)}</option>`).join("")}</select></td>`;
      }
      return `<td><input class="sheet-cell-editor" data-column-index="${column.index}" value="${esc(value)}" aria-label="${column.label}" ${column.index === 0 ? "required" : ""} /></td>`;
    }
    if (directReference) return `<td class="${column.editable === false ? "sheet-readonly" : ""}"><button type="button" class="data-reference-link" role="link" data-action="open-reference-master" data-source-object-id="${currentDataObject}" data-source-entity-id="${esc(entityId)}" data-reference-column-index="${column.index}" aria-label="${esc(value)} als ${esc(getDataTableConfig(directReference.objectId).singular)} öffnen">${esc(value)}</button></td>`;
    return `<td class="${column.editable === false ? "sheet-readonly" : ""}">${esc(value)}</td>`;
  }).join("");

  let actions;
  if (isEditing) {
    actions = `<button class="sheet-action sheet-action-save" data-action="save-data-row" data-row-index="${rowKey}">Speichern</button><button class="sheet-action" data-action="cancel-data-row" data-row-index="${rowKey}">Abbrechen</button>`;
  } else if (isConfirmingDelete) {
    actions = `<span class="sheet-delete-confirm">Löschen?</span><button class="sheet-action sheet-action-delete" data-action="confirm-delete-data-row" data-row-index="${rowKey}">Ja</button><button class="sheet-action" data-action="cancel-delete-data-row" data-row-index="${rowKey}">Nein</button>`;
  } else {
    actions = `<button class="sheet-action" data-action="edit-data-row" data-row-index="${rowKey}">Bearbeiten</button><button class="sheet-action sheet-action-delete" data-action="delete-data-row" data-row-index="${rowKey}">Löschen</button>`;
  }
  const rowNumber = index === "new" ? "" : String(index + 1);
  const selectedClass = entityId && entityId === dataSelectedEntityId ? " sheet-selected" : "";
  return `<tr class="${isEditing ? "sheet-editing" : ""}${selectedClass}" data-sheet-row="${rowKey}" aria-selected="${entityId && entityId === dataSelectedEntityId ? "true" : "false"}"><td class="sheet-index">${entityId ? `<button type="button" class="sheet-select-button" data-action="select-data-row" data-row-index="${rowKey}" aria-label="${esc(record[0])} auswählen" aria-pressed="${entityId === dataSelectedEntityId}">${rowNumber}</button>` : rowNumber}</td>${cells}<td class="sheet-row-actions">${actions}</td></tr>`;
}

function renderDataRows() {
  const config = getDataTableConfig(currentDataObject);
  const item = modules.find((module) => module.id === currentDataObject);
  if (!config || !item) return;
  const query = dataSearch.trim().toLocaleLowerCase();
  const entry = dataNavigationPath.at(-1);
  const allowedIds = Array.isArray(entry?.filterIds) ? new Set(entry.filterIds) : null;
  const filtered = item.records.map((record, index) => ({ record, index, id: dataEntityIds[currentDataObject]?.[index] }))
    .filter(({ record, id }) => (!allowedIds || allowedIds.has(id)) && record.join(" ").toLocaleLowerCase().includes(query));
  const selectedDraft = [...mobileDataDrafts.values()].some((draft) => draft.objectId === currentDataObject && draft.isNew && draft.entityId === dataSelectedEntityId);
  const choosingMaster = mobilePickerState?.kind === "master";
  if (!choosingMaster && !filtered.some(({ id }) => id === dataSelectedEntityId) && !selectedDraft) dataSelectedEntityId = filtered[0]?.id ?? null;
  const newRow = editingDataIndex === "new" ? renderDataRow(dataDraft, "new", config) : "";
  const rows = filtered.map(({ record, index }) => renderDataRow(record, index, config)).join("");
  const empty = !filtered.length && !newRow ? `<tr><td class="sheet-empty" colspan="${config.columns.length + 2}">Keine passenden Datensätze</td></tr>` : "";
  document.querySelector("#data-rows").innerHTML = `${newRow}${rows}${empty}`;
  const count = document.querySelector("#data-count");
  const total = allowedIds ? item.records.filter((_, index) => allowedIds.has(dataEntityIds[currentDataObject]?.[index])).length : item.records.length;
  count.textContent = query ? `${filtered.length} von ${total} Datensätzen` : `${total} Datensätze`;
  renderMasterDetailViews();
}

function relationObjectIdsFor(objectId) {
  return [...new Set(relationDefinitions.flatMap((definition) => {
    if (definition.from === objectId) return [definition.to];
    if (definition.to === objectId) return [definition.from];
    return [];
  }))];
}

function mobileDraftKey(objectId, entityId) { return `${objectId}::${entityId}`; }

function mobileReferenceEditKey(objectId, entityId, columnIndex) { return `${objectId}::${entityId}::${columnIndex}`; }

function mobileDraftFor(objectId, entityId) {
  return mobileDataDrafts.get(mobileDraftKey(objectId, entityId)) ?? null;
}

function recordForEntity(objectId, entityId) {
  const draft = mobileDraftFor(objectId, entityId);
  if (draft) return draft.values;
  const index = dataEntityIds[objectId]?.indexOf(entityId) ?? -1;
  return index >= 0 ? modules.find((module) => module.id === objectId)?.records[index] ?? null : null;
}

function directReferenceForColumn(objectId, record, columnIndex) {
  if (!record) return null;
  for (const definition of relationDefinitions) {
    if (definition.from !== objectId || definition.columnIndex !== columnIndex) continue;
    const target = modules.find((module) => module.id === definition.to);
    const targetIndex = target?.records.findIndex((targetRecord) => definition.match(record, targetRecord)) ?? -1;
    const entityId = targetIndex >= 0 ? dataEntityIds[definition.to]?.[targetIndex] : null;
    if (entityId) return { objectId: definition.to, entityId, name: target.records[targetIndex][0] };
  }
  return null;
}

function syncDirectRelationsForEntity(objectId, entityId, record, previousRecord = null) {
  const definitions = relationDefinitions.filter((definition) => definition.from === objectId && definition.columnIndex !== undefined);
  for (const definition of definitions) {
    const previousValue = previousRecord?.[definition.columnIndex];
    const nextValue = record?.[definition.columnIndex];
    const valueChanged = previousRecord && String(previousValue ?? "") !== String(nextValue ?? "");
    const reference = directReferenceForColumn(objectId, record, definition.columnIndex);
    if (previousRecord && !valueChanged) continue;
    if (!previousRecord && !reference) continue;
    if (valueChanged) {
      dataRelations = dataRelations.filter((relation) => !(
        (relation.from.object === objectId && relation.from.id === entityId && relation.to.object === definition.to) ||
        (relation.to.object === objectId && relation.to.id === entityId && relation.from.object === definition.to)
      ));
    }
    if (reference) linkRelatedEntities(objectId, entityId, reference.objectId, reference.entityId);
  }
}

function mobileEntitiesFor(objectId, allowedIds = null) {
  const module = modules.find((item) => item.id === objectId);
  if (!module) return [];
  const existing = module.records.map((record, index) => {
    const id = dataEntityIds[objectId]?.[index];
    return { id, record: mobileDraftFor(objectId, id)?.values ?? record, isNew: false };
  })
    .filter(({ id }) => !allowedIds || allowedIds.has(id));
  const drafts = [...mobileDataDrafts.values()].filter((draft) => draft.objectId === objectId && draft.isNew)
    .map((draft) => ({ id: draft.entityId, record: draft.values, isNew: true }));
  return [...drafts, ...existing];
}

function mobileRelatedEntities(masterObject, masterId, targetObject) {
  const existing = relatedEntitiesFor(masterObject, masterId).filter((ref) => ref.object === targetObject)
    .map((ref) => ({ id: ref.id, record: recordForEntity(ref.object, ref.id), isNew: false }))
    .filter(({ record }) => Boolean(record));
  const drafts = [...mobileDataDrafts.values()].filter((draft) => draft.isNew && draft.objectId === targetObject && draft.parent?.object === masterObject && draft.parent?.id === masterId)
    .map((draft) => ({ id: draft.entityId, record: draft.values, isNew: true }));
  return [...drafts, ...existing];
}

function renderRelationTabs(objectIds, masterId, { mobile = false } = {}) {
  return objectIds.map((objectId) => {
    const config = getDataTableConfig(objectId);
    const count = mobileRelatedEntities(currentDataObject, masterId, objectId).length;
    const active = dataActiveRelationObject === objectId;
    return `<button type="button" role="tab" aria-selected="${active}" class="relation-tab${active ? " active" : ""}" data-action="select-relation-tab" data-object-id="${objectId}" ${mobile ? "data-mobile-tab=\"true\"" : ""}>${esc(config.title)} <span>${count}</span></button>`;
  }).join("");
}

function renderRelationSheetRow(objectId, entityId, recordIndex, record) {
  const config = getDataTableConfig(objectId);
  const isNew = relationEditing?.objectId === objectId && relationEditing.isNew && !entityId;
  const isEditing = isNew || (relationEditing?.objectId === objectId && relationEditing.entityId === entityId);
  const values = isNew ? relationDraft : record;
  const cells = config.columns.map((column) => {
    const value = String(values?.[column.index] ?? "");
    const directReference = !isEditing && entityId ? directReferenceForColumn(objectId, record, column.index) : null;
    if (isEditing && column.editable !== false) {
      if (column.type === "select") {
        const statuses = [...new Set([...config.statuses, value])];
        return `<td><select class="sheet-cell-editor" data-column-index="${column.index}" aria-label="${esc(column.label)}">${statuses.map((status) => `<option value="${esc(status)}" ${status === value ? "selected" : ""}>${esc(status)}</option>`).join("")}</select></td>`;
      }
      return `<td><input class="sheet-cell-editor" data-column-index="${column.index}" value="${esc(value)}" aria-label="${esc(column.label)}" ${column.index === 0 ? "required" : ""} /></td>`;
    }
    if (directReference) return `<td class="${column.editable === false ? "sheet-readonly" : ""}"><button type="button" class="data-reference-link" role="link" data-action="open-reference-master" data-source-object-id="${objectId}" data-source-entity-id="${esc(entityId)}" data-reference-column-index="${column.index}" aria-label="${esc(value)} als ${esc(getDataTableConfig(directReference.objectId).singular)} öffnen">${esc(value)}</button></td>`;
    return `<td class="${column.editable === false ? "sheet-readonly" : ""}">${esc(value)}</td>`;
  }).join("");
  const actions = isEditing
    ? `<button class="sheet-action sheet-action-save" data-action="save-related-row" data-object-id="${objectId}">Speichern</button><button class="sheet-action" data-action="cancel-related-row" data-object-id="${objectId}">Abbrechen</button>`
    : `<button class="sheet-action" data-action="open-related-data" data-object-id="${objectId}" data-entity-id="${entityId}">Als Master öffnen</button><button class="sheet-action" data-action="edit-related-row" data-object-id="${objectId}" data-row-index="${recordIndex}">Bearbeiten</button><button class="sheet-action sheet-action-delete" data-action="delete-related-row" data-object-id="${objectId}" data-entity-id="${entityId}">Löschen</button>`;
  return `<tr class="${isEditing ? "sheet-editing" : ""}" data-relation-row="${isNew ? "new" : recordIndex}">${cells}<td class="relation-row-actions">${actions}</td></tr>`;
}

function renderDesktopRelationTable(objectId, masterId) {
  const root = document.querySelector("#data-relations-root");
  const config = getDataTableConfig(objectId);
  const refs = mobileRelatedEntities(currentDataObject, masterId, objectId);
  const persistedRefs = refs.filter((ref) => !ref.isNew);
  const rows = persistedRefs.map(({ id, record }) => {
    const index = dataEntityIds[objectId]?.indexOf(id) ?? -1;
    return index >= 0 ? renderRelationSheetRow(objectId, id, index, record) : "";
  }).join("");
  const newRow = relationEditing?.objectId === objectId && relationEditing.isNew
    ? renderRelationSheetRow(objectId, null, "new", relationDraft)
    : "";
  const empty = !rows && !newRow ? `<tr><td class="sheet-empty" colspan="${config.columns.length + 1}">Keine verknüpften ${esc(config.title.toLowerCase())}. Über „Hinzufügen“ kannst du einen Datensatz anlegen.</td></tr>` : "";
  root.innerHTML = `<section class="master-detail-panel" aria-labelledby="target-heading">
    <header class="master-detail-heading"><div><p class="data-eyebrow">Target · ${esc(config.title)}</p><h2 id="target-heading">Verknüpfte ${esc(config.title.toLowerCase())}<span> · Master: ${esc(recordForEntity(currentDataObject, masterId)?.[0] ?? "")}</span></h2></div><button class="data-add" data-action="add-related-row" data-object-id="${objectId}">${icon("plus")} ${esc(config.singular)} hinzufügen</button></header>
    <div class="relation-tabs" role="tablist" aria-label="Beziehungstypen">${renderRelationTabs(relationObjectIdsFor(currentDataObject), masterId)}</div>
    <div class="relation-sheet-frame"><div class="data-sheet-scroll"><table class="data-sheet relation-sheet"><thead><tr>${config.columns.map((column) => `<th>${esc(column.label)}</th>`).join("")}<th class="relation-actions-heading">Aktionen</th></tr></thead><tbody>${newRow}${rows}${empty}</tbody></table></div>
      <footer class="sheet-footer"><span>${refs.length} ${refs.length === 1 ? esc(config.singular) : esc(config.title.toLowerCase())}</span><span class="sheet-hint">Bearbeiten, löschen oder als nächsten Master öffnen</span></footer></div>
  </section>`;
}

function renderMobileFields(objectId, entityId, record, config) {
  const draft = mobileDraftFor(objectId, entityId);
  const isNew = Boolean(draft?.isNew);
  return config.columns.map((column) => {
    const value = String(record[column.index] ?? "");
    const readonly = column.editable === false;
    const directReference = directReferenceForColumn(objectId, record, column.index);
    let control;
    if (column.type === "select" && !readonly) {
      const options = [...new Set([...config.statuses, value])];
      control = `<select class="mobile-record-field" data-mobile-object-id="${objectId}" data-mobile-entity-id="${esc(entityId)}" data-column-index="${column.index}" aria-label="${esc(column.label)}">${options.map((option) => `<option value="${esc(option)}" ${option === value ? "selected" : ""}>${esc(option)}</option>`).join("")}</select>`;
    } else {
      control = `<input class="mobile-record-field${readonly ? " readonly" : ""}" data-mobile-object-id="${objectId}" data-mobile-entity-id="${esc(entityId)}" data-column-index="${column.index}" value="${esc(value)}" aria-label="${esc(column.label)}" ${readonly ? "readonly" : ""} ${column.index === 0 && isNew ? "required" : ""} />`;
    }
    const referenceEditKey = mobileReferenceEditKey(objectId, entityId, column.index);
    const isEditingReference = mobileReferenceEditKeys.has(referenceEditKey);
    const referenceTarget = directReference ? getDataTableConfig(directReference.objectId) : null;
    const referenceTargetSingular = referenceTarget?.singular ?? "Datensatz";
    const linkAttributes = `data-action="open-reference-master" data-source-object-id="${objectId}" data-source-entity-id="${esc(entityId)}" data-reference-column-index="${column.index}" role="link" aria-label="${esc(value)} als ${esc(referenceTargetSingular)} öffnen"`;
    const fieldControl = directReference && !isEditingReference
      ? `<div class="mobile-reference-value"><button type="button" class="mobile-reference-text" ${linkAttributes}>${esc(value)}</button><button type="button" class="mobile-reference-edit" data-action="edit-mobile-reference" data-object-id="${objectId}" data-entity-id="${esc(entityId)}" data-column-index="${column.index}" aria-label="${esc(column.label)} bearbeiten">Bearbeiten</button></div>`
      : isEditingReference
        ? `<div class="mobile-reference-control">${control}${directReference ? `<button type="button" class="mobile-reference-link" ${linkAttributes} title="Verknüpften Datensatz öffnen">${icon("arrow")}</button>` : ""}<button type="button" class="mobile-reference-done" data-action="finish-mobile-reference" data-object-id="${objectId}" data-entity-id="${esc(entityId)}" data-column-index="${column.index}">Fertig</button></div>`
        : control;
    return `<div class="mobile-field-row"><span>${esc(column.label)}</span>${fieldControl}</div>`;
  }).join("");
}

function toggleMobileReferenceEdit(control, editing) {
  const { objectId, entityId } = control.dataset;
  const columnIndex = control.dataset.columnIndex;
  const key = mobileReferenceEditKey(objectId, entityId, columnIndex);
  if (editing) mobileReferenceEditKeys.add(key);
  else mobileReferenceEditKeys.delete(key);
  renderMobileMasterDetail();
  if (!editing) return;
  [...document.querySelectorAll(".mobile-record-field")].find((field) =>
    field.dataset.mobileObjectId === objectId && field.dataset.mobileEntityId === entityId && field.dataset.columnIndex === columnIndex
  )?.focus();
}

function renderMobileMasterDetail() {
  const root = document.querySelector("#mobile-master-detail-root");
  const masterConfig = getDataTableConfig(currentDataObject);
  if (!root || !masterConfig) return;
  if (mobilePickerState) {
    renderMobilePicker(root);
    return;
  }
  const entry = dataNavigationPath.at(-1);
  const allowedIds = Array.isArray(entry?.filterIds) ? new Set(entry.filterIds) : null;
  const masterEntities = mobileEntitiesFor(currentDataObject, allowedIds);
  const master = masterEntities.find((entity) => entity.id === dataSelectedEntityId) ?? masterEntities[0];
  if (master && master.id !== dataSelectedEntityId) dataSelectedEntityId = master.id;
  const objectIds = relationObjectIdsFor(currentDataObject);
  if (objectIds.length && !objectIds.includes(dataActiveRelationObject)) {
    dataActiveRelationObject = objectIds.find((objectId) => mobileRelatedEntities(currentDataObject, master?.id, objectId).length) ?? objectIds[0];
  }
  const relationConfig = dataActiveRelationObject ? getDataTableConfig(dataActiveRelationObject) : null;
  const targetEntities = master && relationConfig ? mobileRelatedEntities(currentDataObject, master.id, dataActiveRelationObject) : [];
  if (!targetEntities.some((entity) => entity.id === dataSelectedTargetEntityId)) dataSelectedTargetEntityId = targetEntities[0]?.id ?? null;
  const target = targetEntities.find((entity) => entity.id === dataSelectedTargetEntityId) ?? targetEntities[0] ?? null;
  const backIndex = dataNavigationPath.length - 2;
  const backButton = mobileMasterPickerReturn && backIndex < 0
    ? `<button class="mobile-data-back" data-action="back-to-master-list">${icon("arrow")} Alle ${esc(masterConfig.title)} anzeigen</button>`
    : backIndex >= 0
    ? `<button class="mobile-data-back" data-action="data-path" data-path-index="${backIndex}">${icon("arrow")} ${esc(dataNavigationPath[backIndex].label)}</button>`
    : `<button class="mobile-data-back" data-action="home">${icon("arrow")} Arbeitsbereiche</button>`;
  const scoped = Boolean(allowedIds);
  const masterTitle = `<strong class="mobile-record-title">${esc(master?.record?.[0] || "Neuer Datensatz")}</strong>`;
  const masterDeleteAction = master && !master.isNew
    ? `<button type="button" class="mobile-delete" data-action="delete-mobile-master" data-entity-id="${esc(master.id)}">Löschen</button>`
    : master?.isNew
      ? `<button type="button" class="mobile-delete" data-action="discard-mobile-draft" data-object-id="${currentDataObject}" data-entity-id="${esc(master.id)}">Verwerfen</button>`
      : "";
  const masterHeaderAction = scoped ? masterDeleteAction.replace("mobile-delete", "mobile-inline-action") : "";
  const masterFields = master
    ? renderMobileFields(currentDataObject, master.id, master.record, masterConfig)
    : `<p class="mobile-empty">Noch keine ${esc(masterConfig.title.toLowerCase())} vorhanden.</p>`;
  const masterActions = scoped ? "" : `<div class="mobile-card-actions"><button type="button" data-action="add-mobile-master">${icon("plus")} ${esc(masterConfig.singular)} hinzufügen</button>${masterDeleteAction}</div>`;
  const tabs = master && objectIds.length ? `<div class="mobile-relation-tabs" role="tablist" aria-label="Beziehungstypen">${renderRelationTabs(objectIds, master.id, { mobile: true })}</div>` : "";
  const targetPicker = targetEntities.length > 1
    ? `<button type="button" class="mobile-record-picker-button" data-action="open-mobile-picker" data-picker-kind="target"><span>${esc(target?.record?.[0] || "Target auswählen")}</span>${icon("search")}</button>`
    : target ? `<strong class="mobile-record-title">${esc(target.record[0] || "Neuer Datensatz")}</strong>` : "";
  const targetActions = relationConfig && master
    ? `<div class="mobile-card-actions"><button type="button" data-action="add-mobile-related" data-object-id="${dataActiveRelationObject}" ${mobileDraftFor(currentDataObject, master.id)?.isNew ? "disabled" : ""}>${icon("plus")} ${esc(relationConfig.singular)} hinzufügen</button>${target && !target.isNew ? `<button type="button" class="mobile-delete" data-action="delete-mobile-target" data-object-id="${dataActiveRelationObject}" data-entity-id="${esc(target.id)}">Löschen</button>` : target?.isNew ? `<button type="button" class="mobile-delete" data-action="discard-mobile-draft" data-object-id="${dataActiveRelationObject}" data-entity-id="${esc(target.id)}">Verwerfen</button>` : ""}</div>`
    : "";
  const targetFields = target && relationConfig
    ? renderMobileFields(dataActiveRelationObject, target.id, target.record, relationConfig)
    : `<div class="mobile-empty-state"><p>${relationConfig ? `Keine ${esc(relationConfig.title.toLowerCase())} mit diesem Datensatz verknüpft.` : "Für diesen Datensatz sind keine Beziehungen definiert."}</p></div>`;
  const draftCount = mobileDataDrafts.size;
  root.innerHTML = `<header class="mobile-data-header">${backButton}<p>ROHDATEN · MASTER-DETAIL</p><h1>${esc(masterConfig.title)}</h1></header>
    <section class="mobile-record-card mobile-master-card"><header class="mobile-record-heading"><div><p>MASTER · ${esc(masterConfig.singular.toUpperCase())}</p>${masterTitle}</div>${masterHeaderAction}</header>${masterActions}<div class="mobile-record-fields">${masterFields}</div></section>
    ${objectIds.length ? `<section class="mobile-target-section"><h2>Verknüpfte Daten</h2>${tabs}<section class="mobile-record-card mobile-target-card"><header class="mobile-record-heading"><div><p>TARGET · ${esc(relationConfig?.singular.toUpperCase() ?? "DATENSATZ")}</p>${targetPicker}</div></header>${targetActions}<div class="mobile-record-fields">${targetFields}</div>${target && master && !target.isNew ? `<button type="button" class="mobile-open-master" data-action="open-related-data" data-object-id="${dataActiveRelationObject}" data-entity-id="${esc(target.id)}">${esc(target.record[0])} als Master öffnen ${icon("arrow")}</button>` : ""}</section></section>` : `<section class="mobile-record-card"><p class="mobile-empty">Keine Beziehungen für diesen Bereich definiert.</p></section>`}
    <footer class="mobile-savebar"><div class="mobile-save-status" aria-live="polite">${draftCount ? `${draftCount} ${draftCount === 1 ? "Datensatz geändert" : "Datensätze geändert"}` : "Änderungen werden hier gesammelt"}</div><button type="button" class="mobile-save-button" data-action="save-mobile-data" ${draftCount ? "" : "disabled"}>Änderungen speichern</button></footer>`;
}

function mobilePickerEntries() {
  if (!mobilePickerState) return [];
  if (mobilePickerState.kind === "master") {
    const entry = dataNavigationPath.at(-1);
    const allowedIds = Array.isArray(entry?.filterIds) ? new Set(entry.filterIds) : null;
    return mobileEntitiesFor(currentDataObject, allowedIds);
  }
  return mobileRelatedEntities(currentDataObject, dataSelectedEntityId, mobilePickerState.objectId);
}

function renderMobilePickerResults() {
  if (!mobilePickerState) return;
  const resultsRoot = document.querySelector("#mobile-picker-results");
  const countRoot = document.querySelector("#mobile-picker-count");
  if (!resultsRoot || !countRoot) return;
  const entries = mobilePickerEntries();
  const query = mobilePickerState.query.trim().toLocaleLowerCase();
  const filtered = entries.filter(({ record }) => record.join(" ").toLocaleLowerCase().includes(query));
  const config = getDataTableConfig(mobilePickerState.kind === "master" ? currentDataObject : mobilePickerState.objectId);
  countRoot.textContent = query ? `${filtered.length} von ${entries.length} ${config.title.toLowerCase()}` : `${entries.length} ${config.title.toLowerCase()}`;
  resultsRoot.innerHTML = filtered.length ? filtered.map(({ id, record }) => {
    const currentId = mobilePickerState.kind === "master" ? dataSelectedEntityId : dataSelectedTargetEntityId;
    const selected = id === currentId;
    const statusClass = recordStatus(String(record[3] ?? ""));
    return `<button type="button" class="mobile-picker-result${selected ? " selected" : ""}" data-action="select-mobile-picker-item" data-entity-id="${esc(id)}" aria-pressed="${selected}">
      <span class="mobile-picker-result-copy"><strong>${esc(record[0] || "Neuer Datensatz")}</strong><span>${esc(record[1] || "Ohne Zusatzangaben")}</span><small><span class="status ${statusClass}">${esc(record[3] || "Ohne Status")}</span></small></span>
      <span class="mobile-picker-check" aria-hidden="true">${selected ? icon("check") : ""}</span>
    </button>`;
  }).join("") : `<div class="mobile-picker-empty"><strong>Keine Treffer</strong><span>Prüfe die Schreibweise oder suche nach einem anderen Begriff.</span></div>`;
}

function renderMobilePicker(root) {
  const kind = mobilePickerState.kind;
  const objectId = kind === "master" ? currentDataObject : mobilePickerState.objectId;
  const config = getDataTableConfig(objectId);
  const entryMode = mobilePickerState.mode === "entry";
  const title = entryMode ? `${config.singular} auswählen` : kind === "master" ? `${config.singular} als Master auswählen` : `${config.singular} auswählen`;
  const backLabel = entryMode ? "Arbeitsbereiche" : "Zurück zur Master-Detail-Ansicht";
  const eyebrow = entryMode ? `ROHDATEN · ${config.title.toUpperCase()}` : "DATENSATZ AUSWÄHLEN";
  const noun = config.singular.toLowerCase();
  const hint = entryMode ? `Wähle ${objectId === "projekte" ? "ein Projekt" : objectId === "kunden" ? "einen Kunden" : `einen ${noun}`}, um Stammdaten und Beziehungen zu öffnen.` : "Eintrag antippen, um ihn zu öffnen";
  const placeholder = kind === "master" ? `Name, ${objectId === "projekte" ? "Kunde oder Kennung" : "Branche oder Verantwortliche"} suchen…` : "Name oder Details suchen…";
  root.innerHTML = `<section class="mobile-picker-view" aria-label="${esc(title)}">
    <header class="mobile-picker-header"><button type="button" class="mobile-data-back" data-action="close-mobile-picker">${icon("arrow")} ${backLabel}</button><p>${esc(eyebrow)}</p><h1>${esc(title)}</h1>${entryMode ? `<span class="mobile-picker-intro">${esc(hint)}</span>` : ""}<label class="mobile-picker-search">${icon("search")}<input id="mobile-picker-search" type="search" value="${esc(mobilePickerState.query)}" placeholder="${esc(placeholder)}" aria-label="${esc(config.title)} durchsuchen"></label><div class="mobile-picker-meta"><strong id="mobile-picker-count"></strong><span>${entryMode ? `${esc(config.singular)} antippen, um Details zu öffnen` : "Eintrag antippen, um ihn zu öffnen"}</span></div></header>
    <div id="mobile-picker-results" class="mobile-picker-results" aria-label="${esc(config.title)}"></div>
  </section>`;
  renderMobilePickerResults();
}

function openMobilePicker(kind) {
  const objectId = kind === "master" ? currentDataObject : dataActiveRelationObject;
  if (!objectId) return;
  const memory = kind === "master" ? mobileMasterPickerMemory.get(mobileMasterPickerMemoryKey(objectId)) : null;
  mobilePickerState = { kind, objectId, query: memory?.query ?? "", mode: "switch" };
  renderMobileMasterDetail();
  if (kind !== "master") document.querySelector("#mobile-picker-search")?.focus();
  if (kind === "master") restoreMobileMasterPickerScroll(memory?.scrollTop ?? 0);
}

function backToMobileMasterList() {
  if (!currentDataObject) return;
  const memory = mobileMasterPickerMemory.get(mobileMasterPickerMemoryKey()) ?? { query: "", scrollTop: 0 };
  mobileMasterPickerReturn = true;
  mobilePickerState = { kind: "master", objectId: currentDataObject, query: memory.query, mode: "entry" };
  renderMobileMasterDetail();
  restoreMobileMasterPickerScroll(memory.scrollTop);
}

function closeMobilePicker() {
  if (mobilePickerState?.kind === "master") rememberMobileMasterPicker();
  if (mobilePickerState?.mode === "entry") {
    navigateHome();
    return;
  }
  mobilePickerState = null;
  renderMobileMasterDetail();
}

function selectMobilePickerItem(entityId) {
  if (!mobilePickerState) return;
  if (mobilePickerState.kind === "master") {
    rememberMobileMasterPicker();
    dataSelectedEntityId = entityId;
    dataActiveRelationObject = null;
    dataSelectedTargetEntityId = null;
    mobileMasterPickerReturn = dataNavigationPath.length === 1;
    dataSearch = "";
    const dataSearchInput = document.querySelector("#data-search");
    if (dataSearchInput) dataSearchInput.value = "";
    mobilePickerState = null;
    history.replaceState({ dataNavigationPath, selectedEntityId: entityId }, "", location.href);
    renderDataRows();
    window.requestAnimationFrame(() => window.scrollTo(0, 0));
    return;
  }
  dataSelectedTargetEntityId = entityId;
  mobilePickerState = null;
  renderMasterDetailViews();
}

function renderMasterDetailViews() {
  const root = document.querySelector("#data-relations-root");
  const module = modules.find((item) => item.id === currentDataObject);
  const masterIndex = dataEntityIds[currentDataObject]?.indexOf(dataSelectedEntityId) ?? -1;
  const isTemporaryMaster = Boolean(mobileDraftFor(currentDataObject, dataSelectedEntityId)?.isNew);
  const objectIds = relationObjectIdsFor(currentDataObject);
  if (!module || (!isTemporaryMaster && masterIndex < 0) || !objectIds.length) {
    if (root) root.innerHTML = `<section class="master-detail-panel"><p class="relations-empty">${module ? "Wähle einen Masterdatensatz aus, um seine Beziehungen zu sehen." : "Für diesen Bereich sind keine Beziehungen definiert."}</p></section>`;
    renderMobileMasterDetail();
    return;
  }
  if (!objectIds.includes(dataActiveRelationObject)) {
    dataActiveRelationObject = objectIds.find((objectId) => relatedEntitiesFor(currentDataObject, dataSelectedEntityId).some((ref) => ref.object === objectId)) ?? objectIds[0];
  }
  const activeRefs = mobileRelatedEntities(currentDataObject, dataSelectedEntityId, dataActiveRelationObject);
  if (!activeRefs.some((ref) => ref.id === dataSelectedTargetEntityId)) dataSelectedTargetEntityId = activeRefs[0]?.id ?? null;
  if (root) renderDesktopRelationTable(dataActiveRelationObject, dataSelectedEntityId);
  renderMobileMasterDetail();
}

function relatedEntitiesFor(objectId, entityId) {
  const related = [];
  for (const relation of dataRelations) {
    if (relation.from.object === objectId && relation.from.id === entityId) related.push(relation.to);
    else if (relation.to.object === objectId && relation.to.id === entityId) related.push(relation.from);
  }
  return related;
}

function defaultDataRecord(objectId) {
  return ["", "", "Mia Lehmann", objectId === "kunden" ? "Aktiv" : objectId === "projekte" ? "Planung" : "Offen", "Gerade eben", "—"];
}

function hasDesktopDataEdit() { return editingDataIndex !== null || relationEditing !== null; }

function blockDesktopDataNavigation() {
  if (!hasDesktopDataEdit()) return false;
  toast("Speichere oder brich zuerst die aktuelle Tabellenbearbeitung ab.");
  return true;
}

function linkRelatedEntities(masterObject, masterId, targetObject, targetId) {
  const known = dataRelations.some((relation) =>
    (relation.from.object === masterObject && relation.from.id === masterId && relation.to.object === targetObject && relation.to.id === targetId) ||
    (relation.to.object === masterObject && relation.to.id === masterId && relation.from.object === targetObject && relation.from.id === targetId)
  );
  if (!known) dataRelations.push({ from: { object: masterObject, id: masterId }, to: { object: targetObject, id: targetId } });
}

function fillParentReference(objectId, record, parentObject, parentId) {
  const definition = relationDefinitions.find((item) => item.from === objectId && item.to === parentObject && Number.isInteger(item.columnIndex));
  const parent = recordForEntity(parentObject, parentId);
  if (!definition || !parent?.[0] || record[definition.columnIndex]) return;
  record[definition.columnIndex] = parent[0];
}

function addRelatedDataRow(objectId) {
  if (relationEditing) { blockDesktopDataNavigation(); return; }
  if (!dataSelectedEntityId || mobileDraftFor(currentDataObject, dataSelectedEntityId)?.isNew) {
    toast("Speichere zuerst den Masterdatensatz.");
    return;
  }
  relationEditing = { objectId, entityId: null, isNew: true };
  relationDraft = defaultDataRecord(objectId);
  renderMasterDetailViews();
  document.querySelector("#data-relations-root [data-relation-row='new'] [data-column-index='0']")?.focus();
}

function editRelatedDataRow(objectId, index) {
  if (relationEditing) { blockDesktopDataNavigation(); return; }
  const module = modules.find((item) => item.id === objectId);
  if (!module?.records[index]) return;
  relationEditing = { objectId, entityId: dataEntityIds[objectId][index], isNew: false };
  relationDraft = null;
  renderMasterDetailViews();
  document.querySelector("#data-relations-root .sheet-editing [data-column-index='0']")?.focus();
}

function saveRelatedDataRow(control) {
  const objectId = control.dataset.objectId;
  const module = modules.find((item) => item.id === objectId);
  const config = getDataTableConfig(objectId);
  const row = control.closest("tr[data-relation-row]");
  if (!module || !config || !row) return;
  const isNew = row.dataset.relationRow === "new";
  const entityId = isNew ? null : dataEntityIds[objectId]?.[Number(row.dataset.relationRow)];
  const index = isNew ? -1 : dataEntityIds[objectId]?.indexOf(entityId) ?? -1;
  const record = isNew ? [...relationDraft] : [...(module.records[index] ?? [])];
  if (!isNew && index < 0) return;
  row.querySelectorAll("[data-column-index]").forEach((input) => { record[Number(input.dataset.columnIndex)] = input.value.trim(); });
  if (!record[0]) {
    toast(`${config.singular} braucht einen Namen.`);
    row.querySelector('[data-column-index="0"]')?.focus();
    return;
  }
  if (isNew) fillParentReference(objectId, record, currentDataObject, dataSelectedEntityId);
  if (record.length > 4) record[4] = "Gerade eben";
  let savedId = entityId;
  if (isNew) {
    savedId = newEntityId();
    module.records.unshift(record);
    dataEntityIds[objectId].unshift(savedId);
    linkRelatedEntities(currentDataObject, dataSelectedEntityId, objectId, savedId);
    dataSelectedTargetEntityId = savedId;
  } else module.records[index] = record;
  const persisted = persistDataRecords(objectId);
  persistEntityIds();
  persistDataRelations();
  relationEditing = null;
  relationDraft = null;
  renderDataRows();
  toast(persisted ? `${config.singular} gespeichert.` : `${config.singular} gespeichert, aber nur für diese Sitzung.`);
}

function deleteDataEntity(objectId, entityId) {
  const module = modules.find((item) => item.id === objectId);
  if (!module) return;
  const index = dataEntityIds[objectId]?.indexOf(entityId) ?? -1;
  if (index < 0) {
    mobileDataDrafts.delete(mobileDraftKey(objectId, entityId));
    for (const [key, draft] of mobileDataDrafts) {
      if (draft.parent?.object === objectId && draft.parent.id === entityId) mobileDataDrafts.delete(key);
    }
    if (dataSelectedEntityId === entityId) dataSelectedEntityId = null;
    if (dataSelectedTargetEntityId === entityId) dataSelectedTargetEntityId = null;
    renderDataRows();
    return;
  }
  module.records.splice(index, 1);
  dataEntityIds[objectId].splice(index, 1);
  dataRelations = dataRelations.filter((relation) => !(relation.from.object === objectId && relation.from.id === entityId) && !(relation.to.object === objectId && relation.to.id === entityId));
  if (dataSelectedEntityId === entityId) dataSelectedEntityId = null;
  if (dataSelectedTargetEntityId === entityId) dataSelectedTargetEntityId = null;
  mobileDataDrafts.delete(mobileDraftKey(objectId, entityId));
  for (const [key, draft] of mobileDataDrafts) {
    if (draft.parent?.object === objectId && draft.parent.id === entityId) mobileDataDrafts.delete(key);
  }
  const persisted = persistDataRecords(objectId);
  persistEntityIds();
  persistDataRelations();
  renderDataRows();
  toast(persisted ? `${getDataTableConfig(objectId).singular} gelöscht.` : `${getDataTableConfig(objectId).singular} gelöscht, aber nur für diese Sitzung.`);
}

function mobileFieldChanged(control) {
  const { mobileObjectId: objectId, mobileEntityId: entityId } = control.dataset;
  const index = Number(control.dataset.columnIndex);
  const currentRecord = recordForEntity(objectId, entityId);
  if (!currentRecord) return;
  const originalDraft = mobileDraftFor(objectId, entityId);
  const values = [...(originalDraft?.values ?? currentRecord)];
  values[index] = control.value.trim();
  const isNew = Boolean(originalDraft?.isNew);
  const originalValues = originalDraft?.originalValues ?? currentRecord;
  const changed = isNew || values.some((value, valueIndex) => value !== originalValues[valueIndex]);
  const key = mobileDraftKey(objectId, entityId);
  if (!changed) mobileDataDrafts.delete(key);
  else mobileDataDrafts.set(key, { ...(originalDraft ?? {}), objectId, entityId, values, originalValues, isNew });
  updateMobileSavebar();
}

function updateMobileSavebar() {
  const status = document.querySelector(".mobile-save-status");
  const button = document.querySelector(".mobile-save-button");
  if (!status || !button) return;
  const count = mobileDataDrafts.size;
  status.textContent = count ? `${count} ${count === 1 ? "Datensatz geändert" : "Datensätze geändert"}` : "Änderungen werden hier gesammelt";
  button.disabled = count === 0;
}

function addMobileMaster() {
  const entry = dataNavigationPath.at(-1);
  if (Array.isArray(entry?.filterIds)) { toast("In dieser verknüpften Ansicht kannst du keinen weiteren Master anlegen."); return; }
  const entityId = newEntityId();
  mobileDataDrafts.set(mobileDraftKey(currentDataObject, entityId), { objectId: currentDataObject, entityId, values: defaultDataRecord(currentDataObject), originalValues: null, isNew: true });
  dataSelectedEntityId = entityId;
  dataActiveRelationObject = null;
  dataSelectedTargetEntityId = null;
  mobilePickerState = null;
  mobileMasterPickerReturn = dataNavigationPath.length === 1;
  renderDataRows();
}

function addMobileRelated(objectId) {
  if (!dataSelectedEntityId || mobileDraftFor(currentDataObject, dataSelectedEntityId)?.isNew) { toast("Speichere zuerst den Masterdatensatz."); return; }
  const entityId = newEntityId();
  mobileDataDrafts.set(mobileDraftKey(objectId, entityId), {
    objectId, entityId, values: defaultDataRecord(objectId), originalValues: null, isNew: true,
    parent: { object: currentDataObject, id: dataSelectedEntityId }
  });
  dataSelectedTargetEntityId = entityId;
  renderMasterDetailViews();
}

function discardMobileDraft(objectId, entityId) {
  mobileDataDrafts.delete(mobileDraftKey(objectId, entityId));
  if (dataSelectedEntityId === entityId) dataSelectedEntityId = null;
  if (dataSelectedTargetEntityId === entityId) dataSelectedTargetEntityId = null;
  renderDataRows();
}

function saveMobileDataDrafts() {
  if (!mobileDataDrafts.size) return;
  for (const draft of mobileDataDrafts.values()) {
    if (!draft.values[0]?.trim()) {
      toast(`${getDataTableConfig(draft.objectId).singular} braucht einen Namen.`);
      [...document.querySelectorAll(".mobile-record-field")].find((field) => field.dataset.mobileObjectId === draft.objectId && field.dataset.mobileEntityId === draft.entityId && field.dataset.columnIndex === "0")?.focus();
      return;
    }
  }
  const touched = new Set();
  const drafts = [...mobileDataDrafts.values()].sort((left, right) => Number(Boolean(left.parent)) - Number(Boolean(right.parent)));
  for (const draft of drafts) {
    const module = modules.find((item) => item.id === draft.objectId);
    const values = [...draft.values];
    if (draft.isNew && draft.parent) fillParentReference(draft.objectId, values, draft.parent.object, draft.parent.id);
    if (values.length > 4) values[4] = "Gerade eben";
    if (draft.isNew) {
      module.records.unshift(values);
      dataEntityIds[draft.objectId].unshift(draft.entityId);
      if (draft.parent) linkRelatedEntities(draft.parent.object, draft.parent.id, draft.objectId, draft.entityId);
    } else {
      const index = dataEntityIds[draft.objectId]?.indexOf(draft.entityId) ?? -1;
      if (index >= 0) module.records[index] = values;
    }
    syncDirectRelationsForEntity(draft.objectId, draft.entityId, values, draft.isNew ? null : draft.originalValues);
    const activePathEntry = dataNavigationPath.at(-1);
    if (activePathEntry?.object === draft.objectId && activePathEntry.filterIds?.length === 1 && activePathEntry.filterIds[0] === draft.entityId) activePathEntry.label = values[0];
    touched.add(draft.objectId);
  }
  mobileDataDrafts.clear();
  mobileReferenceEditKeys.clear();
  let persisted = true;
  for (const objectId of touched) persisted = persistDataRecords(objectId) && persisted;
  persistEntityIds();
  persistDataRelations();
  renderDataRows();
  toast(persisted ? "Änderungen gespeichert." : "Änderungen gespeichert, aber nur für diese Sitzung.");
}

function addDataRow() {
  if (editingDataIndex !== null) { blockDesktopDataNavigation(); return; }
  const config = getDataTableConfig(currentDataObject);
  if (!config) return;
  if (Array.isArray(dataNavigationPath.at(-1)?.filterIds)) {
    toast("In einer verknüpften Ansicht kannst du vorhandene Datensätze bearbeiten.");
    return;
  }
  dataSearch = "";
  document.querySelector("#data-search").value = "";
  editingDataIndex = "new";
  confirmDeleteIndex = null;
  dataDraft = ["", "", "Mia Lehmann", currentDataObject === "kunden" ? "Aktiv" : "Planung", "Gerade eben", "—"];
  renderDataRows();
  document.querySelector('#data-rows [data-column-index="0"]')?.focus();
}

function editDataRow(index) {
  if (editingDataIndex !== null) { blockDesktopDataNavigation(); return; }
  const item = modules.find((module) => module.id === currentDataObject);
  if (!item || !item.records[index]) return;
  editingDataIndex = index;
  dataDraft = [...item.records[index]];
  confirmDeleteIndex = null;
  renderDataRows();
  document.querySelector('#data-rows [data-column-index="0"]')?.focus();
}

function saveDataRow(control) {
  const id = currentDataObject;
  const item = modules.find((module) => module.id === id);
  const config = getDataTableConfig(id);
  const row = control.closest("tr");
  if (!item || !row) return;
  const isNew = row.dataset.sheetRow === "new";
  const index = isNew ? -1 : Number(row.dataset.sheetRow);
  const previousRecord = isNew ? null : [...item.records[index]];
  const base = isNew ? [...dataDraft] : [...previousRecord];
  row.querySelectorAll("[data-column-index]").forEach((input) => {
    base[Number(input.dataset.columnIndex)] = input.value.trim();
  });
  if (!base[0]) {
    toast(`${config.singular} braucht einen Namen.`);
    row.querySelector('[data-column-index="0"]')?.focus();
    return;
  }
  base[4] = "Gerade eben";
  if (isNew) {
    item.records.unshift(base);
    dataEntityIds[id].unshift(newEntityId());
  } else {
    item.records[index] = base;
    const activePathEntry = dataNavigationPath.at(-1);
    if (activePathEntry?.object === id && activePathEntry.filterIds?.length === 1 && activePathEntry.filterIds[0] === dataEntityIds[id][index]) activePathEntry.label = base[0];
  }
  const savedEntityId = isNew ? dataEntityIds[id][0] : dataEntityIds[id][index];
  syncDirectRelationsForEntity(id, savedEntityId, base, previousRecord);
  const persisted = persistDataRecords(id);
  persistEntityIds();
  persistDataRelations();
  editingDataIndex = null;
  dataDraft = null;
  if (isNew) {
    const createdId = dataEntityIds[id][0];
    dataSelectedEntityId = createdId;
    dataNavigationPath[dataNavigationPath.length - 1].filterIds = null;
  }
  renderDataTable(id, { keepSearch: true });
  toast(persisted ? `${config.singular} gespeichert.` : `${config.singular} gespeichert, aber nur für diese Sitzung.`);
}

function deleteDataRow(index) {
  const id = dataEntityIds[currentDataObject]?.[index];
  if (!id) return;
  confirmDeleteIndex = null;
  deleteDataEntity(currentDataObject, id);
}

function renderRows(records, head) {
  if (!records.length) return `<tr><td colspan="6"><div class="empty-row">Keine passenden Einträge gefunden.</div></td></tr>`;
  return records.map((record, index) => {
    const statusClass = recordStatus(record[3]);
    return `<tr data-row="${index}" data-record="${esc(record[0])}"><td><div class="row-name"><span class="row-avatar ${["", "green", "violet", "orange"][index % 4]}">${initials(record[0])}</span><span>${esc(record[0])}<small class="row-sub">${esc(record[1])}</small></span></div></td><td>${esc(record[2])}</td><td><span class="status ${statusClass}">${esc(record[3])}</span></td><td>${esc(record[4])}</td><td class="amount">${esc(record[5])}</td><td><button class="row-menu" data-action="row-menu" aria-label="Optionen für ${esc(record[0])}">${icon("more")}</button></td></tr>`;
  }).join("");
}

function updateTable() {
  const item = current();
  if (!item) return;
  const q = tableFilter.trim().toLowerCase();
  let rows = item.records.filter((record) => record.join(" ").toLowerCase().includes(q));
  if (onlyOpen) rows = rows.filter((record) => !/erledigt|bezahlt|abgeschlossen|freigegeben|aktuell|aktiv$/i.test(record[3]));
  document.querySelector("#record-rows").innerHTML = renderRows(rows, "Eintrag");
  document.querySelector("#table-count").textContent = `${rows.length} ${rows.length === 1 ? "Eintrag" : "Einträge"}`;
}

function renderGlobalResults(query) {
  const q = query.trim().toLowerCase();
  if (!q) { searchResults.hidden = true; return; }
  const matches = modules.filter((item) => `${item.title} ${item.group} ${item.desc} ${item.subtitle}`.toLowerCase().includes(q)).slice(0, 6);
  searchResults.innerHTML = `<div class="search-caption">${matches.length ? "Bereiche" : "Keine Treffer"}</div>${matches.map((item) => `<button class="search-result" data-module="${item.id}"><span class="tile-icon">${icon(item.icon)}</span><span><strong>${item.title}</strong><small>${item.group} · ${item.desc}</small></span></button>`).join("") || `<div class="empty-row">Versuch es mit „Projekte“ oder „Rechnungen“.</div>`}`;
  searchResults.hidden = false;
}

function toast(message) {
  const node = document.createElement("div");
  node.className = "toast";
  node.innerHTML = `${icon("check")}<span>${esc(message)}</span>`;
  toastRoot.append(node);
  window.setTimeout(() => node.remove(), 2800);
}

function closePopover() { document.querySelectorAll(".popover").forEach((node) => node.remove()); }
function showPopover(kind) {
  closePopover();
  const pop = document.createElement("div");
  pop.className = "popover";
  if (kind === "notifications") {
    pop.innerHTML = `<div class="popover-header">Benachrichtigungen <span style="float:right;color:#2d83ed;font:600 9px 'DM Sans'">3 neu</span></div>
      <div class="popover-item">${icon("check")}<span><strong>Aufgabe fällig heute</strong><br>„Startseite finalisieren“ wartet auf dich.</span></div>
      <div class="popover-item">${icon("file")}<span><strong>Angebot freigegeben</strong><br>Bergwerk AG hat das Angebot geöffnet.</span></div>
      <div class="popover-item">${icon("users")}<span><strong>Neuer Kontakt</strong><br>Nordlicht Studio wurde hinzugefügt.</span></div>`;
  } else if (kind === "profile") {
    const dark = document.documentElement.dataset.theme === "dark";
    pop.innerHTML = `<div class="profile-card"><span class="profile-large">ML</span><span><strong>Mia Lehmann</strong><small>mia@acme.studio</small></span></div>
      <button class="menu-item" data-action="toggle-theme">${icon(dark ? "sun" : "moon")} ${dark ? "Hellmodus aktivieren" : "Dark Mode aktivieren"}</button><button class="menu-item" data-action="account">${icon("users")} Mein Profil</button><button class="menu-item" data-action="preferences">${icon("settings")} Persönliche Einstellungen</button><button class="menu-item" data-action="switch-workspace">${icon("folder")} Arbeitsbereich wechseln</button>`;
  } else {
    pop.innerHTML = `<div class="popover-header">Wie können wir helfen?</div><button class="menu-item" data-action="start-onboarding">${icon("spark")} Einführung ansehen</button><div class="popover-item">${icon("help")}<span><strong>Erste Schritte</strong><br>Erkunde die Bereiche über die Kacheln.</span></div><div class="popover-item">${icon("file")}<span><strong>Hilfe-Center</strong><br>Tipps und Antworten rund um Acme.</span></div><button class="menu-item" data-action="contact-support">${icon("arrow")} Support kontaktieren</button>`;
  }
  document.body.append(pop);
}

function openCreateModal() {
  const item = current();
  if (!item) return;
  overlayRoot.innerHTML = `<div class="overlay" data-action="overlay-close"><form class="modal" id="create-form"><header class="modal-header"><div><h2>${item.action}</h2><p>Fülle die wichtigsten Angaben aus, um fortzufahren.</p></div><button type="button" class="close-button" data-action="close-modal" aria-label="Schließen">${icon("plus")}</button></header>
    <div class="form-body"><div class="field"><label for="record-name">${item.id === "aufgaben" ? "Aufgabenname" : item.id === "projekte" ? "Projektname" : "Name"}</label><input id="record-name" name="name" placeholder="z. B. ${item.id === "kunden" ? "Sonnengarten AG" : item.id === "aufgaben" ? "Entwurf prüfen" : "Neuer Eintrag"}" required autofocus /></div>
    <div class="field"><label for="record-related">${item.id === "kunden" ? "Branche" : "Kunde oder Projekt"}</label><input id="record-related" name="related" placeholder="z. B. Nordlicht Studio" /></div>
    <div class="field"><label for="record-owner">Verantwortlich</label><select id="record-owner" name="owner"><option>Mia Lehmann</option><option>Noah Keller</option><option>Lea Baumann</option><option>Jonas Frei</option></select></div>
    <div class="field"><label for="record-status">Status</label><select id="record-status" name="status"><option>Offen</option><option>In Arbeit</option><option>In Prüfung</option><option>Geplant</option></select></div>
    <div class="field"><label for="record-note">Notiz <span style="font-weight:400;color:#9aa6b6">(optional)</span></label><textarea id="record-note" name="note" placeholder="Ergänze eine kurze Notiz…"></textarea></div></div>
    <footer class="modal-footer"><button class="secondary-button" type="button" data-action="close-modal">Abbrechen</button><button class="primary-button" type="submit">${icon("check")} Eintrag speichern</button></footer></form></div>`;
  document.querySelector("#record-name").focus();
}

function openDetail(record) {
  const item = current();
  if (!item || !record) return;
  overlayRoot.innerHTML = `<div class="overlay" data-action="overlay-close"><section class="modal"><header class="modal-header"><div><h2>${esc(record[0])}</h2><p>${esc(record[1])}</p></div><button class="close-button" data-action="close-modal" aria-label="Schließen">${icon("plus")}</button></header><div class="form-body"><div class="field"><label>Verantwortlich</label><div>${esc(record[2])}</div></div><div class="field"><label>Status</label><div><span class="status ${recordStatus(record[3])}">${esc(record[3])}</span></div></div><div class="field"><label>Zuletzt aktualisiert</label><div>${esc(record[4])}</div></div><div class="field"><label>Wert / Details</label><div>${esc(record[5])}</div></div><p class="welcome-copy" style="font-size:10px;margin:0">Dieser Eintrag gehört zu <strong>${item.title}</strong>. Hier kannst du Details ansehen und weiterarbeiten.</p></div><footer class="modal-footer"><button class="secondary-button" data-action="close-modal">Schließen</button><button class="primary-button" data-action="edit-record">${icon("file")} Bearbeiten</button></footer></section></div>`;
}

function openPreferences(title = "Persönliche Einstellungen") {
  overlayRoot.innerHTML = `<div class="overlay" data-action="overlay-close"><form class="modal" id="preferences-form"><header class="modal-header"><div><h2>${title}</h2><p>Verwalte deine Angaben für Acme Studio.</p></div><button class="close-button" type="button" data-action="close-modal" aria-label="Schließen">${icon("plus")}</button></header><div class="form-body"><div class="field"><label for="pref-name">Name</label><input id="pref-name" value="Mia Lehmann" /></div><div class="field"><label for="pref-email">E-Mail-Adresse</label><input id="pref-email" type="email" value="mia@acme.studio" /></div><div class="field"><label for="pref-notify">E-Mail-Benachrichtigungen</label><select id="pref-notify"><option>Wichtige Updates</option><option>Alle Aktivitäten</option><option>Keine E-Mails</option></select></div></div><footer class="modal-footer"><button class="secondary-button" type="button" data-action="close-modal">Abbrechen</button><button class="primary-button" type="submit">${icon("check")} Speichern</button></footer></form></div>`;
}

function showShortcuts() {
  overlayRoot.innerHTML = `<div class="overlay" data-action="overlay-close"><section class="modal"><header class="modal-header"><div><h2>Tastenkürzel</h2><p>Mit ein paar Tasten schneller durch Acme.</p></div><button class="close-button" data-action="close-modal" aria-label="Schließen">${icon("plus")}</button></header><div class="form-body"><div class="progress-title"><span>Suche öffnen</span><kbd>Ctrl / ⌘ + K</kbd></div><div class="progress-title"><span>Zur Startseite</span><kbd>Esc</kbd></div><div class="progress-title"><span>Bereich öffnen</span><kbd>Enter</kbd></div></div><footer class="modal-footer"><button class="primary-button" data-action="close-modal">Verstanden</button></footer></section></div>`;
}

function setTourRoute(route) {
  if (route === "home") {
    if (currentModule === null && currentDataObject === null) return;
    history.replaceState({ module: null }, "", `${location.pathname}${location.search}`);
    renderHome();
    return;
  }
  const dataRoute = /^daten-(kunden|projekte)$/.exec(route);
  if (dataRoute) {
    const id = dataRoute[1];
    if (currentDataObject === id) return;
    history.replaceState({ dataObject: id }, "", `${location.pathname}${location.search}#${route}`);
    renderDataTable(id);
    return;
  }
  if (currentModule === route && currentDataObject === null) return;
  history.replaceState({ module: route }, "", `${location.pathname}${location.search}#${route}`);
  renderModule(route);
}

function clearTourTarget() {
  if (tourTarget?.isConnected) {
    tourTarget.classList.remove("tour-highlight");
    if (tourTargetTabindex === null) tourTarget.removeAttribute("tabindex");
    else tourTarget.setAttribute("tabindex", tourTargetTabindex);
  }
  tourTarget = null;
  tourTargetTabindex = null;
}

function renderOnboardingStep() {
  if (!tourActive) return;
  clearTourTarget();
  searchResults.hidden = true;
  const step = onboardingSteps[onboardingStep];
  const isLastStep = onboardingStep === onboardingSteps.length - 1;
  setTourRoute(step.route);
  const mobileTour = window.matchMedia("(max-width: 700px)").matches;
  const targetSelector = mobileTour ? (step.mobileTarget ?? step.target) : step.target;
  tourTarget = document.querySelector(targetSelector) || (step.fallback ? document.querySelector(step.fallback) : null);
  if (!tourTarget) return closeOnboarding("Die Einführung wurde beendet, weil das markierte Element nicht verfügbar ist.");

  tourTargetTabindex = tourTarget.getAttribute("tabindex");
  if (!tourTarget.matches('button, input, select, textarea, a[href], [tabindex]')) tourTarget.setAttribute("tabindex", "-1");
  tourTarget.classList.add("tour-highlight");

  onboardingRoot.innerHTML = `<div class="tour-shade" data-tour-shade="top"></div><div class="tour-shade" data-tour-shade="left"></div><div class="tour-shade" data-tour-shade="right"></div><div class="tour-shade" data-tour-shade="bottom"></div><div class="tour-spotlight" aria-hidden="true"></div>
    <aside class="tour-card" role="region" aria-live="polite" aria-label="Einführung, Schritt ${onboardingStep + 1} von ${onboardingSteps.length}">
      <div class="tour-card-top"><span class="tour-label">${icon("spark")} Acme · Einführung</span><button class="tour-close" data-action="skip-onboarding" aria-label="Einführung überspringen">${icon("plus")}</button></div>
      <div class="tour-progress"><span>Schritt ${onboardingStep + 1} von ${onboardingSteps.length}</span><div><i style="width:${Math.round(((onboardingStep + 1) / onboardingSteps.length) * 100)}%"></i></div></div>
      <h2>${step.title}</h2><p>${step.copy}</p>
      <footer class="tour-actions"><button class="tour-skip" data-action="skip-onboarding">Überspringen</button><div><button class="secondary-button" data-action="onboarding-previous" ${onboardingStep === 0 ? "disabled" : ""}>Zurück</button><button class="primary-button" data-action="onboarding-next">${isLastStep ? "Fertig" : "Weiter"} ${icon(isLastStep ? "check" : "arrow")}</button></div></footer>
    </aside>`;

  tourTarget.scrollIntoView({ behavior: "auto", block: "center", inline: "nearest" });
  window.requestAnimationFrame(() => {
    if (!tourActive || !tourTarget?.isConnected) return;
    positionTour();
    tourTarget.focus({ preventScroll: true });
  });
}

function positionTour() {
  if (!tourActive || !tourTarget?.isConnected) return;
  const rect = tourTarget.getBoundingClientRect();
  const padding = 6;
  const top = Math.max(0, rect.top - padding);
  const left = Math.max(0, rect.left - padding);
  const right = Math.min(window.innerWidth, rect.right + padding);
  const bottom = Math.min(window.innerHeight, rect.bottom + padding);
  const width = window.innerWidth;
  const height = window.innerHeight;
  const css = (x, y, w, h) => `left:${x}px;top:${y}px;width:${Math.max(0, w)}px;height:${Math.max(0, h)}px`;

  onboardingRoot.querySelector('[data-tour-shade="top"]').style.cssText = css(0, 0, width, top);
  onboardingRoot.querySelector('[data-tour-shade="left"]').style.cssText = css(0, top, left, bottom - top);
  onboardingRoot.querySelector('[data-tour-shade="right"]').style.cssText = css(right, top, width - right, bottom - top);
  onboardingRoot.querySelector('[data-tour-shade="bottom"]').style.cssText = css(0, bottom, width, height - bottom);

  const spotlight = onboardingRoot.querySelector(".tour-spotlight");
  spotlight.style.cssText = css(left, top, right - left, bottom - top);

  const card = onboardingRoot.querySelector(".tour-card");
  const cardRect = card.getBoundingClientRect();
  const gap = 14;
  const roomRight = width - right;
  const roomLeft = left;
  const roomBottom = height - bottom;
  const roomTop = top;
  let placement;
  let cardLeft;
  let cardTop;

  if (roomRight >= cardRect.width + gap + 8) {
    placement = "right";
    cardLeft = right + gap;
    cardTop = rect.top + rect.height / 2 - cardRect.height / 2;
  } else if (roomLeft >= cardRect.width + gap + 8) {
    placement = "left";
    cardLeft = left - cardRect.width - gap;
    cardTop = rect.top + rect.height / 2 - cardRect.height / 2;
  } else if (roomBottom >= cardRect.height + gap + 8 || roomBottom >= roomTop) {
    placement = "bottom";
    cardLeft = rect.left + rect.width / 2 - cardRect.width / 2;
    cardTop = bottom + gap;
  } else {
    placement = "top";
    cardLeft = rect.left + rect.width / 2 - cardRect.width / 2;
    cardTop = top - cardRect.height - gap;
  }

  cardLeft = Math.max(12, Math.min(cardLeft, width - cardRect.width - 12));
  cardTop = Math.max(12, Math.min(cardTop, height - cardRect.height - 12));
  card.dataset.placement = placement;
  card.style.left = `${cardLeft}px`;
  card.style.top = `${cardTop}px`;
  const targetCenter = placement === "left" || placement === "right"
    ? rect.top + rect.height / 2 - cardTop
    : rect.left + rect.width / 2 - cardLeft;
  const maxPointer = (placement === "left" || placement === "right" ? cardRect.height : cardRect.width) - 22;
  card.style.setProperty("--tour-pointer", `${Math.max(22, Math.min(targetCenter, maxPointer))}px`);
}

function scheduleTourPosition() {
  if (tourActive) window.requestAnimationFrame(positionTour);
}

function showOnboarding() {
  onboardingStep = 0;
  onboardingReturnModule = currentModule;
  onboardingReturnDataObject = currentDataObject;
  onboardingReturnFocus = document.activeElement?.closest?.(".popover")
    ? document.querySelector('.icon-button[data-action="help"]')
    : document.activeElement === document.body ? null : document.activeElement;
  tourActive = true;
  closePopover();
  searchResults.hidden = true;
  window.addEventListener("resize", scheduleTourPosition);
  window.addEventListener("scroll", scheduleTourPosition, true);
  renderOnboardingStep();
}

function closeOnboarding(message) {
  rememberOnboardingDismissal();
  clearTourTarget();
  tourActive = false;
  onboardingRoot.innerHTML = "";
  window.removeEventListener("resize", scheduleTourPosition);
  window.removeEventListener("scroll", scheduleTourPosition, true);
  if (onboardingReturnDataObject) {
    const id = onboardingReturnDataObject;
    history.replaceState({ dataNavigationPath }, "", `${location.pathname}${location.search}#daten-${id}`);
    renderDataTable(id);
  } else if (onboardingReturnModule !== currentModule) {
    setTourRoute(onboardingReturnModule || "home");
  }
  onboardingReturnModule = null;
  onboardingReturnDataObject = null;
  if (onboardingReturnFocus?.isConnected) onboardingReturnFocus.focus();
  onboardingReturnFocus = null;
  toast(message);
}

function skipOnboarding() {
  closeOnboarding("Einführung übersprungen. Du kannst sie jederzeit über Hilfe erneut öffnen.");
}

function finishOnboarding() {
  closeOnboarding("Einführung abgeschlossen. Du kannst sie später über Hilfe erneut öffnen.");
}

function advanceOnboarding() {
  if (onboardingStep === onboardingSteps.length - 1) {
    finishOnboarding();
    return;
  }
  onboardingStep += 1;
  renderOnboardingStep();
}

function rewindOnboarding() {
  if (onboardingStep > 0) {
    onboardingStep -= 1;
    renderOnboardingStep();
  }
}

document.body.addEventListener("click", (event) => {
  if (tourActive && !event.target.closest(".tour-card")) return;
  const dataSheetRow = event.target.closest("tr[data-sheet-row]");
  if (dataSheetRow && !event.target.closest("[data-action], input, select") && dataSheetRow.dataset.sheetRow !== "new") {
    if (hasDesktopDataEdit()) { blockDesktopDataNavigation(); return; }
    const id = dataEntityIds[currentDataObject]?.[Number(dataSheetRow.dataset.sheetRow)];
    if (id && id !== dataSelectedEntityId) {
      dataSelectedEntityId = id;
      dataActiveRelationObject = null;
      dataSelectedTargetEntityId = null;
      renderDataRows();
    }
    return;
  }
  const dataObjectButton = event.target.closest("[data-data-object]");
  if (dataObjectButton) {
    searchResults.hidden = true;
    searchInput.value = "";
    closePopover();
    navigateToDataObject(dataObjectButton.dataset.dataObject);
    return;
  }
  const moduleButton = event.target.closest("[data-module]");
  if (moduleButton) {
    searchResults.hidden = true;
    searchInput.value = "";
    closePopover();
    navigateToModule(moduleButton.dataset.module);
    return;
  }
  const control = event.target.closest("[data-action]");
  if (!control) {
    if (!event.target.closest(".popover")) closePopover();
    if (!event.target.closest(".searchbox, .search-results")) searchResults.hidden = true;
    return;
  }
  const action = control.dataset.action;
  if (hasDesktopDataEdit() && ["home", "data-path", "show-all-data", "select-data-row", "select-relation-tab", "open-mobile-picker", "back-to-master-list", "open-reference-master", "open-related-data", "open-related-group", "delete-related-row", "delete-data-row", "add-data-row", "edit-data-row"].includes(action)) {
    blockDesktopDataNavigation();
    return;
  }
  if (action === "home") { closePopover(); searchResults.hidden = true; searchInput.value = ""; navigateHome(); }
  else if (action === "notifications" || action === "profile" || action === "help") showPopover(action);
  else if (action === "start-onboarding") showOnboarding();
  else if (action === "onboarding-next") advanceOnboarding();
  else if (action === "onboarding-previous") rewindOnboarding();
  else if (action === "skip-onboarding") skipOnboarding();
  else if (action === "add-data-row") addDataRow();
  else if (action === "select-data-row") {
    const id = dataEntityIds[currentDataObject]?.[Number(control.dataset.rowIndex)];
    if (id) {
      dataSelectedEntityId = id;
      dataActiveRelationObject = null;
      dataSelectedTargetEntityId = null;
      renderDataRows();
    }
  }
  else if (action === "select-relation-tab") {
    dataActiveRelationObject = control.dataset.objectId;
    dataSelectedTargetEntityId = null;
    renderMasterDetailViews();
  }
  else if (action === "open-mobile-picker") openMobilePicker(control.dataset.pickerKind);
  else if (action === "back-to-master-list") backToMobileMasterList();
  else if (action === "close-mobile-picker") closeMobilePicker();
  else if (action === "select-mobile-picker-item") selectMobilePickerItem(control.dataset.entityId);
  else if (action === "edit-mobile-reference") toggleMobileReferenceEdit(control, true);
  else if (action === "finish-mobile-reference") toggleMobileReferenceEdit(control, false);
  else if (action === "open-reference-master") openReferenceMaster(control);
  else if (action === "open-related-data") openRelatedDataObject(control.dataset.objectId, control.dataset.entityId);
  else if (action === "open-related-group") openRelatedDataGroup(control.dataset.objectId);
  else if (action === "add-related-row") addRelatedDataRow(control.dataset.objectId);
  else if (action === "add-mobile-related") addMobileRelated(control.dataset.objectId);
  else if (action === "edit-related-row") editRelatedDataRow(control.dataset.objectId, Number(control.dataset.rowIndex));
  else if (action === "save-related-row") saveRelatedDataRow(control);
  else if (action === "cancel-related-row") { relationEditing = null; relationDraft = null; renderMasterDetailViews(); }
  else if (action === "delete-related-row") {
    const config = getDataTableConfig(control.dataset.objectId);
    if (window.confirm(`${config.singular} löschen? Zugehörige Verknüpfungen werden ebenfalls entfernt.`)) deleteDataEntity(control.dataset.objectId, control.dataset.entityId);
  }
  else if (action === "add-mobile-master") addMobileMaster();
  else if (action === "delete-mobile-master") {
    if (window.confirm(`${getDataTableConfig(currentDataObject).singular} und seine Verknüpfungen löschen?`)) deleteDataEntity(currentDataObject, control.dataset.entityId);
  }
  else if (action === "delete-mobile-target") {
    const config = getDataTableConfig(control.dataset.objectId);
    if (window.confirm(`${config.singular} und seine Verknüpfungen löschen?`)) deleteDataEntity(control.dataset.objectId, control.dataset.entityId);
  }
  else if (action === "discard-mobile-draft") discardMobileDraft(control.dataset.objectId, control.dataset.entityId);
  else if (action === "save-mobile-data") saveMobileDataDrafts();
  else if (action === "data-path") navigateDataPath(Number(control.dataset.pathIndex));
  else if (action === "show-all-data") {
    const entry = dataNavigationPath.at(-1);
    if (entry) {
      entry.filterIds = null;
      entry.label = getDataTableConfig(entry.object).title;
      dataSelectedEntityId = null;
      renderDataTable(entry.object, { keepSearch: true });
    }
  }
  else if (action === "edit-data-row") editDataRow(Number(control.dataset.rowIndex));
  else if (action === "save-data-row") saveDataRow(control);
  else if (action === "cancel-data-row") { editingDataIndex = null; dataDraft = null; renderDataRows(); }
  else if (action === "delete-data-row") { confirmDeleteIndex = Number(control.dataset.rowIndex); editingDataIndex = null; dataDraft = null; renderDataRows(); }
  else if (action === "confirm-delete-data-row") deleteDataRow(Number(control.dataset.rowIndex));
  else if (action === "cancel-delete-data-row") { confirmDeleteIndex = null; renderDataRows(); }
  else if (action === "new") openCreateModal();
  else if (action === "close-modal") overlayRoot.innerHTML = "";
  else if (action === "overlay-close" && event.target === control) {
    if (control.dataset.onboarding === "true") skipOnboarding();
    else overlayRoot.innerHTML = "";
  }
  else if (action === "preferences" || action === "account") { closePopover(); openPreferences(action === "account" ? "Mein Profil" : "Persönliche Einstellungen"); }
  else if (action === "toggle-theme") {
    const dark = document.documentElement.dataset.theme !== "dark";
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    try { localStorage.setItem("acme-theme", dark ? "dark" : "light"); } catch { /* Theme still applies for this session. */ }
    closePopover();
    toast(dark ? "Dark Mode aktiviert." : "Hellmodus aktiviert.");
  }
  else if (action === "switch-workspace") { closePopover(); toast("Du arbeitest bereits in Acme Studio."); }
  else if (action === "contact-support") { closePopover(); toast("Das Support-Team meldet sich bei dir."); }
  else if (action === "filter") { onlyOpen = !onlyOpen; control.innerHTML = `${icon("filter")} ${onlyOpen ? "Alle anzeigen" : "Filter"}`; updateTable(); }
  else if (action === "page") { document.querySelectorAll(".page-button").forEach((button) => button.classList.toggle("active", button === control)); toast(`Seite ${control.textContent} geladen.`); }
  else if (action === "row-menu") { event.stopPropagation(); toast("Weitere Optionen folgen in dieser Demo."); }
  else if (action === "progress-menu") toast("Fortschritt wird automatisch aktualisiert.");
  else if (action === "activity") toast("Alle Aktivitäten sind in dieser Übersicht sichtbar.");
  else if (action === "show-shortcuts") showShortcuts();
  else if (action === "close-modal") overlayRoot.innerHTML = "";
  else if (action === "edit-record") { overlayRoot.innerHTML = ""; toast("Bearbeiten ist für den nächsten Schritt vorgemerkt."); }
  else if (action === "row") { const record = current()?.records[Number(control.dataset.index)]; openDetail(record); }
  else if (action === "profile") showPopover("profile");
});

document.body.addEventListener("input", (event) => {
  if (event.target === searchInput) renderGlobalResults(searchInput.value);
  if (event.target.id === "table-search") { tableFilter = event.target.value; updateTable(); }
  if (event.target.id === "data-search") { dataSearch = event.target.value; renderDataRows(); }
  if (event.target.matches(".mobile-record-field")) mobileFieldChanged(event.target);
  if (event.target.id === "mobile-picker-search" && mobilePickerState) {
    mobilePickerState.query = event.target.value;
    renderMobilePickerResults();
  }
});

document.body.addEventListener("change", (event) => {
  if (event.target.matches(".mobile-record-field")) mobileFieldChanged(event.target);
});

document.body.addEventListener("submit", (event) => {
  event.preventDefault();
  if (event.target.id === "create-form") {
    const data = new FormData(event.target);
    const item = current();
    if (item) {
      item.records.unshift([data.get("name"), data.get("related") || "Neu angelegt", data.get("owner"), data.get("status"), "Gerade eben", "—"]);
      dataEntityIds[item.id].unshift(newEntityId());
      for (const definition of relationDefinitions.filter((entry) => entry.from === item.id)) {
        const target = modules.find((candidate) => candidate.id === definition.to);
        const targetIndex = target?.records.findIndex((record) => definition.match(item.records[0], record)) ?? -1;
        if (targetIndex >= 0) dataRelations.push({ from: { object: item.id, id: dataEntityIds[item.id][0] }, to: { object: definition.to, id: dataEntityIds[definition.to][targetIndex] } });
      }
      if (/^\d+$/.test(item.stats[0])) item.stats[0] = String(Number(item.stats[0]) + 1);
      persistDataRecords(item.id);
      persistEntityIds();
      persistDataRelations();
    }
    overlayRoot.innerHTML = "";
    renderModule(currentModule);
    toast("Eintrag wurde gespeichert.");
  } else if (event.target.id === "preferences-form") {
    overlayRoot.innerHTML = "";
    toast("Deine Einstellungen wurden gespeichert.");
  }
});

document.body.addEventListener("keydown", (event) => {
  if (tourActive) {
    if (event.key === "Tab") {
      const tourCard = onboardingRoot.querySelector(".tour-card");
      const focusable = [...tourCard.querySelectorAll('button:not(:disabled)')];
    const first = focusable[0];
    const last = focusable.at(-1);
      if (!tourCard.contains(document.activeElement)) { event.preventDefault(); (event.shiftKey ? last : first).focus(); }
      else if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    } else if (event.key === "Escape") {
      event.preventDefault();
      skipOnboarding();
    }
    return;
  }
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") { event.preventDefault(); searchInput.focus(); searchInput.select(); }
  if (event.key === "Escape") {
    if (overlayRoot.innerHTML) overlayRoot.innerHTML = "";
    else if (mobilePickerState) closeMobilePicker();
    else if (hasDesktopDataEdit()) { event.preventDefault(); blockDesktopDataNavigation(); return; }
    else if (currentModule) navigateHome();
    else if (currentDataObject) navigateHome();
    searchResults.hidden = true; searchInput.value = ""; closePopover();
  }
  if (event.key === "Enter" && document.activeElement === searchInput) {
    const first = searchResults.querySelector("[data-module]");
    if (first) first.click();
  }
});

main.addEventListener("click", (event) => {
  const row = event.target.closest("tr[data-row]");
  if (row && !event.target.closest("button")) openDetail(current()?.records.find((record) => record[0] === row.dataset.record));
});

window.addEventListener("beforeunload", (event) => {
  if (!mobileDataDrafts.size && !hasDesktopDataEdit()) return;
  event.preventDefault();
  event.returnValue = "";
});

window.addEventListener("popstate", () => {
  const id = location.hash.slice(1);
  const dataRoute = /^daten-([a-z0-9-]+)$/.exec(id);
  if (dataRoute && modules.some((item) => item.id === dataRoute[1])) {
    dataNavigationPath = Array.isArray(history.state?.dataNavigationPath) ? history.state.dataNavigationPath : [{ object: dataRoute[1], filterIds: null, label: getDataTableConfig(dataRoute[1]).title }];
    const entry = dataNavigationPath.at(-1);
    const restoredSelection = history.state?.selectedEntityId;
    dataSelectedEntityId = entry?.filterIds?.length === 1 ? entry.filterIds[0] : (dataEntityIds[dataRoute[1]]?.includes(restoredSelection) ? restoredSelection : null);
    dataActiveRelationObject = null;
    dataSelectedTargetEntityId = null;
    if (dataSelectedEntityId) {
      mobileMasterPickerReturn = isMobileDataLayout() && dataNavigationPath.length === 1;
      mobilePickerState = null;
    } else startMobileMasterSelection(dataRoute[1]);
    renderDataTable(dataRoute[1]);
  }
  else if (modules.some((item) => item.id === id)) renderModule(id);
  else renderHome();
});

try {
  await loadApiState();
} catch {
  apiReady = false;
  restoreDataRecords();
  initializeEntityData();
}
const initialRoute = location.hash.slice(1);
const initialDataRoute = /^daten-([a-z0-9-]+)$/.exec(initialRoute);
if (initialDataRoute && modules.some((item) => item.id === initialDataRoute[1])) {
  dataNavigationPath = Array.isArray(history.state?.dataNavigationPath) ? history.state.dataNavigationPath : [{ object: initialDataRoute[1], filterIds: null, label: getDataTableConfig(initialDataRoute[1]).title }];
  const initialEntry = dataNavigationPath.at(-1);
  const restoredSelection = history.state?.selectedEntityId;
  dataSelectedEntityId = initialEntry?.filterIds?.length === 1 ? initialEntry.filterIds[0] : (dataEntityIds[initialDataRoute[1]]?.includes(restoredSelection) ? restoredSelection : null);
  if (dataSelectedEntityId) {
    mobileMasterPickerReturn = isMobileDataLayout() && dataNavigationPath.length === 1;
    mobilePickerState = null;
  } else startMobileMasterSelection(initialDataRoute[1]);
  renderDataTable(initialDataRoute[1]);
}
else if (modules.some((item) => item.id === initialRoute)) renderModule(initialRoute);
else renderHome();
if (!apiReady) toast("Datenbank nicht erreichbar. Änderungen werden nicht gespeichert.");
if (!hasDismissedOnboarding()) window.setTimeout(showOnboarding, 180);
  }
};
