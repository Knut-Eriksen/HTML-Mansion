using System.ComponentModel.DataAnnotations;

namespace html_mansion.Models
{
    public class Feedback
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Message { get; set; }
    }
}