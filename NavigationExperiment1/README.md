# Acme · Kategorisierte Kachel-Gruppen

Ein eigenständiger, klickbarer Web-App-Prototyp auf Basis des Navigationskonzepts „Kategorisierte Kachel-Gruppen“.

## Öffnen

Öffne `index.html` direkt in einem aktuellen Browser. Es ist kein Build-Schritt und keine Installation nötig.

## Enthalten

- Drei gruppierte Navigationsbereiche mit zwölf Kacheln: Vertrieb, Projekte und Finanzen
- Zusätzliche Kategorie „Daten“ mit kompakten Rohdatentabellen für Kunden und Projekte
- Persönliches Startmenü über „Startseite anpassen“: Kategorien hinzufügen, umbenennen, verschieben und entfernen; Kacheln aus dem App-Katalog hinzufügen, verschieben und entfernen
- Bearbeitung per Ziehen am Desktop oder über „Verschieben“ auf Desktop und Mobile; Speichern und Abbrechen; kurze Toast-Meldungen bestätigen die Aktionen
- Beim Ziehen zeigt eine dezente Geister-Kachel die Einfügeposition. Die anderen Kacheln rücken schon während des Ziehens nach; beim Loslassen wird diese Reihenfolge übernommen, auch zwischen Kategorien. Escape oder Ablegen ausserhalb der Kategorien verwirft die Vorschau. Über „Verschieben“ lässt sich die Position auch ohne Ziehen wählen.
- Kategorien lassen sich mit derselben Live-Vorschau samt Kacheln umordnen: Ein Geister-Platzhalter zeigt die Position, andere Kategorien gleiten mit einer kurzen Animation zur Seite. Escape oder Ablegen ausserhalb des Startmenüs verwirft die Vorschau. Reduzierte Bewegung wird berücksichtigt.
- Die Live-Vorschau reagiert kurz nach dem Eintritt in eine Nachbarkachel oder Kategorie. Bewegungsrichtung und eine kleine Toleranz verhindern unbeabsichtigtes Hin-und-Herspringen beim Nachrücken.
- Datensätze in den Rohdatentabellen inline hinzufügen, bearbeiten und nach Bestätigung löschen
- Master-Detail-Rohdatenansicht: Mastertabelle und Target-Tabelle mit Tabs für die jeweiligen Beziehungstypen
- Verknüpfte Kunden, Projekte, Angebote, Verträge, Aktivitäten, Aufgaben, Zeiterfassungen und Rechnungen ansehen, hinzufügen, bearbeiten und löschen
- Rekursiv navigieren, indem ein Target-Datensatz als nächster Master geöffnet wird
- Auf Smartphones werden Master und ausgewählter Target als editierbare Formulare dargestellt; Master und Target lassen sich über eine Suchansicht mit scrollbarer Ergebnisliste auswählen
- Mobile Änderungen lassen sich über eine fixierte Speicherleiste gemeinsam speichern
- Eigenständige Modulansichten mit Kennzahlen, Datentabelle, Aktivitäten und Fortschritt
- Suche, Filter, Breadcrumbs, Browser-Zurück/Vorwärts und Tastenkürzel
- Geführte UI-Tour beim ersten Start: Sie hebt Bedienelemente hervor und erklärt sie direkt an Ort und Stelle; über das Hilfe-Symbol jederzeit erneut aufrufbar
- Beispiel-Flows zum Anlegen von Einträgen und Bearbeiten der Profileinstellungen
- Responsive Darstellung für Desktop und Smartphone

Die persönliche Menüanordnung sowie Änderungen an Datensätzen und Beziehungen werden lokal im Browser gespeichert. Entfernte Menükacheln löschen keine Datensätze. Die Beispieldaten nutzen dafür stabile IDs und keine echte Datenbank.
