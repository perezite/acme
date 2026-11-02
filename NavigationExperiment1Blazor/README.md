# Acme Navigation – Blazor WebAssembly

Ein Blazor-WebAssembly-Frontend mit ASP.NET-Core-API und SQLite-Datenbank. Die Oberfläche übernimmt den HTML-Prototyp mit kategorisierten Kacheln, Suche, Onboarding, Dark Mode sowie der Rohdatenansicht mit Master-Detail-Navigation für Desktop und Mobile.

Die Oberfläche und Anwendungslogik sind als Blazor-Komponenten und C# implementiert. JavaScript wird nur als schmale Browser-Brücke für lokale Darstellungspräferenzen und globale Tastaturereignisse verwendet. Die Daten werden über die ASP.NET-Core-API und EF Core gespeichert.

## Start in Visual Studio

1. Öffne `NavigationExperiment1Blazor.sln` mit Visual Studio.
2. Installiere das [aktuelle .NET-10-SDK](https://dotnet.microsoft.com/download/dotnet/10.0) und stelle sicher, dass Visual Studio 2026 (18.0+) mit der Workload **ASP.NET und Webentwicklung** installiert ist.
3. Wähle das Solution-Startprofil **Acme** und drücke F5. Das Solution-Startprofil startet `Acme.Server`; der Server stellt gleichzeitig die WebAssembly-Dateien und die API bereit.

Die Anwendung zielt auf **.NET 10 LTS**. Dafür wird das SDK benötigt, auch wenn die .NET-10-Laufzeit bereits installiert ist. Die .NET-Versionen und Visual-Studio-Mindestversionen stehen in der [Microsoft-Installationsübersicht](https://learn.microsoft.com/dotnet/core/install/windows).

## Datenhaltung

Beim Start führt EF Core die Datenbankmigrationen aus. Jeder Objekttyp wird in einer eigenen Tabelle gespeichert (`Customers`, `Projects`, `Offers`, `Contracts`, `Activities`, `Tasks`, `Resources`, `TimeEntries`, `Invoices`, `Expenses`, `Budgets`, `Reports`). Fremdschlüssel verbinden unter anderem Projekte mit Kunden, Aufgaben und Zeiterfassungen mit Projekten sowie die verantwortlichen Ressourcen mit den jeweiligen Datensätzen.

Die bisherige Tabelle `Records` wird beim ersten Start in die typisierten Tabellen übernommen und bleibt als Rückfallkopie erhalten. Neu angelegte, geänderte oder gelöschte Datensätze und ihre Verknüpfungen werden über die API in SQLite gespeichert. Die Datenbankdatei liegt unter `Acme.Server/App_Data/acme.db`.

## Datenbank zurücksetzen

Anwendung stoppen und `Acme.Server/App_Data/acme.db` löschen. Beim nächsten Start wird eine neue Datenbank mit den Beispieldaten erzeugt. Für die vorhandene Datenbank ist das nicht nötig; die Migration ergänzt die Tabellen und übernimmt vorhandene Einträge.
