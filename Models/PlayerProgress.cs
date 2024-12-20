namespace html_mansion.Models;

public class PlayerProgress
{
    public int Id { get; set; }
    public int PlayerId { get; set; }
    public int CurrentTaskId { get; set; }
    public int PositionX { get; set; } 
    public int PositionY { get; set; } 
    public int CurrentInteractionId { get; set; }
    
    public Player Player { get; set; }
}