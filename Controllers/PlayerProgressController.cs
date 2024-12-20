using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using html_mansion.Data;
using html_mansion.Models;
using System.Security.Claims;

namespace html_mansion.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class PlayerProgressController : ControllerBase
    {
        private readonly ILogger<PlayerProgressController> _logger;
        private readonly ApplicationDbContext _db;

        public PlayerProgressController(ApplicationDbContext db, ILogger<PlayerProgressController> logger)
        {
            _db = db;
            _logger = logger;
        }

        [AllowAnonymous]
        [HttpPatch("saveProgress/{id}")]
        public IActionResult SaveProgress(int id, [FromBody] PlayerProgress? updatedProgress)
        {
            var progress = _db.PlayerProgresses.SingleOrDefault(p => p.Id == id);

            progress.CurrentTaskId = updatedProgress.CurrentTaskId;
            progress.PositionX = updatedProgress.PositionX;
            progress.PositionY = updatedProgress.PositionY;
            progress.CurrentInteractionId = updatedProgress.CurrentInteractionId;
            progress.Player = updatedProgress.Player;

            _db.SaveChanges();
            return Ok();
        }


        [HttpGet("loadProgress")]
        public IActionResult LoadProgress()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = _db.Users.SingleOrDefault(u => u.Id == userId);
            var player = _db.Players.SingleOrDefault(p => p.UserId == user.Id);

            var progress = _db.PlayerProgresses.SingleOrDefault(pp => pp.PlayerId == player.Id);

            return Ok(progress);
        }
    }
}