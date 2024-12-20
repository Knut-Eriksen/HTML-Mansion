using Microsoft.AspNetCore.Mvc;
using html_mansion.Data;
using html_mansion.Models;
using Microsoft.AspNetCore.Authorization;

namespace html_mansion.Controllers
{
    public class FeedbackController : Controller
    {
        private readonly ApplicationDbContext _db;

        public FeedbackController(ApplicationDbContext db)
        {
            _db = db;
        }

        [Authorize]
        public IActionResult LeaveFeedback()
        {
            return View();
        }

        [Authorize]
        [HttpPost]
        public IActionResult PostFeedback(string message)
        {
            var feedback = new Feedback
            {
                Message = message
            };

            _db.Feedbacks.Add(feedback);
            _db.SaveChanges();

            return RedirectToAction("Index", "Home");
        }

        [Authorize(Roles = "Admin")]
        [HttpGet]
        public IActionResult ViewFeedback()
        {
            var feedbacks = _db.Feedbacks.ToList();
            return View(feedbacks);
        }
    }
}