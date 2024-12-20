using html_mansion.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace html_mansion.Data;

public static class ApplicationDbInitializer
{
    public static void Initialize(ApplicationDbContext db, UserManager<IdentityUser> um, RoleManager<IdentityRole> rm)
    {
        if (Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Development")
        {
            db.Database.EnsureDeleted(); // Ensure everything is clean
            db.Database.EnsureCreated(); // Recreate with the current schema
        }

        SeedRolesAndUsers(um, rm);
        SeedPlayersAndProgress(db, um);
    }

    private static void SeedRolesAndUsers(UserManager<IdentityUser> um, RoleManager<IdentityRole> rm)
    {
        const string adminRoleName = "Admin";
        if (!rm.RoleExistsAsync(adminRoleName).Result)
        {
            var adminRole = new IdentityRole(adminRoleName);
            rm.CreateAsync(adminRole).Wait();
        }

        const string adminEmail = "admin@uia.no";
        const string adminPassword = "Password1.";
        if (um.FindByEmailAsync(adminEmail).Result == null)
        {
            var adminUser = new IdentityUser
            {
                UserName = adminEmail,
                Email = adminEmail,
                EmailConfirmed = true
            };

            var result = um.CreateAsync(adminUser, adminPassword).Result;
            if (result.Succeeded)
            {
                um.AddToRoleAsync(adminUser, adminRoleName).Wait();
            }
            else
            {
                throw new Exception(
                    $"Failed to create admin user: {string.Join(", ", result.Errors.Select(e => e.Description))}");
            }
        }

        const string testUserEmail = "user@uia.no";
        const string testUserPassword = "Password1.";
        if (um.FindByEmailAsync(testUserEmail).Result == null)
        {
            var testUser = new IdentityUser
            {
                UserName = testUserEmail,
                Email = testUserEmail,
                EmailConfirmed = true
            };

            var result = um.CreateAsync(testUser, testUserPassword).Result;
            if (!result.Succeeded)
            {
                throw new Exception(
                    $"Failed to create test user: {string.Join(", ", result.Errors.Select(e => e.Description))}");
            }
        }
    }

    private static void SeedPlayersAndProgress(ApplicationDbContext db, UserManager<IdentityUser> um)
    {
        var users = um.Users.ToList();

        foreach (var user in users)
        {
            if (!db.Players.Any(p => p.UserId == user.Id))
            {
                var player = new Player
                {
                    UserId = user.Id,
                    Nickname = null,
                    LastPosX = -600,
                    LastPosY = -3700,
                    Skin = "default",
                };

                db.Players.Add(player);
                db.SaveChanges(); // Ensure Player is saved before adding PlayerProgress

                // Ensure PlayerProgress is added
                db.PlayerProgresses.Add(new PlayerProgress
                {
                    PlayerId = player.Id,
                    CurrentTaskId = 0, // Ensure valid CurrentTaskId
                    PositionX = -600,
                    PositionY = -3700,
                    CurrentInteractionId = 0
                });
                db.SaveChanges(); // Save PlayerProgress after ensuring Player exists
            }
        }

        db.SaveChanges();
    }
}