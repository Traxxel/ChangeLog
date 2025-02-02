using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ChangeLog.DAL;

namespace ChangeLog.API.Controllers;

/// <summary>
/// Controller zur Verwaltung von Changelog-Einträgen
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class ChangelogEntriesController : ControllerBase
{
    private readonly ChangeLogContext _context;

    public ChangelogEntriesController(ChangeLogContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Ruft alle Changelog-Einträge ab
    /// </summary>
    /// <returns>Eine Liste aller Changelog-Einträge mit zugehörigen Tools</returns>
    /// <response code="200">Gibt die Liste der Changelog-Einträge zurück</response>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<ChangelogEntry>>> GetChangelogEntries()
    {
        return await _context.ChangelogEntries
            .Include(c => c.Tool)
            .ToListAsync();
    }

    /// <summary>
    /// Ruft einen spezifischen Changelog-Eintrag anhand seiner ID ab
    /// </summary>
    /// <param name="id">Die GUID des Changelog-Eintrags</param>
    /// <returns>Der angeforderte Changelog-Eintrag</returns>
    /// <response code="200">Gibt den angeforderten Changelog-Eintrag zurück</response>
    /// <response code="404">Wenn der Changelog-Eintrag nicht gefunden wurde</response>
    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ChangelogEntry>> GetChangelogEntry(Guid id)
    {
        var changelogEntry = await _context.ChangelogEntries
            .Include(c => c.Tool)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (changelogEntry == null)
        {
            return NotFound();
        }

        return changelogEntry;
    }

    /// <summary>
    /// Ruft alle Changelog-Einträge für ein bestimmtes Tool ab
    /// </summary>
    /// <param name="toolId">Die GUID des Tools</param>
    /// <returns>Eine Liste der Changelog-Einträge für das angegebene Tool</returns>
    /// <response code="200">Gibt die Liste der Changelog-Einträge zurück</response>
    [HttpGet("tool/{toolId}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<ChangelogEntry>>> GetChangelogEntriesByTool(Guid toolId)
    {
        return await _context.ChangelogEntries
            .Include(c => c.Tool)
            .Where(c => c.ToolId == toolId)
            .OrderByDescending(c => c.Datum)
            .ToListAsync();
    }

    /// <summary>
    /// Erstellt einen neuen Changelog-Eintrag
    /// </summary>
    /// <param name="changelogEntry">Die Daten des neuen Changelog-Eintrags</param>
    /// <returns>Der neu erstellte Changelog-Eintrag</returns>
    /// <response code="201">Gibt den neu erstellten Changelog-Eintrag zurück</response>
    /// <response code="400">Wenn die Daten ungültig sind oder das referenzierte Tool nicht existiert</response>
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ChangelogEntry>> PostChangelogEntry(ChangelogEntry changelogEntry)
    {
        if (!await _context.Tools.AnyAsync(t => t.Id == changelogEntry.ToolId))
        {
            return BadRequest("Das angegebene Tool existiert nicht.");
        }

        changelogEntry.Id = Guid.NewGuid();
        if (changelogEntry.Datum == default)
        {
            changelogEntry.Datum = DateTime.UtcNow;
        }

        _context.ChangelogEntries.Add(changelogEntry);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetChangelogEntry), new { id = changelogEntry.Id }, changelogEntry);
    }

    /// <summary>
    /// Aktualisiert einen bestehenden Changelog-Eintrag
    /// </summary>
    /// <param name="id">Die GUID des zu aktualisierenden Changelog-Eintrags</param>
    /// <param name="changelogEntry">Die aktualisierten Daten</param>
    /// <returns>Kein Inhalt bei Erfolg</returns>
    /// <response code="204">Wenn der Changelog-Eintrag erfolgreich aktualisiert wurde</response>
    /// <response code="400">Wenn die ID nicht übereinstimmt oder das referenzierte Tool nicht existiert</response>
    /// <response code="404">Wenn der Changelog-Eintrag nicht gefunden wurde</response>
    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> PutChangelogEntry(Guid id, ChangelogEntry changelogEntry)
    {
        if (id != changelogEntry.Id)
        {
            return BadRequest();
        }

        if (!await _context.Tools.AnyAsync(t => t.Id == changelogEntry.ToolId))
        {
            return BadRequest("Das angegebene Tool existiert nicht.");
        }

        _context.Entry(changelogEntry).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!ChangelogEntryExists(id))
            {
                return NotFound();
            }
            throw;
        }

        return NoContent();
    }

    /// <summary>
    /// Löscht einen Changelog-Eintrag
    /// </summary>
    /// <param name="id">Die GUID des zu löschenden Changelog-Eintrags</param>
    /// <returns>Kein Inhalt bei Erfolg</returns>
    /// <response code="204">Wenn der Changelog-Eintrag erfolgreich gelöscht wurde</response>
    /// <response code="404">Wenn der Changelog-Eintrag nicht gefunden wurde</response>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteChangelogEntry(Guid id)
    {
        var changelogEntry = await _context.ChangelogEntries.FindAsync(id);
        if (changelogEntry == null)
        {
            return NotFound();
        }

        _context.ChangelogEntries.Remove(changelogEntry);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool ChangelogEntryExists(Guid id)
    {
        return _context.ChangelogEntries.Any(e => e.Id == id);
    }
} 