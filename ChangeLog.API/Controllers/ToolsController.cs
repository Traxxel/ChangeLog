using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ChangeLog.DAL;

namespace ChangeLog.API.Controllers;

/// <summary>
/// Request-Modell für die Tool-Erstellung
/// </summary>
public class CreateToolRequest
{
    /// <summary>
    /// Kurzer Name des Tools
    /// </summary>
    public string NameKurz { get; set; } = string.Empty;

    /// <summary>
    /// Ausführlicher Name des Tools
    /// </summary>
    public string NameLang { get; set; } = string.Empty;
}

/// <summary>
/// Controller zur Verwaltung von Tools
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class ToolsController : ControllerBase
{
    private readonly ChangeLogContext _context;

    public ToolsController(ChangeLogContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Ruft alle Tools ab
    /// </summary>
    /// <returns>Eine Liste aller Tools</returns>
    /// <response code="200">Gibt die Liste der Tools zurück</response>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<Tool>>> GetTools()
    {
        return await _context.Tools.ToListAsync();
    }

    /// <summary>
    /// Ruft ein spezifisches Tool anhand seiner ID ab
    /// </summary>
    /// <param name="id">Die GUID des Tools</param>
    /// <returns>Das angeforderte Tool</returns>
    /// <response code="200">Gibt das angeforderte Tool zurück</response>
    /// <response code="404">Wenn das Tool nicht gefunden wurde</response>
    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<Tool>> GetTool(Guid id)
    {
        var tool = await _context.Tools
            .Include(t => t.ChangelogEntries)
            .FirstOrDefaultAsync(t => t.Id == id);

        if (tool == null)
        {
            return NotFound();
        }

        return tool;
    }

    /// <summary>
    /// Erstellt ein neues Tool
    /// </summary>
    /// <param name="request">Die Daten des neuen Tools</param>
    /// <returns>Das neu erstellte Tool mit generierter ID</returns>
    /// <response code="201">Gibt das neu erstellte Tool zurück</response>
    /// <response code="400">Wenn die Tooldaten ungültig sind</response>
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<Tool>> PostTool(CreateToolRequest request)
    {
        var tool = new Tool
        {
            Id = Guid.NewGuid(),
            NameKurz = request.NameKurz,
            NameLang = request.NameLang
        };

        _context.Tools.Add(tool);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetTool), new { id = tool.Id }, tool);
    }

    /// <summary>
    /// Aktualisiert ein bestehendes Tool
    /// </summary>
    /// <param name="id">Die GUID des zu aktualisierenden Tools</param>
    /// <param name="tool">Die aktualisierten Tooldaten</param>
    /// <returns>Kein Inhalt bei Erfolg</returns>
    /// <response code="204">Wenn das Tool erfolgreich aktualisiert wurde</response>
    /// <response code="400">Wenn die ID nicht mit dem Tool übereinstimmt</response>
    /// <response code="404">Wenn das Tool nicht gefunden wurde</response>
    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> PutTool(Guid id, Tool tool)
    {
        if (id != tool.Id)
        {
            return BadRequest();
        }

        _context.Entry(tool).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!ToolExists(id))
            {
                return NotFound();
            }
            throw;
        }

        return NoContent();
    }

    /// <summary>
    /// Löscht ein Tool
    /// </summary>
    /// <param name="id">Die GUID des zu löschenden Tools</param>
    /// <returns>Kein Inhalt bei Erfolg</returns>
    /// <response code="204">Wenn das Tool erfolgreich gelöscht wurde</response>
    /// <response code="404">Wenn das Tool nicht gefunden wurde</response>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteTool(Guid id)
    {
        var tool = await _context.Tools.FindAsync(id);
        if (tool == null)
        {
            return NotFound();
        }

        _context.Tools.Remove(tool);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool ToolExists(Guid id)
    {
        return _context.Tools.Any(e => e.Id == id);
    }
} 