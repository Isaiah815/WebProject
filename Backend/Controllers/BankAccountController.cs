using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BankAccountController : ControllerBase
    {
        private readonly APIDBContext _context;

        public BankAccountController(APIDBContext context)
        {
            _context = context;
        }

        // GET: api/BankAccount
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BankAccount>>> GetBankAccounts()
        {
            return await _context.BankAccounts
                                 .Include(b => b.Bank) 
                                 .ToListAsync();
        }

        // GET: api/BankAccount/5
        [HttpGet("{id}")]
        public async Task<ActionResult<BankAccount>> GetBankAccount(int id)
        {
            var account = await _context.BankAccounts
                                        .Include(b => b.Bank)
                                        .FirstOrDefaultAsync(a => a.BankAccountID == id);

            if (account == null) return NotFound();
            return account;
        }

        // POST: api/BankAccount
        [HttpPost]
        public async Task<ActionResult<BankAccount>> PostBankAccount(BankAccount account)
        {
            try
            {
                _context.BankAccounts.Add(account);
                await _context.SaveChangesAsync();

                return Ok(account);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message, details = ex.InnerException?.Message });
            }
        }

            // PUT: api/BankAccount/5
            [HttpPut("{id}")]
        public async Task<IActionResult> PutBankAccount(int id, BankAccount account)
        {
            if (id != account.BankAccountID) return BadRequest();

            _context.Entry(account).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/BankAccount/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBankAccount(int id)
        {
            var account = await _context.BankAccounts.FindAsync(id);
            if (account == null) return NotFound();

            _context.BankAccounts.Remove(account);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }

}
