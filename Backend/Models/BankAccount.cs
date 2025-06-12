using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;


namespace WebAPI.Models
{
    public class BankAccount
    {
        [Key]
        //auto incrementing value
        public int BankAccountID {get; set ;}


        [Column(TypeName ="nvarChar(20)")]
        [Required]
        public string AccountNumber {get; set ;}


        [Column(TypeName = "nvarChar(100)")]
        [Required]
        public string AccountHolder {get; set ;}

        [Required]
        public int BankId { get; set; }


        [ForeignKey("BankId")]
        public Bank? Bank { get; set; }


        [Column(TypeName = "nvarChar(20)")]
        [Required]
        public string IFSC { get; set; }

    }
}
