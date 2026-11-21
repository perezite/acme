# NavigationExperiment2 · Klarwerk

Eigenständiger HTML-Prototyp mit einem Screen, möglichst nah an den gelieferten Light- und Dark-Mode-Mockups. Der erste Prototyp und die Blazor-App werden nicht verändert.

## Starten

`index.html` direkt im Browser öffnen. Kein Build, keine Installation und kein Server erforderlich. Schrift und Symbole sind lokal enthalten; die Anwendung funktioniert auch offline.

## Interaktionen

- Die Kacheln sind echte Buttons. Ein Klick setzt die grüne Auswahl und zeigt eine kurze Toast-Bestätigung. Es werden keine weiteren Screens geöffnet.
- Mond/Sonne schaltet zwischen Light und Dark Mode um. Die Auswahl wird, soweit verfügbar, im Browser gespeichert.
- Die Suche gleicht Titel und Untertitel ab. Eine kompakte, bei vielen Treffern scrollbar bleibende Liste erscheint direkt unter dem Suchfeld, einschliesslich einer Rückmeldung bei fehlenden Treffern. Die Höhe berücksichtigt den sichtbaren Bereich, auch bei eingeblendeter Bildschirmtastatur. Andere Kacheln werden weiterhin abgeblendet; ihre Positionen bleiben erhalten.
- Ein Klick auf einen Suchtreffer oder Enter wählt den Arbeitsbereich aus, leert den Suchfilter und bringt die Kachel ins Sichtfeld. Die Pfeiltasten wechseln durch die Treffer; ohne Vorauswahl nimmt Enter den ersten. Escape, Tab aus dem Suchfeld oder ein Klick ausserhalb schliesst die Liste. Ein erneuter Klick ins Suchfeld öffnet sie wieder; Escape bei bereits geschlossener Liste leert den Suchbegriff.
- Glocke und Profil öffnen kleine Popover auf demselben Screen. Escape oder ein Klick ausserhalb schliesst sie.
- Das Logo setzt die Suche und Kachelauswahl zurück. Strg+K bzw. Cmd+K fokussiert die Suche.
- Buttons und Suche sind per Tastatur bedienbar. Reduzierte Bewegung wird berücksichtigt.
- Über «Kacheln anordnen» lässt sich eine Kachel auf einen freien Platz in einer der Gruppen ziehen. Belegte Plätze nehmen keine Kachel an; es gibt keinen Tausch. Der Ausgangsplatz wird nach dem Verschieben frei.

## Layout

Die Referenzfläche ist **1920 × 1080 CSS-Pixel** bei 100 % Browser-Zoom. Je vier Plätze bilden eine feste 2×2-Gruppe; jeder Gruppe fehlt eine Kachel an einer unterschiedlich gesetzten Position. Die acht Gruppen fliessen als Ganzes um: vier Gruppen pro Zeile auf Desktop, zwei unter 1200px und eine unter 680px. So werden Kacheln innerhalb einer Gruppe nie getrennt und die ursprünglichen Leerstellen bleiben sichtbar.

Die Gruppen haben eine sehr dezente, rahmenlose Hintergrundfläche. Ihr Abstand zueinander ist grösser als der Abstand zwischen Kacheln innerhalb einer Gruppe. Die Kacheln sind 136px hoch; bei längeren Texten darf die Gruppe automatisch wachsen. Ab 1200px Fensterbreite wird die Referenzfläche proportional angepasst, maximal bis zur Originalgrösse.

Unter 1200px wechseln die Gruppen in zwei Spalten, unter 680px in eine. Die Kacheln bleiben in jeder Gruppe zweispaltig. Unter 680px wechselt die Suche in eine eigene Kopfzeile.

Schrift, Symbole, Kachelhöhen und Abstände ändern sich fliessend. Am Übergang bei 1200px schliessen sie an die mit 62,5 % skalierte Desktop-Fläche an. Bis 1000px gehen sie in die Tablet-Grössen über; zwischen 1000px und 320px werden sie allmählich kompakter. Die Layout-Grenze bei 680px ändert nur die Anordnung, ohne eine neue Grössenstufe einzuführen. Eine zusätzliche Grössenstufe bei 360px entfällt.

Die gemeinsamen CSS-Variablen `--reflow-step` und `--compact-step` steuern diese Übergänge. Die Schriftgrössen an den drei Bezugspunkten sind:

| Text | 1200px Übergang | 1000px Tablet | 320px Mobile |
| --- | --- | --- | --- |
| Seitentitel | 36,25px | 40px | 29px |
| Kachel: Titel / Untertitel | 22 / 15px | 22 / 15px | 20 / 13,5px |

Die Kacheln behalten ihre 2×2-Anordnung innerhalb jeder Gruppe über alle Bildschirmgrössen hinweg. Nur die Zahl der Gruppen pro Zeile ändert sich.

## Dateien

- `index.html`: Screen, Kopfzeile und SVG-Symbole
- `styles.css`: Design, Farbschemata und responsive Layouts
- `app.js`: Kachelinhalte, Auswahl, Suche, Popover und Theme-Wechsel
- `assets/fonts/`: lokal eingebundene Inter-Schrift und SIL Open Font License
- `assets/profile-alex.png`: lokal eingebundenes, mit Imagegen erzeugtes Porträt für das fiktive Demoprofil Alex; der verwendete Prompt steht in `assets/profile-alex.prompt.txt`.

Die Inter-Schrift stammt aus dem offiziellen [Inter-Projekt](https://github.com/rsms/inter), die Lizenz liegt unter `assets/fonts/OFL.txt`.
