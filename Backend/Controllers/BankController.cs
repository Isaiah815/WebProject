using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebAPI.Models;
using Microsoft.EntityFrameworkCore;
namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BankController : ControllerBase
    {
        private readonly APIDBContext _context;

        public BankController(APIDBContext context)
        {
            _context = context;
        }

        // GET: api/Bank
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Bank>>> GetBanks()
        {
            return await _context.Banks.ToListAsync();
        }

        // GET: api/Bank/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Bank>> GetBank(int id)
        {
            var bank = await _context.Banks.FindAsync(id);
            if (bank == null) return NotFound();
            return bank;
        }

        // POST: api/Bank
        [HttpPost]
        public async Task<ActionResult<Bank>> PostBank(Bank bank)
        {
            _context.Banks.Add(bank);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetBank), new { id = bank.BankId }, bank);
        }

        // PUT: api/Bank/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBank(int id, Bank bank)
        {
            if (id != bank.BankId) return BadRequest();

            _context.Entry(bank).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Bank/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBank(int id)
        {
            var bank = await _context.Banks.FindAsync(id);
            if (bank == null) return NotFound();

            _context.Banks.Remove(bank);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }

}
