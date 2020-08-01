using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ServerSide.Models.Facades
{
    public class RentalsFacade
    {
        public string UserId { get; set; }
        public int TypeId { get; set; }
        public int BranchId { get; set; }
        public DateTime PickUpDate { get; set; }
        public DateTime ReturnDate { get; set; }
    }
}