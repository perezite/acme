# NavigationExperiment2 · Klarwerk

Eigenständiger HTML-Prototyp mit einem Screen, möglichst nah an den gelieferten Light- und Dark-Mode-Mockups. Der erste Prototyp und die Blazor-App werden nicht verändert.

## Starten

`index.html` direkt im Browser öffnen. Kein Build, keine Installation und kein Server erforderlich. Schrift und Symbole sind lokal enthalten; die Anwendung funktioniert auch offline.

## Interaktionen

- Die Kacheln sind echte Buttons. Ein Klick setzt die grüne Auswahl und zeigt eine kurze Toast-Bestätigung. Es werden keine weiteren Screens geöffnet.
- Mond/Sonne schaltet zwischen Light und Dark Mode um. Die Auswahl wird, soweit verfügbar, im Browser gespeichert.
- Die Suche gleicht Titel und Untertitel ab. Andere Kacheln werden abgeblendet; ihre Positionen bleiben erhalten. Enter wählt den ersten Treffer aus.
- Glocke und Profil öffnen kleine Popover auf demselben Screen. Escape oder ein Klick ausserhalb schliesst sie.
- Das Logo setzt die Suche und Kachelauswahl zurück. Strg+K bzw. Cmd+K fokussiert die Suche.
- Buttons und Suche sind per Tastatur bedienbar. Reduzierte Bewegung wird berücksichtigt.

## Layout

Die Referenzfläche ist **1920 × 1080 CSS-Pixel** bei 100 % Browser-Zoom. In dieser Grösse werden die Kachelpositionen und Proportionen aus den Mockups nachgebildet, inklusive der bewusst versetzten Anordnung und der Untertitel.

Ab 1200px Fensterbreite wird die Referenzfläche proportional an die verfügbare Breite angepasst, maximal bis zur Originalgrösse. Bei geringer Fensterhöhe kann die Seite vertikal gescrollt werden. Dadurch bleibt die Schrift lesbar.

Unter 1200px ordnen sich die Kacheln in vier Spalten an, unter 680px in zwei Spalten. Breite Kacheln belegen weiterhin zwei Spalten. Kopfzeile, Suchfeld und Typografie passen sich an das Fenster an.

## Dateien

- `index.html`: Screen, Kopfzeile und SVG-Symbole
- `styles.css`: Design, Farbschemata und responsive Layouts
- `app.js`: Kachelinhalte, Auswahl, Suche, Popover und Theme-Wechsel
- `assets/fonts/`: lokal eingebundene Inter-Schrift und SIL Open Font License

Die Inter-Schrift stammt aus dem offiziellen [Inter-Projekt](https://github.com/rsms/inter), die Lizenz liegt unter `assets/fonts/OFL.txt`.
