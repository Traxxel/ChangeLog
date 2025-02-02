using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ChangeLog.DAL;

namespace ChangeLog.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ChangelogEntriesController : ControllerBase
{
    private readonly ChangeLogContext _context;

    public ChangelogEntriesController(ChangeLogContext context)
    {
        _context = context;
    }

    // GET: api/ChangelogEntries
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ChangelogEntry>>> GetChangelogEntries()
    {
        return await _context.ChangelogEntries
            .Include(c => c.Tool)
            .ToListAsync();
    }

    // GET: api/ChangelogEntries/5
    [HttpGet("{id}")]
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

    // GET: api/ChangelogEntries/tool/5
    [HttpGet("tool/{toolId}")]
    public async Task<ActionResult<IEnumerable<ChangelogEntry>>> GetChangelogEntriesByTool(Guid toolId)
    {
        return await _context.ChangelogEntries
            .Include(c => c.Tool)
            .Where(c => c.ToolId == toolId)
            .OrderByDescending(c => c.Datum)
            .ToListAsync();
    }

    // POST: api/ChangelogEntries
    [HttpPost]
    public async Task<ActionResult<ChangelogEntry>> PostChangelogEntry(ChangelogEntry changelogEntry)
    {
        // Überprüfe, ob das referenzierte Tool existiert
        if (!await _context.Tools.AnyAsync(t => t.Id == changelogEntry.ToolId))
        {
            return BadRequest("Das angegebene Tool existiert nicht.");
        }

        changelogEntry.Id = Guid.NewGuid(); // Generiere eine neue ID
        if (changelogEntry.Datum == default)
        {
            changelogEntry.Datum = DateTime.UtcNow; // Setze das aktuelle Datum, falls keines angegeben wurde
        }

        _context.ChangelogEntries.Add(changelogEntry);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetChangelogEntry), new { id = changelogEntry.Id }, changelogEntry);
    }

    // PUT: api/ChangelogEntries/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutChangelogEntry(Guid id, ChangelogEntry changelogEntry)
    {
        if (id != changelogEntry.Id)
        {
            return BadRequest();
        }

        // Überprüfe, ob das referenzierte Tool existiert
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

    // DELETE: api/ChangelogEntries/5
    [HttpDelete("{id}")]
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