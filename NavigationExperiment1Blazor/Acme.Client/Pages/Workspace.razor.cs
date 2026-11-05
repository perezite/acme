using System.Net.Http.Json;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.JSInterop;
using Acme.Shared;

namespace Acme.Client.Pages;

public partial class Workspace
{
    [Parameter] public string? Path { get; set; }
    private static readonly string[][] RelationPairs =
    [
        ["projekte", "kunden"], ["angebote", "kunden"], ["vertraege", "kunden"],
        ["aktivitaeten", "kunden"], ["rechnungen", "kunden"], ["aufgaben", "projekte"],
        ["zeiterfassung", "projekte"],
        ["kunden", "ressourcen"], ["projekte", "ressourcen"], ["angebote", "ressourcen"],
        ["vertraege", "ressourcen"], ["aktivitaeten", "ressourcen"], ["aufgaben", "ressourcen"],
        ["zeiterfassung", "ressourcen"], ["rechnungen", "ressourcen"], ["kosten", "ressourcen"],
        ["budgets", "ressourcen"], ["berichte", "ressourcen"]
    ];

    private static readonly string[] People = ["Mia Lehmann", "Noah Keller", "Lea Baumann", "Jonas Frei"];
    private static readonly Dictionary<string, string> SingularLabels = new(StringComparer.OrdinalIgnoreCase)
    {
        ["angebote"] = "Angebot", ["vertraege"] = "Vertrag", ["aktivitaeten"] = "Aktivität",
        ["aufgaben"] = "Aufgabe", ["ressourcen"] = "Ressource", ["zeiterfassung"] = "Zeiteintrag",
        ["rechnungen"] = "Rechnung", ["kosten"] = "Kosten", ["budgets"] = "Budget", ["berichte"] = "Bericht"
    };

    private static readonly IReadOnlyList<WorkspaceGroup> Groups =
    [
        new("Daten", "Kompakte Rohdatenansichten", true, ["kunden", "projekte"]),
        new("Vertrieb", "Kundenbeziehungen und Verkaufsprozesse", false, ["kunden", "angebote", "vertraege", "aktivitaeten"]),
        new("Projekte", "Aufgaben, Teams und Zeiterfassung", false, ["projekte", "aufgaben", "ressourcen", "zeiterfassung"]),
        new("Finanzen", "Rechnungen, Kosten und Auswertungen", false, ["rechnungen", "kosten", "budgets", "berichte"])
    ];

    private static readonly IReadOnlyList<TourStep> OnboardingSteps =
    [
        new("Arbeitsbereiche", "Die Kacheln sind nach Bereichen geordnet. Graue Kacheln öffnen die kompakten Rohdatenansichten.", "/"),
        new("Master und verknüpfte Daten", "Öffne Kunden oder Projekte. Wähle in der Master-Tabelle einen Datensatz und bearbeite die verknüpften Datensätze darunter.", "/daten/kunden"),
        new("Rohdaten direkt bearbeiten", "In den Tabellen kannst du Datensätze hinzufügen, bearbeiten und löschen. Auf dem Smartphone erscheinen Felder in kompakten Karten.", "/daten/projekte"),
        new("Suche und Erscheinungsbild", "Die globale Suche springt direkt zu Bereichen. Im Profilmenü kannst du den Dark Mode einstellen.", "/")
    ];

    private PrototypeStateDto State { get; set; } = new();
    private bool IsLoading { get; set; } = true;
    private bool DatabaseAvailable { get; set; } = true;
    private string? CurrentModuleId { get; set; }
    private string? CurrentDataObject { get; set; }
    private string? SelectedEntityId { get; set; }
    private string? ActiveRelationObject { get; set; }
    private string? ConfirmDeleteId { get; set; }
    private string? OpenPopover { get; set; }
    private string? ModalKind { get; set; }
    private string ToastMessage { get; set; } = "";
    private string GlobalSearch { get; set; } = "";
    private string ModuleSearch { get; set; } = "";
    private string DataSearch { get; set; } = "";
    private string? EditingMasterId { get; set; }
    private string? EditingRelationId { get; set; }
    private bool IsNewMaster { get; set; }
    private bool IsNewRelation { get; set; }
    private bool MobilePickerReturn { get; set; }
    private bool IsDarkMode { get; set; }
    private bool OnlyOpen { get; set; }
    private bool OnboardingActive { get; set; }
    private bool DemoSaveNoticeShown { get; set; }
    private int OnboardingIndex { get; set; }
    private string? CreateNote { get; set; }
    private string PreferenceName { get; set; } = "Mia Lehmann";
    private string PreferenceEmail { get; set; } = "mia@acme.studio";
    private string PreferenceNotifications { get; set; } = "Wichtige Updates";
    private string? PreferenceTitle { get; set; }
    private PrototypeRecordDto? DetailRecord { get; set; }
    private List<string> MasterDraft { get; set; } = [];
    private List<string> RelationDraft { get; set; } = [];
    private List<string> CreateFields { get; set; } = ["", "", "Mia Lehmann", "Offen", "Gerade eben", "—"];
    private Dictionary<string, List<string>> MobileDrafts { get; } = new(StringComparer.OrdinalIgnoreCase);
    private Dictionary<string, PrototypeRecordDto> MobileNewRecords { get; } = new(StringComparer.OrdinalIgnoreCase);
    private Dictionary<string, (string ObjectId, string EntityId)> MobileNewParents { get; } = new(StringComparer.OrdinalIgnoreCase);
    private DotNetObjectReference<Workspace>? _selfReference;
    private CancellationTokenSource? _toastTimer;
    private bool _isDisposed;

