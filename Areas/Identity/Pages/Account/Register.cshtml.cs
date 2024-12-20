using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using html_mansion.Data;
using html_mansion.Models;

namespace html_mansion.Areas.Identity.Pages.Account
{
    public class RegisterModel : PageModel
    {
        private readonly SignInManager<IdentityUser> _signInManager;
        private readonly UserManager<IdentityUser> _userManager;
        private readonly ILogger<RegisterModel> _logger;
        private readonly ApplicationDbContext _dbContext;

        public RegisterModel(
            UserManager<IdentityUser> userManager,
            SignInManager<IdentityUser> signInManager,
            ILogger<RegisterModel> logger,
            ApplicationDbContext dbContext)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _logger = logger;
            _dbContext = dbContext;

            // Initialize non-nullable properties
            Input = new InputModel();
            ExternalLogins = new List<AuthenticationScheme>();
            ReturnUrl = string.Empty;
        }

        [BindProperty] public InputModel? Input { get; set; }

        public IList<AuthenticationScheme> ExternalLogins { get; set; }

        public string? ReturnUrl { get; set; }

        public class InputModel
        {
            [Required] [EmailAddress] public string Email { get; set; }

            [Required]
            [DataType(DataType.Password)]
            public string Password { get; set; }

            [Required]
            [DataType(DataType.Password)]
            [Compare("Password", ErrorMessage = "The password and confirmation password do not match.")]
            public string ConfirmPassword { get; set; }

            [Required]
            [Display(Name = "Nickname")]
            public string Nickname { get; set; }
        }

        public async Task OnGetAsync(string returnUrl = null)
        {
            ReturnUrl = returnUrl ?? Url.Content("~/");
            ExternalLogins = (await _signInManager.GetExternalAuthenticationSchemesAsync()).ToList();
        }

        public async Task<IActionResult> OnPostAsync(string returnUrl = null)
        {
            returnUrl ??= Url.Content("~/");

            if (ModelState.IsValid)
            {
                var user = new IdentityUser { UserName = Input.Email, Email = Input.Email };
                var result = await _userManager.CreateAsync(user, Input.Password);

                if (result.Succeeded)
                {
                    try
                    {
                        // Transactional creation of Player and PlayerProgress
                        var player = new Player
                        {
                            UserId = user.Id,
                            Nickname = null,
                            LastPosX = -600,
                            LastPosY = -3700,
                            Skin = "standard"
                        };

                        _dbContext.Players.Add(player);
                        await _dbContext.SaveChangesAsync();

                        var playerProgress = new PlayerProgress
                        {
                            PlayerId = player.Id,
                            CurrentTaskId = 0,
                            PositionX = -600,
                            PositionY = -3700,
                            CurrentInteractionId = 0
                        };

                        _dbContext.PlayerProgresses.Add(playerProgress);
                        await _dbContext.SaveChangesAsync();

                        await _signInManager.SignInAsync(user, isPersistent: false);
                        return LocalRedirect(returnUrl);
                    }
                    catch (Exception ex)
                    {
                        ModelState.AddModelError(string.Empty,
                            "An error occurred while creating your account. Please try again.");
                    }
                }

                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError(string.Empty, error.Description);
                }
            }

            ExternalLogins = (await _signInManager.GetExternalAuthenticationSchemesAsync()).ToList();
            return Page();
        }
    }
}