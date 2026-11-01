namespace Acme.Shared;

public sealed class PrototypeStateDto
{
    public Dictionary<string, List<PrototypeRecordDto>> Modules { get; set; } = new(StringComparer.OrdinalIgnoreCase);
    public List<PrototypeRelationDto> Relations { get; set; } = [];
}

public sealed class PrototypeRecordDto
{
    public string Id { get; set; } = "";
    public List<string> Fields { get; set; } = [];
}

public sealed class PrototypeRelationDto
{
    public PrototypeRelationEndDto From { get; set; } = new();
    public PrototypeRelationEndDto To { get; set; } = new();
}

public sealed class PrototypeRelationEndDto
{
    public string Object { get; set; } = "";
    public string Id { get; set; } = "";
}