    private bool IsDataMode => CurrentDataObject is not null;
    private string TourTargetSelector => OnboardingIndex switch
    {
        0 => ".nav-tile-data",
        1 => ".desktop-master-table .sheet-select-button, .mobile-picker-result",
        2 => ".relation-tabs .relation-tab, .mobile-relation-tabs .relation-tab",
        _ => "#global-search"
    };
    private ModuleInfo? CurrentModule => CurrentModuleId is null ? null : ModuleCatalog.All.FirstOrDefault(item => item.Id == CurrentModuleId);
    private DataTableConfig CurrentDataConfig => GetDataConfig(CurrentDataObject ?? "kunden");
    private DataTableConfig CurrentRelationConfig => GetDataConfig(ActiveRelationObject ?? CurrentRelationObjectIds.FirstOrDefault() ?? "ressourcen");
    private PrototypeRecordDto? SelectedMaster => CurrentDataObject is null || SelectedEntityId is null ? null
        : FindRecord(CurrentDataObject, SelectedEntityId) ?? MobileNewRecords.GetValueOrDefault(MobileKey(CurrentDataObject, SelectedEntityId));
    private bool IsScopedData => DataPath.LastOrDefault()?.EntityId is not null;
    private string ModalTitle => ModalKind switch
    {
        "create" => CurrentModule?.Action ?? "Eintrag hinzufügen",
        "detail" => Field(DetailRecord, 0),
        "account" => "Mein Profil",
        "preferences" => PreferenceTitle ?? "Persönliche Einstellungen",
        "demo-save-info" => "Änderungen nur in dieser Sitzung",
        _ => "Tastenkürzel"
    };
    private string ModalSubtitle => ModalKind switch
    {
        "create" => "Fülle die wichtigsten Angaben aus, um fortzufahren.",
        "detail" => Field(DetailRecord, 1),
        "account" or "preferences" => "Verwalte deine Angaben für Acme Studio.",
        "demo-save-info" => "Die App läuft gerade ohne Datenbank.",
        _ => "Mit ein paar Tasten schneller durch Acme."
    };
    private IReadOnlyList<string> CreateStatuses => CurrentModule?.Id switch
    {
        "kunden" => ["Aktiv", "In Prüfung", "Offen", "Inaktiv"],
        "projekte" => ["Planung", "In Arbeit", "Abgeschlossen", "Pausiert"],
        _ => ["Offen", "In Arbeit", "In Prüfung", "Geplant"]
    };
    private List<ModuleInfo> GlobalSearchResults => ModuleCatalog.All
        .Where(item => $"{item.Title} {item.Group} {item.Description} {item.Subtitle}".Contains(GlobalSearch.Trim(), StringComparison.CurrentCultureIgnoreCase))
        .Take(6).ToList();
    private List<DataPathEntry> DataPath { get; } = [];
    private IReadOnlyList<string> CurrentRelationObjectIds => CurrentDataObject is null ? [] : GetRelationObjectIds(CurrentDataObject);
    private List<RecordEntry> ScopedMasterRows => CurrentDataObject is null ? [] : GetRecords(CurrentDataObject)
        .Select((record, index) => new RecordEntry(record, index))
        .Where(row => DataPath.LastOrDefault()?.EntityId is null || row.Record.Id.Equals(DataPath.Last().EntityId, StringComparison.OrdinalIgnoreCase)).ToList();
    private List<RecordEntry> FilteredMasterRows => ScopedMasterRows
        .Where(row => string.IsNullOrWhiteSpace(DataSearch) || string.Join(' ', row.Record.Fields).Contains(DataSearch.Trim(), StringComparison.CurrentCultureIgnoreCase)).ToList();
    private List<PrototypeRecordDto> FilteredModuleRows => CurrentModule is null ? [] : GetRecords(CurrentModule.Id)
        .Where(record => (string.IsNullOrWhiteSpace(ModuleSearch) || string.Join(' ', record.Fields).Contains(ModuleSearch.Trim(), StringComparison.CurrentCultureIgnoreCase))
            && (!OnlyOpen || !IsClosedStatus(Field(record, 3)))).ToList();
    private List<RelatedEntry> RelatedRecords => ActiveRelationObject is null || SelectedEntityId is null ? [] : GetRelatedRecords(ActiveRelationObject);

