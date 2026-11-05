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

Die Referenzfläche ist **1920 × 1080 CSS-Pixel** bei 100 % Browser-Zoom. Die Kacheln folgen einem unsichtbaren Raster aus acht gleich breiten Spalten: schmale Kacheln belegen eine Spalte, breite Kacheln zwei. Alle Kacheln sind 136px hoch und haben horizontal wie vertikal 16px Abstand. Die versetzte Anordnung und die Untertitel bleiben erhalten; die Kanten sind auf gemeinsame Fluchten ausgerichtet.

Ab 1200px Fensterbreite wird die Referenzfläche proportional an die verfügbare Breite angepasst, maximal bis zur Originalgrösse. Bei geringer Fensterhöhe kann die Seite vertikal gescrollt werden. Diese Desktop-Stufe bleibt unverändert.

Unter 1200px ordnen sich die Kacheln in vier Spalten an, unter 680px in zwei Spalten. Breite Kacheln belegen weiterhin zwei Spalten. Unter 680px wechselt die Suche in eine eigene Kopfzeile.

Schrift, Symbole, Kachelhöhen und Abstände ändern sich fliessend. Am Übergang bei 1200px schliessen sie an die mit 62,5 % skalierte Desktop-Fläche an. Bis 1000px gehen sie in die Tablet-Grössen über; zwischen 1000px und 320px werden sie allmählich kompakter. Die Layout-Grenze bei 680px ändert nur die Anordnung, ohne eine neue Grössenstufe einzuführen. Eine zusätzliche Grössenstufe bei 360px entfällt.

Die gemeinsamen CSS-Variablen `--reflow-step` und `--compact-step` steuern diese Übergänge. Die Schriftgrössen an den drei Bezugspunkten sind:

| Text | 1200px Übergang | 1000px Tablet | 320px Mobile |
| --- | --- | --- | --- |
| Seitentitel | 36,25px | 40px | 29px |
| Breite Kachel: Titel / Untertitel | 18,75 / 11,25px | 26 / 16px | 24 / 15px |
| Schmale Kachel: Titel / Untertitel | 15 / 10,625px | 22 / 15px | 19 / 14px |

Die anfängliche Vergrösserung nach dem Umbruch auf vier Spalten schafft mehr Lesbarkeit, ohne den vorherigen abrupten Sprung beim Wechsel der Stufe.

## Dateien

- `index.html`: Screen, Kopfzeile und SVG-Symbole
- `styles.css`: Design, Farbschemata und responsive Layouts
- `app.js`: Kachelinhalte, Auswahl, Suche, Popover und Theme-Wechsel
- `assets/fonts/`: lokal eingebundene Inter-Schrift und SIL Open Font License
- `assets/profile-alex.png`: lokal eingebundenes, mit Imagegen erzeugtes Porträt für das fiktive Demoprofil Alex; der verwendete Prompt steht in `assets/profile-alex.prompt.txt`.

Die Inter-Schrift stammt aus dem offiziellen [Inter-Projekt](https://github.com/rsms/inter), die Lizenz liegt unter `assets/fonts/OFL.txt`.
