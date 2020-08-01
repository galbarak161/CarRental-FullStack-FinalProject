using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ServerSide.Models.Facades
{
    public class CarTypeFacade
    {
        public int TypeId { get; set; }
        public string Manufacturer { get; set; }
        public string Model { get; set; }
        public decimal DailyPrice { get; set; }
        public decimal DelayedPrice { get; set; }
        public string Transmission { get; set; }
        public int ProductionYear { get; set; }
        public string Image { get; set; }

        public Branch[] CarsInBranch { get; set; }
    }
}