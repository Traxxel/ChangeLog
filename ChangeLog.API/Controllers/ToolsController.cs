using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ChangeLog.DAL;

namespace ChangeLog.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ToolsController : ControllerBase
{
    private readonly ChangeLogContext _context;

    public ToolsController(ChangeLogContext context)
    {
        _context = context;
    }

    // GET: api/Tools
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Tool>>> GetTools()
    {
        return await _context.Tools.ToListAsync();
    }

    // GET: api/Tools/5
    [HttpGet("{id}")]
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

    // POST: api/Tools
    [HttpPost]
    public async Task<ActionResult<Tool>> PostTool(Tool tool)
    {
        tool.Id = Guid.NewGuid(); // Generiere eine neue ID
        _context.Tools.Add(tool);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetTool), new { id = tool.Id }, tool);
    }

    // PUT: api/Tools/5
    [HttpPut("{id}")]
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

    // DELETE: api/Tools/5
    [HttpDelete("{id}")]
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