    protected override async Task OnInitializedAsync()
    {
        Navigation.LocationChanged += OnLocationChanged;
        try
        {
            State = await Http.GetFromJsonAsync<PrototypeStateDto>("/api/prototype/state") ?? new PrototypeStateDto();
            EnsureStateShape(State);
            DatabaseAvailable = true;
        }
        catch
        {
            DatabaseAvailable = false;
            State = CreateCatalogState();
            ShowToast("Datenbank nicht erreichbar. Änderungen werden nicht gespeichert.");
        }
        IsLoading = false;
        RestoreRoute(Path);
    }

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (!firstRender) return;
        try
        {
            IsDarkMode = await JS.InvokeAsync<bool>("acmeBrowser.loadTheme");
            _selfReference = DotNetObjectReference.Create(this);
            await JS.InvokeVoidAsync("acmeBrowser.attach", _selfReference);
            if (!await JS.InvokeAsync<bool>("acmeBrowser.onboardingDismissed"))
            {
                NavigateHome();
                OnboardingActive = true;
                OnboardingIndex = 0;
                await InvokeAsync(StateHasChanged);
                await Task.Delay(80);
                await JS.InvokeVoidAsync("acmeBrowser.focusTourTarget", TourTargetSelector);
            }
        }
        catch (InvalidOperationException) { }
    }

    private void OnLocationChanged(object? sender, Microsoft.AspNetCore.Components.Routing.LocationChangedEventArgs args)
        => _ = InvokeAsync(() =>
        {
            RestoreRoute(new Uri(args.Location).AbsolutePath.Trim('/'));
            StateHasChanged();
        });

    private void RestoreRoute(string? route)
    {
        route = (route ?? "").Trim('/');
        if (route.Length == 0)
        {
            var hash = new Uri(Navigation.Uri).Fragment.TrimStart('#');
            route = hash;
        }
        if (route.StartsWith("daten-", StringComparison.OrdinalIgnoreCase))
            route = "daten/" + route["daten-".Length..];

        if (route.StartsWith("daten/", StringComparison.OrdinalIgnoreCase))
        {
            var objectId = route["daten/".Length..].Split('/', StringSplitOptions.RemoveEmptyEntries).FirstOrDefault();
            if (objectId is not null && ModuleCatalog.All.Any(item => item.Id.Equals(objectId, StringComparison.OrdinalIgnoreCase)))
            {
                if (CurrentDataObject != objectId)
                {
                    var priorIndex = DataPath.FindLastIndex(entry => entry.ObjectId == objectId);
                    if (priorIndex >= 0)
                    {
                        DataPath.RemoveRange(priorIndex + 1, DataPath.Count - priorIndex - 1);
                        SelectedEntityId = DataPath[priorIndex].EntityId ?? FirstRecordId(objectId);
                    }
                    else
                    {
                        DataPath.Clear();
                        DataPath.Add(new(objectId, null, GetDataConfig(objectId).Title));
                        SelectedEntityId = FirstRecordId(objectId);
                    }
                    CurrentDataObject = objectId;
                    MobilePickerReturn = DataPath.Count == 1 && DataPath[0].EntityId is null;
                }
                CurrentModuleId = null;
                EnsureActiveRelation();
                return;
            }
        }

        if (route.StartsWith("daten-", StringComparison.OrdinalIgnoreCase))
        {
            var objectId = route["daten-".Length..];
            if (ModuleCatalog.All.Any(item => item.Id == objectId))
            {
                CurrentDataObject = objectId;
                CurrentModuleId = null;
                if (DataPath.Count == 0) DataPath.Add(new(objectId, null, GetDataConfig(objectId).Title));
                SelectedEntityId ??= FirstRecordId(objectId);
                MobilePickerReturn = DataPath.Count == 1 && DataPath[0].EntityId is null;
                EnsureActiveRelation();
                return;
            }
        }

        var moduleId = route.StartsWith("daten/", StringComparison.OrdinalIgnoreCase) ? null : route;
        if (moduleId is not null && ModuleCatalog.All.Any(item => item.Id.Equals(moduleId, StringComparison.OrdinalIgnoreCase)))
        {
            CurrentModuleId = moduleId;
            CurrentDataObject = null;
        }
        else
        {
            CurrentModuleId = null;
            CurrentDataObject = null;
        }
    }

    private void NavigateHome()
    {
        CurrentDataObject = null;
        CurrentModuleId = null;
        DataPath.Clear();
        MobilePickerReturn = false;
        GlobalSearch = "";
        OpenPopover = null;
        Navigation.NavigateTo("/");
    }

    private void NavigateToModule(string id)
    {
        if (!ModuleCatalog.All.Any(item => item.Id == id)) { NavigateHome(); return; }
        CurrentModuleId = id;
        CurrentDataObject = null;
        DataPath.Clear();
        ModuleSearch = "";
        OnlyOpen = false;
        GlobalSearch = "";
        OpenPopover = null;
        Navigation.NavigateTo($"/{id}");
    }

    private void NavigateFromGroup(WorkspaceGroup group, ModuleInfo item)
    {
        if (group.IsData) NavigateToDataObject(item.Id);
        else NavigateToModule(item.Id);
    }

    private void NavigateToDataObject(string id)
    {
        if (!ModuleCatalog.All.Any(item => item.Id == id)) return;
        CurrentDataObject = id;
        CurrentModuleId = null;
        DataPath.Clear();
        DataPath.Add(new(id, null, GetDataConfig(id).Title));
        SelectedEntityId = FirstRecordId(id);
        ActiveRelationObject = null;
        MobilePickerReturn = !OnboardingActive || OnboardingIndex < 2;
        DataSearch = "";
        ConfirmDeleteId = null;
        CancelEditors();
        GlobalSearch = "";
        OpenPopover = null;
        EnsureActiveRelation();
        Navigation.NavigateTo($"/daten/{id}");
    }

    private void NavigateDataCrumb(int index)
    {
        if (index < 0 || index >= DataPath.Count) return;
        var item = DataPath[index];
        DataPath.RemoveRange(index + 1, DataPath.Count - index - 1);
        CurrentDataObject = item.ObjectId;
        SelectedEntityId = item.EntityId ?? FirstRecordId(item.ObjectId);
        MobilePickerReturn = item.EntityId is null && DataPath.Count == 1;
        ActiveRelationObject = null;
        EnsureActiveRelation();
        Navigation.NavigateTo($"/daten/{item.ObjectId}");
    }

    private void ShowAllData()
    {
        if (CurrentDataObject is null || DataPath.Count == 0) return;
        var current = DataPath[^1];
        DataPath[^1] = current with { EntityId = null, Label = GetDataConfig(current.ObjectId).Title };
        SelectedEntityId = FirstRecordId(CurrentDataObject);
        EnsureActiveRelation();
        Navigation.NavigateTo($"/daten/{CurrentDataObject}");
    }

    private void SelectMaster(string id)
    {
        if (IsEditingMaster || IsEditingRelation) { ShowToast("Speichere oder brich zuerst die aktuelle Tabellenbearbeitung ab."); return; }
        SelectedEntityId = id;
        MobilePickerReturn = false;
        ActiveRelationObject = null;
        EnsureActiveRelation();
    }

    private void SelectMobileMaster(string id)
    {
        SelectedEntityId = id;
        MobilePickerReturn = false;
        ActiveRelationObject = null;
        EnsureActiveRelation();
    }

    private void BackToMobileMasterList()
    {
        if (MobileDrafts.Count > 0) { ShowToast("Speichere zuerst die Änderungen."); return; }
        MobilePickerReturn = true;
        DataSearch = "";
    }

    private void SelectRelationTab(string objectId)
    {
        if (IsEditingMaster || IsEditingRelation) { ShowToast("Speichere oder brich zuerst die aktuelle Tabellenbearbeitung ab."); return; }
        ActiveRelationObject = objectId;
        EditingRelationId = null;
    }

    private void OpenRelatedAsMaster(string objectId, string entityId)
    {
        if (CurrentDataObject is null || IsEditingMaster || IsEditingRelation) { if (IsEditingMaster || IsEditingRelation) ShowToast("Speichere oder brich zuerst die aktuelle Tabellenbearbeitung ab."); return; }
        var target = FindRecord(objectId, entityId);
        if (target is null) return;
        if (SelectedEntityId is not null)
        {
            var master = FindRecord(CurrentDataObject, SelectedEntityId);
            if (master is not null && (DataPath.Count == 0 || DataPath[^1].EntityId != master.Id))
                DataPath.Add(new(CurrentDataObject, master.Id, Field(master, 0)));
        }
        DataPath.Add(new(objectId, entityId, Field(target, 0)));
        CurrentDataObject = objectId;
        SelectedEntityId = entityId;
        ActiveRelationObject = null;
        MobilePickerReturn = false;
        EnsureActiveRelation();
        Navigation.NavigateTo($"/daten/{objectId}");
    }

    private async Task OnOpenMobileMaster((string ObjectId, string EntityId) target)
    {
        if (MobileDrafts.ContainsKey(MobileKey(target.ObjectId, target.EntityId)))
            await SaveMobileDrafts();
        OpenRelatedAsMaster(target.ObjectId, target.EntityId);
    }
    private void OnOpenMobileReference(EntityReference reference) => OpenRelatedAsMaster(reference.ObjectId, reference.EntityId);

    private void EnsureActiveRelation()
    {
        var objectIds = CurrentRelationObjectIds;
        if (objectIds.Count == 0) { ActiveRelationObject = null; return; }
        if (ActiveRelationObject is null || !objectIds.Contains(ActiveRelationObject))
            ActiveRelationObject = objectIds.FirstOrDefault(id => GetRelatedRecords(id).Count > 0) ?? objectIds[0];
    }

    private List<RelatedEntry> GetRelatedRecords(string objectId)
    {
        if (CurrentDataObject is null || SelectedEntityId is null) return [];
        var ids = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        foreach (var relation in State.Relations)
        {
            if (relation.From.Object == CurrentDataObject && relation.From.Id == SelectedEntityId && relation.To.Object == objectId) ids.Add(relation.To.Id);
            else if (relation.To.Object == CurrentDataObject && relation.To.Id == SelectedEntityId && relation.From.Object == objectId) ids.Add(relation.From.Id);
        }
        var entries = GetRecords(objectId).Select((record, index) => new RelatedEntry(record, index))
            .Where(entry => ids.Contains(entry.Record.Id)).ToList();
        foreach (var pair in MobileNewParents)
        {
            if (pair.Value.ObjectId == CurrentDataObject && pair.Value.EntityId == SelectedEntityId
                && pair.Key.StartsWith(objectId + "::", StringComparison.OrdinalIgnoreCase)
                && MobileNewRecords.TryGetValue(pair.Key, out var newRecord))
                entries.Add(new(newRecord, -1));
        }
        return entries;
    }

    private IReadOnlyList<string> GetRelationObjectIds(string objectId)
        => RelationPairs.Where(pair => pair[0] == objectId || pair[1] == objectId)
            .Select(pair => pair[0] == objectId ? pair[1] : pair[0]).Distinct(StringComparer.OrdinalIgnoreCase).ToList();

    private DataTableConfig GetDataConfig(string id)
    {
        if (id == "kunden")
            return new("Kunden", "Kunde", ["Aktiv", "In Prüfung", "Offen", "Inaktiv"],
            [new("Kundenname", 0), new("Branche", 1), new("Verantwortlich", 2), new("Status", 3, "select"), new("Aktualisiert", 4, Editable: false), new("Umsatz", 5)]);
        if (id == "projekte")
            return new("Projekte", "Projekt", ["Planung", "In Arbeit", "Abgeschlossen", "Pausiert"],
            [new("Projektname", 0), new("Kunde / Kennung", 1), new("Verantwortlich", 2), new("Status", 3, "select"), new("Aktualisiert", 4, Editable: false), new("Fortschritt", 5)]);
        var module = ModuleCatalog.All.FirstOrDefault(item => item.Id == id);
        if (module is null) return new("Datensätze", "Datensatz", [], []);
        var singular = SingularLabels.GetValueOrDefault(id, module.Title);
        var statuses = GetRecords(id).Select(row => Field(row, 3)).Where(value => !string.IsNullOrWhiteSpace(value)).Distinct().ToArray();
        return new(module.Title, singular, statuses,
        [new(singular, 0), new("Bezug / Details", 1), new("Verantwortlich", 2), new("Status", 3, "select"), new("Aktualisiert", 4), new("Wert / Kennzahl", 5)]);
    }

    private bool TryGetDirectReference(string objectId, PrototypeRecordDto record, int columnIndex, out EntityReference reference)
    {
        var targetObject = GetReferenceTarget(objectId, columnIndex);
        if (targetObject is null) { reference = null!; return false; }
        foreach (var relation in State.Relations)
        {
            if (relation.From.Object == objectId && relation.From.Id == record.Id && relation.To.Object == targetObject)
            { reference = new(targetObject, relation.To.Id); return FindRecord(targetObject, relation.To.Id) is not null; }
            if (relation.To.Object == objectId && relation.To.Id == record.Id && relation.From.Object == targetObject)
            { reference = new(targetObject, relation.From.Id); return FindRecord(targetObject, relation.From.Id) is not null; }
        }
        var target = GetRecords(targetObject).FirstOrDefault(item => Field(item, 0).Equals(Field(record, columnIndex), StringComparison.OrdinalIgnoreCase)
            || Field(record, columnIndex).StartsWith(Field(item, 0) + " ·", StringComparison.OrdinalIgnoreCase)
            || Field(record, columnIndex).Contains(Field(item, 0), StringComparison.OrdinalIgnoreCase));
        if (target is not null) { reference = new(targetObject, target.Id); return true; }
        reference = null!;
        return false;
    }

    private static string MasterRowClass(bool editing, bool selected)
        => (editing ? "sheet-editing" : "") + (selected ? " sheet-selected" : "");

    private static string? GetReferenceTarget(string objectId, int column)
    {
        if (column == 2 && objectId != "ressourcen") return "ressourcen";
        return (objectId, column) switch
        {
            ("projekte", 1) or ("angebote", 1) or ("vertraege", 1) or ("aktivitaeten", 1) or ("rechnungen", 1) => "kunden",
            ("aufgaben", 1) or ("zeiterfassung", 0) => "projekte",
            _ => null
        };
    }

    private void AddMasterRow()
    {
        if (CurrentDataObject is null) return;
        if (IsScopedData) { ShowToast("In einer verknüpften Ansicht kannst du vorhandene Datensätze bearbeiten."); return; }
        if (IsEditingMaster || IsEditingRelation) { ShowToast("Speichere oder brich zuerst die aktuelle Tabellenbearbeitung ab."); return; }
        IsEditingMaster = true;
        IsNewMaster = true;
        EditingMasterId = null;
        MasterDraft = DefaultFields(CurrentDataObject);
        ConfirmDeleteId = null;
        DataSearch = "";
    }

    private void EditMaster(PrototypeRecordDto record)
    {
        if (IsEditingMaster || IsEditingRelation) { ShowToast("Speichere oder brich zuerst die aktuelle Tabellenbearbeitung ab."); return; }
        IsEditingMaster = true;
        IsNewMaster = false;
        EditingMasterId = record.Id;
        MasterDraft = NormalizeFields(record.Fields);
        ConfirmDeleteId = null;
    }

    private void CancelMasterEdit() { IsEditingMaster = false; IsNewMaster = false; EditingMasterId = null; MasterDraft = []; }
    private void CancelEditors() { CancelMasterEdit(); CancelRelationEdit(); }

    private void SetMasterDraft(int index, ChangeEventArgs args) => SetField(MasterDraft, index, args.Value?.ToString());
    private void SetRelationDraft(int index, ChangeEventArgs args) => SetField(RelationDraft, index, args.Value?.ToString());

    private RenderFragment MasterEditor(DataColumnConfig column) => builder =>
    {
        var seq = 0;
        if (column.Type == "select")
        {
            builder.OpenElement(seq++, "select");
            builder.AddAttribute(seq++, "class", "sheet-cell-editor");
            builder.AddAttribute(seq++, "aria-label", column.Label);
            builder.AddAttribute(seq++, "value", MasterDraft.ElementAtOrDefault(column.Index) ?? "");
            builder.AddAttribute(seq++, "onchange", EventCallback.Factory.Create<ChangeEventArgs>(this, args => SetMasterDraft(column.Index, args)));
            foreach (var status in CurrentDataConfig.Statuses.Append(MasterDraft.ElementAtOrDefault(column.Index) ?? "").Where(s => !string.IsNullOrWhiteSpace(s)).Distinct())
            { builder.OpenElement(seq++, "option"); builder.AddAttribute(seq++, "value", status); builder.AddContent(seq++, status); builder.CloseElement(); }
            builder.CloseElement();
        }
        else
        {
            builder.OpenElement(seq++, "input");
            builder.AddAttribute(seq++, "class", "sheet-cell-editor");
            builder.AddAttribute(seq++, "aria-label", column.Label);
            builder.AddAttribute(seq++, "value", MasterDraft.ElementAtOrDefault(column.Index) ?? "");
            builder.AddAttribute(seq++, "onchange", EventCallback.Factory.Create<ChangeEventArgs>(this, args => SetMasterDraft(column.Index, args)));
            if (column.Index == 0) builder.AddAttribute(seq++, "required", true);
            builder.CloseElement();
        }
    };

    private RenderFragment RelationEditor(DataColumnConfig column) => builder =>
    {
        var seq = 0;
        if (column.Type == "select")
        {
            builder.OpenElement(seq++, "select"); builder.AddAttribute(seq++, "class", "sheet-cell-editor");
            builder.AddAttribute(seq++, "aria-label", column.Label); builder.AddAttribute(seq++, "value", RelationDraft.ElementAtOrDefault(column.Index) ?? "");
            builder.AddAttribute(seq++, "onchange", EventCallback.Factory.Create<ChangeEventArgs>(this, args => SetRelationDraft(column.Index, args)));
            foreach (var status in CurrentRelationConfig.Statuses.Append(RelationDraft.ElementAtOrDefault(column.Index) ?? "").Where(s => !string.IsNullOrWhiteSpace(s)).Distinct())
            { builder.OpenElement(seq++, "option"); builder.AddAttribute(seq++, "value", status); builder.AddContent(seq++, status); builder.CloseElement(); }
            builder.CloseElement();
        }
        else
        {
            builder.OpenElement(seq++, "input"); builder.AddAttribute(seq++, "class", "sheet-cell-editor");
            builder.AddAttribute(seq++, "aria-label", column.Label); builder.AddAttribute(seq++, "value", RelationDraft.ElementAtOrDefault(column.Index) ?? "");
            builder.AddAttribute(seq++, "onchange", EventCallback.Factory.Create<ChangeEventArgs>(this, args => SetRelationDraft(column.Index, args)));
            if (column.Index == 0) builder.AddAttribute(seq++, "required", true);
            builder.CloseElement();
        }
    };

    private RenderFragment MasterEditorRow(PrototypeRecordDto? unused, int index) => builder =>
    {
        var seq = 0;
        builder.OpenElement(seq++, "tr");
        builder.AddAttribute(seq++, "class", "sheet-editing");
        builder.OpenElement(seq++, "td"); builder.AddAttribute(seq++, "class", "sheet-index"); builder.CloseElement();
        foreach (var column in CurrentDataConfig.Columns)
        {
            builder.OpenElement(seq++, "td");
            if (column.Editable) builder.AddContent(seq++, MasterEditor(column));
            else builder.AddContent(seq++, MasterDraft.ElementAtOrDefault(column.Index) ?? "");
            builder.CloseElement();
        }
        builder.OpenElement(seq++, "td"); builder.AddAttribute(seq++, "class", "sheet-row-actions");
        builder.OpenElement(seq++, "button"); builder.AddAttribute(seq++, "class", "sheet-action sheet-action-save");
        builder.AddAttribute(seq++, "onclick", EventCallback.Factory.Create(this, SaveMasterEdit)); builder.AddContent(seq++, "Speichern"); builder.CloseElement();
        builder.OpenElement(seq++, "button"); builder.AddAttribute(seq++, "class", "sheet-action");
        builder.AddAttribute(seq++, "onclick", EventCallback.Factory.Create(this, CancelMasterEdit)); builder.AddContent(seq++, "Abbrechen"); builder.CloseElement();
        builder.CloseElement(); builder.CloseElement();
    };

    private RenderFragment RelationEditorRow(PrototypeRecordDto? unused) => builder =>
    {
        var seq = 0;
        builder.OpenElement(seq++, "tr"); builder.AddAttribute(seq++, "class", "sheet-editing");
        foreach (var column in CurrentRelationConfig.Columns)
        {
            builder.OpenElement(seq++, "td");
            if (column.Editable) builder.AddContent(seq++, RelationEditor(column));
            else builder.AddContent(seq++, RelationDraft.ElementAtOrDefault(column.Index) ?? "");
            builder.CloseElement();
        }
        builder.OpenElement(seq++, "td"); builder.AddAttribute(seq++, "class", "relation-row-actions");
        builder.OpenElement(seq++, "button"); builder.AddAttribute(seq++, "class", "sheet-action sheet-action-save");
        builder.AddAttribute(seq++, "onclick", EventCallback.Factory.Create(this, SaveRelationEdit)); builder.AddContent(seq++, "Speichern"); builder.CloseElement();
        builder.OpenElement(seq++, "button"); builder.AddAttribute(seq++, "class", "sheet-action");
        builder.AddAttribute(seq++, "onclick", EventCallback.Factory.Create(this, CancelRelationEdit)); builder.AddContent(seq++, "Abbrechen"); builder.CloseElement();
        builder.CloseElement(); builder.CloseElement();
    };

    private async Task SaveMasterEdit()
    {
        if (CurrentDataObject is null || string.IsNullOrWhiteSpace(MasterDraft.ElementAtOrDefault(0))) { ShowToast($"{CurrentDataConfig.Singular} braucht einen Namen."); return; }
        PrototypeRecordDto record;
        if (IsNewMaster)
        {
            record = new() { Id = Guid.NewGuid().ToString("D"), Fields = NormalizeFields(MasterDraft) };
            GetRecords(CurrentDataObject).Insert(0, record);
            SelectedEntityId = record.Id;
            if (DataPath.Count > 0) DataPath[^1] = DataPath[^1] with { EntityId = null, Label = CurrentDataConfig.Title };
        }
        else
        {
            var existing = FindRecord(CurrentDataObject, EditingMasterId);
            if (existing is null) return;
            record = existing;
            record.Fields = NormalizeFields(MasterDraft);
            UpdatePathLabel(CurrentDataObject, record.Id, Field(record, 0));
        }
        record.Fields[4] = "Gerade eben";
        SyncDirectRelations(CurrentDataObject, record);
        CancelMasterEdit();
        EnsureActiveRelation();
        await PersistStateAsync($"{CurrentDataConfig.Singular} gespeichert.");
    }

    private void AddRelatedRow()
    {
        if (CurrentDataObject is null || SelectedEntityId is null || ActiveRelationObject is null) return;
        if (IsEditingMaster || IsEditingRelation) { ShowToast("Speichere oder brich zuerst die aktuelle Tabellenbearbeitung ab."); return; }
        IsEditingRelation = true;
        IsNewRelation = true;
        EditingRelationId = null;
        RelationDraft = DefaultFields(ActiveRelationObject);
        FillReferenceField(ActiveRelationObject, RelationDraft, CurrentDataObject, SelectedEntityId);
    }

    private void EditRelation(PrototypeRecordDto record)
    {
        if (IsEditingMaster || IsEditingRelation) { ShowToast("Speichere oder brich zuerst die aktuelle Tabellenbearbeitung ab."); return; }
        IsEditingRelation = true;
        IsNewRelation = false;
        EditingRelationId = record.Id;
        RelationDraft = NormalizeFields(record.Fields);
    }

    private void CancelRelationEdit() { IsEditingRelation = false; IsNewRelation = false; EditingRelationId = null; RelationDraft = []; }

    private async Task SaveRelationEdit()
    {
        if (ActiveRelationObject is null || CurrentDataObject is null || SelectedEntityId is null) return;
        if (string.IsNullOrWhiteSpace(RelationDraft.ElementAtOrDefault(0))) { ShowToast($"{CurrentRelationConfig.Singular} braucht einen Namen."); return; }
        PrototypeRecordDto record;
        if (IsNewRelation)
        {
            record = new() { Id = Guid.NewGuid().ToString("D"), Fields = NormalizeFields(RelationDraft) };
            GetRecords(ActiveRelationObject).Insert(0, record);
            AddRelation(CurrentDataObject, SelectedEntityId, ActiveRelationObject, record.Id);
        }
        else
        {
            var existing = FindRecord(ActiveRelationObject, EditingRelationId);
            if (existing is null) return;
            record = existing;
            record.Fields = NormalizeFields(RelationDraft);
        }
        record.Fields[4] = "Gerade eben";
        SyncDirectRelations(ActiveRelationObject, record);
        CancelRelationEdit();
        await PersistStateAsync($"{CurrentRelationConfig.Singular} gespeichert.");
    }

    private void AskDelete(string id) => ConfirmDeleteId = id;
    private void CancelDelete() => ConfirmDeleteId = null;

    private async Task DeleteEntity(string objectId, string id)
    {
        var deletingCurrentMaster = CurrentDataObject == objectId && SelectedEntityId == id
            && DataPath.Count > 1 && DataPath[^1].EntityId == id;
        GetRecords(objectId).RemoveAll(record => record.Id == id);
        State.Relations.RemoveAll(relation =>
            (relation.From.Object == objectId && relation.From.Id == id) || (relation.To.Object == objectId && relation.To.Id == id));
        foreach (var key in MobileDrafts.Keys.Where(key => key.EndsWith("::" + id, StringComparison.OrdinalIgnoreCase)).ToList()) MobileDrafts.Remove(key);
        MobileNewRecords.Remove(objectId + "::" + id);
        MobileNewParents.Remove(objectId + "::" + id);
        ConfirmDeleteId = null;
        if (deletingCurrentMaster)
        {
            DataPath.RemoveAt(DataPath.Count - 1);
            var parent = DataPath[^1];
            CurrentDataObject = parent.ObjectId;
            SelectedEntityId = parent.EntityId ?? FirstRecordId(parent.ObjectId);
            MobilePickerReturn = false;
            Navigation.NavigateTo($"/daten/{CurrentDataObject}");
        }
        else
        {
            if (SelectedEntityId == id) SelectedEntityId = GetRecords(CurrentDataObject ?? objectId).FirstOrDefault()?.Id;
            if (DataPath.Count > 0 && DataPath[^1].EntityId == id) DataPath.RemoveAt(DataPath.Count - 1);
        }
        EnsureActiveRelation();
        await PersistStateAsync($"{GetDataConfig(objectId).Singular} gelöscht.");
    }

    private void AddMobileMaster()
    {
        if (CurrentDataObject is null) return;
        var record = NewRecord(CurrentDataObject);
        var key = MobileKey(CurrentDataObject, record.Id);
        MobileNewRecords[key] = record;
        MobileDrafts[key] = NormalizeFields(record.Fields);
        SelectedEntityId = record.Id;
        MobilePickerReturn = false;
        EnsureActiveRelation();
    }

    private void OnMobileFieldChanged(MobileFieldChange change)
    {
        var key = MobileKey(change.ObjectId, change.EntityId);
        var record = FindRecord(change.ObjectId, change.EntityId) ?? MobileNewRecords.GetValueOrDefault(key);
        if (record is null) return;
        if (!MobileDrafts.TryGetValue(key, out var fields)) MobileDrafts[key] = fields = NormalizeFields(record.Fields);
        SetField(fields, change.Index, change.Value);
    }

    private List<string> GetMobileFields(string objectId, PrototypeRecordDto record)
    {
        var key = MobileKey(objectId, record.Id);
        return MobileDrafts.GetValueOrDefault(key) ?? NormalizeFields(record.Fields);
    }

    private bool IsMobileNew(PrototypeRecordDto record) => MobileNewRecords.Values.Any(item => item.Id == record.Id);

    private async Task SaveMobileDrafts()
    {
        foreach (var (key, fields) in MobileDrafts.ToList())
        {
            var parts = key.Split("::", 2);
            if (parts.Length != 2) continue;
            var objectId = parts[0];
            var id = parts[1];
            var record = FindRecord(objectId, id);
            if (string.IsNullOrWhiteSpace(fields.ElementAtOrDefault(0)))
            {
                ShowToast($"{GetDataConfig(objectId).Singular} braucht einen Namen.");
                return;
            }
            if (record is null && MobileNewRecords.TryGetValue(key, out var newRecord))
            {
                newRecord.Fields = NormalizeFields(fields);
                GetRecords(objectId).Insert(0, newRecord);
                record = newRecord;
                if (MobileNewParents.TryGetValue(key, out var parent)) AddRelation(parent.ObjectId, parent.EntityId, objectId, record.Id);
            }
            else if (record is not null)
            {
                var previous = NormalizeFields(record.Fields);
                record.Fields = NormalizeFields(fields);
                SyncDirectRelations(objectId, record, previous);
                UpdatePathLabel(objectId, record.Id, Field(record, 0));
            }
            if (record is not null) record.Fields[4] = "Gerade eben";
        }
        MobileDrafts.Clear();
        MobileNewRecords.Clear();
        MobileNewParents.Clear();
        await PersistStateAsync("Änderungen gespeichert.");
    }

    private async Task PersistStateAsync(string successMessage)
    {
        if (!DatabaseAvailable)
        {
            ShowToast($"{successMessage} Die Änderungen gelten nur für diese Sitzung.");
            if (!DemoSaveNoticeShown)
            {
                DemoSaveNoticeShown = true;
                ModalKind = "demo-save-info";
            }
            return;
        }
        try
        {
            var response = await Http.PutAsJsonAsync("/api/prototype/state", State);
            if (response.IsSuccessStatusCode) ShowToast(successMessage);
            else ShowToast($"Speichern fehlgeschlagen (HTTP {(int)response.StatusCode}).");
        }
        catch (Exception ex) { ShowToast($"Speichern fehlgeschlagen: {ex.Message}"); }
    }

    private async Task OpenMobileReference(EntityReference reference) => OpenRelatedAsMaster(reference.ObjectId, reference.EntityId);
    private void CreateMobileRelated(string objectId)
    {
        if (CurrentDataObject is null || SelectedEntityId is null) return;
        var record = NewRecord(objectId);
        FillReferenceField(objectId, record.Fields, CurrentDataObject, SelectedEntityId);
        var key = MobileKey(objectId, record.Id);
        MobileNewRecords[key] = record;
        MobileNewParents[key] = (CurrentDataObject, SelectedEntityId);
        MobileDrafts[key] = NormalizeFields(record.Fields);
    }

    private async Task SaveCreate()
    {
        if (CurrentModule is null || string.IsNullOrWhiteSpace(CreateFields[0])) { ShowToast("Der Eintrag braucht einen Namen."); return; }
        var fields = NormalizeFields(CreateFields);
        fields[4] = "Gerade eben";
        GetRecords(CurrentModule.Id).Insert(0, new() { Id = Guid.NewGuid().ToString("D"), Fields = fields });
        SyncDirectRelations(CurrentModule.Id, GetRecords(CurrentModule.Id)[0]);
        ModalKind = null;
        await PersistStateAsync("Eintrag wurde gespeichert.");
    }

    private void OpenCreateModal()
    {
        if (CurrentModule is null) return;
        CreateFields = ["", "", "Mia Lehmann", CreateStatuses.FirstOrDefault() ?? "Offen", "Gerade eben", "—"];
        CreateNote = "";
        ModalKind = "create";
        OpenPopover = null;
    }

    private void OpenDetail(PrototypeRecordDto record) { DetailRecord = record; ModalKind = "detail"; }
    private void OpenPreferences(string title) { PreferenceTitle = title; ModalKind = title == "Mein Profil" ? "account" : "preferences"; OpenPopover = null; }
    private void ShowShortcuts() => ModalKind = "shortcuts";
    private void CloseModal() => ModalKind = null;
    private void SavePreferences() { ModalKind = null; ShowToast("Deine Einstellungen wurden gespeichert."); }
    private void ToggleOpenFilter() => OnlyOpen = !OnlyOpen;
    private void TogglePopover(string kind) => OpenPopover = OpenPopover == kind ? null : kind;
    private async Task ToggleTheme()
    {
        IsDarkMode = !IsDarkMode;
        await JS.InvokeVoidAsync("acmeBrowser.setTheme", IsDarkMode);
        OpenPopover = null;
    }

    private async Task StartOnboarding()
    {
        OnboardingIndex = 0;
        OnboardingActive = true;
        OpenPopover = null;
        NavigateTo(OnboardingSteps[0].Route);
        await Task.Delay(80);
        await JS.InvokeVoidAsync("acmeBrowser.focusTourTarget", TourTargetSelector);
    }

    private async Task NextOnboarding()
    {
        if (OnboardingIndex + 1 >= OnboardingSteps.Count) { await FinishOnboarding(); return; }
        OnboardingIndex++;
        NavigateTo(OnboardingSteps[OnboardingIndex].Route);
        await Task.Delay(80);
        await JS.InvokeVoidAsync("acmeBrowser.focusTourTarget", TourTargetSelector);
    }

    private void PreviousOnboarding()
    {
        if (OnboardingIndex == 0) return;
        OnboardingIndex--;
        NavigateTo(OnboardingSteps[OnboardingIndex].Route);
        _ = JS.InvokeVoidAsync("acmeBrowser.focusTourTarget", TourTargetSelector);
    }

    private async Task SkipOnboarding() => await FinishOnboarding();
    private async Task FinishOnboarding()
    {
        OnboardingActive = false;
        await JS.InvokeVoidAsync("acmeBrowser.dismissOnboarding");
    }

    private void NavigateTo(string route)
    {
        if (route == "/") NavigateHome();
        else if (route.StartsWith("/daten/", StringComparison.Ordinal)) NavigateToDataObject(route["/daten/".Length..]);
        else NavigateToModule(route.Trim('/'));
    }

    private void OnSearchKeyDown(KeyboardEventArgs args)
    {
        if (args.Key == "Enter" && GlobalSearchResults.Count > 0) NavigateToModule(GlobalSearchResults[0].Id);
        else if (args.Key == "Escape") GlobalSearch = "";
    }

    [JSInvokable]
    public Task HandleBrowserKey(string key)
    {
        if (key == "search")
        {
            _ = JS.InvokeVoidAsync("acmeBrowser.focusSearch");
        }
        else if (key == "escape")
        {
            if (ModalKind is not null) ModalKind = null;
            else if (OpenPopover is not null) OpenPopover = null;
            else if (IsDataMode && MobileDrafts.Count > 0) ShowToast("Speichere zuerst die Änderungen.");
            else NavigateHome();
        }
        return InvokeAsync(StateHasChanged);
    }

    private void ShowToast(string message)
    {
        ToastMessage = message;
        _toastTimer?.Cancel();
        _toastTimer?.Dispose();
        _toastTimer = new CancellationTokenSource();
        var token = _toastTimer.Token;
        _ = Task.Run(async () =>
        {
            try { await Task.Delay(2800, token); }
            catch (OperationCanceledException) { return; }
            if (_isDisposed) return;
            await InvokeAsync(() => { ToastMessage = ""; StateHasChanged(); });
        });
    }

    private void EnsureStateShape(PrototypeStateDto state)
    {
        foreach (var item in ModuleCatalog.All)
        {
            var key = state.Modules.Keys.FirstOrDefault(value => value.Equals(item.Id, StringComparison.OrdinalIgnoreCase));
            if (key is null) state.Modules[item.Id] = item.Seeds.Select(seed => NewSeedRecord(seed)).ToList();
            else
            {
                state.Modules[item.Id] = state.Modules[key].Select(row =>
                {
                    row.Fields = NormalizeFields(row.Fields);
                    if (!Guid.TryParse(row.Id, out _)) row.Id = Guid.NewGuid().ToString("D");
                    return row;
                }).ToList();
            }
        }
        if (state.Relations.Count == 0) BuildSeedRelations(state);
    }

    private PrototypeStateDto CreateCatalogState()
    {
        var state = new PrototypeStateDto();
        foreach (var item in ModuleCatalog.All) state.Modules[item.Id] = item.Seeds.Select(NewSeedRecord).ToList();
        BuildSeedRelations(state);
        return state;
    }

    private void BuildSeedRelations(PrototypeStateDto state)
    {
        foreach (var pair in RelationPairs)
        {
            var sourceId = pair[0];
            var targetId = pair[1];
            foreach (var source in GetRecords(state, sourceId))
            {
                var column = GetReferenceColumn(sourceId, targetId);
                if (column < 0) continue;
                var value = Field(source, column);
                var target = GetRecords(state, targetId).FirstOrDefault(candidate =>
                    value.Equals(Field(candidate, 0), StringComparison.OrdinalIgnoreCase)
                    || value.StartsWith(Field(candidate, 0) + " ·", StringComparison.OrdinalIgnoreCase)
                    || value.Contains(Field(candidate, 0), StringComparison.OrdinalIgnoreCase));
                if (target is not null) AddRelation(state, sourceId, source.Id, targetId, target.Id);
            }
        }
    }

    private static PrototypeRecordDto NewSeedRecord(SeedRecord seed) => new()
    {
        Id = Guid.NewGuid().ToString("D"),
        Fields = [seed.Name, seed.Related, seed.Owner, seed.Status, seed.Updated, seed.Value]
    };

    private static PrototypeRecordDto NewRecord(string objectId) => new()
    {
        Id = Guid.NewGuid().ToString("D"),
        Fields = ["", "", "Mia Lehmann", objectId == "kunden" ? "Aktiv" : objectId == "projekte" ? "Planung" : "Offen", "Gerade eben", "—"]
    };

    private static List<string> DefaultFields(string objectId) => NormalizeFields(NewRecord(objectId).Fields);
    private static List<string> NormalizeFields(IEnumerable<string>? fields)
    {
        var values = fields?.Take(6).Select(value => value ?? "").ToList() ?? [];
        while (values.Count < 6) values.Add("");
        return values;
    }

    private static string Field(PrototypeRecordDto? record, int index)
        => record?.Fields.ElementAtOrDefault(index) ?? "";

    private List<PrototypeRecordDto> GetRecords(string id) => GetRecords(State, id);
    private static List<PrototypeRecordDto> GetRecords(PrototypeStateDto state, string id)
    {
        var key = state.Modules.Keys.FirstOrDefault(value => value.Equals(id, StringComparison.OrdinalIgnoreCase));
        if (key is null) return state.Modules[id] = [];
        return state.Modules[key];
    }

    private PrototypeRecordDto? FindRecord(string objectId, string? id)
        => id is null ? null : GetRecords(objectId).FirstOrDefault(item => item.Id.Equals(id, StringComparison.OrdinalIgnoreCase));

    private string? FirstRecordId(string objectId) => GetRecords(objectId).FirstOrDefault()?.Id;
    private void SetField(List<string> fields, int index, string? value)
    {
        while (fields.Count <= index) fields.Add("");
        fields[index] = value?.Trim() ?? "";
    }

    private void SyncDirectRelations(string objectId, PrototypeRecordDto record, List<string>? oldFields = null)
    {
        for (var column = 0; column < 6; column++)
        {
            var targetObject = GetReferenceTarget(objectId, column);
            if (targetObject is null) continue;
            State.Relations.RemoveAll(relation =>
                (relation.From.Object == objectId && relation.From.Id == record.Id && relation.To.Object == targetObject)
                || (relation.To.Object == objectId && relation.To.Id == record.Id && relation.From.Object == targetObject));
            var value = Field(record, column);
            var target = GetRecords(targetObject).FirstOrDefault(candidate => Field(candidate, 0).Equals(value, StringComparison.OrdinalIgnoreCase)
                || value.StartsWith(Field(candidate, 0) + " ·", StringComparison.OrdinalIgnoreCase)
                || value.Contains(Field(candidate, 0), StringComparison.OrdinalIgnoreCase));
            if (target is not null) AddRelation(objectId, record.Id, targetObject, target.Id);
        }
    }

    private void FillReferenceField(string objectId, List<string> fields, string parentObject, string parentId)
    {
        var column = GetReferenceColumn(objectId, parentObject);
        if (column < 0) return;
        var parent = FindRecord(parentObject, parentId);
        if (parent is not null) SetField(fields, column, Field(parent, 0));
    }

    private static int GetReferenceColumn(string source, string target)
    {
        if (source == "ressourcen") return -1;
        if (target == "ressourcen") return 2;
        return (source, target) switch
        {
            ("projekte", "kunden") or ("angebote", "kunden") or ("vertraege", "kunden") or ("aktivitaeten", "kunden") or ("rechnungen", "kunden") => 1,
            ("aufgaben", "projekte") => 1,
            ("zeiterfassung", "projekte") => 0,
            _ => -1
        };
    }

    private void AddRelation(string fromObject, string fromId, string toObject, string toId)
        => AddRelation(State, fromObject, fromId, toObject, toId);

    private static void AddRelation(PrototypeStateDto state, string fromObject, string fromId, string toObject, string toId)
    {
        if (state.Relations.Any(relation =>
            (relation.From.Object == fromObject && relation.From.Id == fromId && relation.To.Object == toObject && relation.To.Id == toId)
            || (relation.From.Object == toObject && relation.From.Id == toId && relation.To.Object == fromObject && relation.To.Id == fromId))) return;
        state.Relations.Add(new() { From = new() { Object = fromObject, Id = fromId }, To = new() { Object = toObject, Id = toId } });
    }

    private void UpdatePathLabel(string objectId, string entityId, string label)
    {
        for (var index = 0; index < DataPath.Count; index++)
            if (DataPath[index].ObjectId == objectId && DataPath[index].EntityId == entityId) DataPath[index] = DataPath[index] with { Label = label };
    }

    private static bool IsClosedStatus(string value) => System.Text.RegularExpressions.Regex.IsMatch(value, "erledigt|bezahlt|abgeschlossen|freigegeben|aktuell|aktiv$", System.Text.RegularExpressions.RegexOptions.IgnoreCase);
    private static string StatusClass(string value)
    {
        if (System.Text.RegularExpressions.Regex.IsMatch(value, "überfällig|achtung", System.Text.RegularExpressions.RegexOptions.IgnoreCase)) return "overdue";
        if (System.Text.RegularExpressions.Regex.IsMatch(value, "prüfung|versendet|entwurf|unterschrift|geplant|vorbereiten|offen|eingereicht|wird erstellt", System.Text.RegularExpressions.RegexOptions.IgnoreCase)) return "pending";
        if (System.Text.RegularExpressions.Regex.IsMatch(value, "arbeit|planung", System.Text.RegularExpressions.RegexOptions.IgnoreCase)) return "progress";
        return "";
    }

    private static string AvatarTone(string id)
    {
        var index = Math.Abs(id.GetHashCode()) % 4;
        return index switch { 1 => "green", 2 => "violet", 3 => "orange", _ => "" };
    }

    private static string Initials(string value) => string.Concat(value.Split(' ', StringSplitOptions.RemoveEmptyEntries).Take(2).Select(part => char.ToUpperInvariant(part[0])));
    private static string ModulePrimaryLabel(ModuleInfo item) => item.Id switch
    {
        "aufgaben" => "Aufgabe", "aktivitaeten" => "Aktivität", "ressourcen" => "Person", "zeiterfassung" => "Eintrag",
        "berichte" => "Bericht", "budgets" => "Budget", "kosten" => "Ausgabe", "rechnungen" => "Rechnung",
        "projekte" => "Projekt", "vertraege" => "Vertrag", "angebote" => "Angebot", _ => "Kunde"
    };

    public void Dispose()
    {
        _isDisposed = true;
        Navigation.LocationChanged -= OnLocationChanged;
        _toastTimer?.Cancel();
        _toastTimer?.Dispose();
        _selfReference?.Dispose();
    }

    private bool IsEditingMaster { get; set; }
    private bool IsEditingRelation { get; set; }

    private static string MobileKey(string objectId, string entityId) => $"{objectId}::{entityId}";
}

public sealed record WorkspaceGroup(string Title, string Subtitle, bool IsData, string[] ModuleIds)
{
    public IReadOnlyList<ModuleInfo> Modules => ModuleIds.Select(id => ModuleCatalog.All.First(item => item.Id == id)).ToList();
}

public sealed record DataPathEntry(string ObjectId, string? EntityId, string Label);
public sealed record DataColumnConfig(string Label, int Index, string Type = "", bool Editable = true);
public sealed record DataTableConfig(string Title, string Singular, string[] Statuses, DataColumnConfig[] Columns);
public sealed record EntityReference(string ObjectId, string EntityId);
public sealed record RecordEntry(PrototypeRecordDto Record, int Index);
public sealed record RelatedEntry(PrototypeRecordDto Record, int Index);
public sealed record TourStep(string Title, string Copy, string Route);
public sealed record MobileFieldChange(string ObjectId, string EntityId, int Index, string? Value);
