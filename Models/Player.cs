namespace html_mansion.Models;

public class Player
{
    public int Id { get; set; }
    public string UserId { get; set; }
    public string? Nickname { get; set; }
    public int LastPosX { get; set; }
    public int LastPosY { get; set; }
    public string Skin { get; set; }
}