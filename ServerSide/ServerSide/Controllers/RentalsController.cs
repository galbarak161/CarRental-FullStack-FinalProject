using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using ServerSide.Models;
using ServerSide.Models.Facades;

namespace ServerSide.Controllers
{
    [RoutePrefix("api/rentals")]
    public class RentalsController : ApiController
    {
        private RentCarDBEntities db = new RentCarDBEntities();

        [Route("all")]// GET: api/rentals/all
        public IQueryable<Rental> GetRental()
        {
            return db.Rental.OrderBy(rent => rent.PickUpDate);
        }

        [Route("CarId/{carId}/PickUpDate/{pickUpDate}")]// GET: api/rentals/CarId/10/PickUpDate/15-02-2018
        [ResponseType(typeof(Rental))]
        public IHttpActionResult GetRentalByCarIdAndPickUpDate(int carId, DateTime pickUpDate)
        {
            Rental rental = db.Rental.SingleOrDefault(
                rent => rent.CarId == carId && rent.PickUpDate == pickUpDate);
            if (rental == null)
            {
                return NotFound();
            }
            if(rental.ActualReturnDate != null)
            {
                return StatusCode(HttpStatusCode.NoContent);
            }
            return Ok(rental);
        }

        [Route("Branch/{BranchId}/PickUpDate/{pickUpDate}/ReturnDate/{returnDate}")]// GET: api/rentals/Branch/10/PickUpDate/15-02-2018/ReturnDate/17-03-2018
        [ResponseType(typeof(CarTypeFacade))]
        public IHttpActionResult GetAvailiableTypesByDatesAndBrancid(int branchId, DateTime pickUpDate, DateTime returnDate)
        {
            var availabeCarsFromBranch = GetavailabeCarsFromBranch(branchId, pickUpDate, returnDate);
            if (availabeCarsFromBranch == null)
            {
                return NotFound();
            }

            return Ok(availabeCarsFromBranch
                .Select(car => car.CarType)
                .Distinct()
                .Select(type => new CarTypeFacade
                {
                    TypeId = type.TypeId,
                    Manufacturer = type.Manufacturer,
                    Model = type.Model,
                    DailyPrice = type.DailyPrice,
                    DelayedPrice = type.DelayedPrice,
                    Transmission = type.Transmission,
                    ProductionYear = type.ProductionYear,
                    Image = type.Image
                }));
        }

        [Route("new")] // POST: api/Rentals/new
        [ResponseType(typeof(Rental))]
        public IHttpActionResult PostRental(RentalsFacade userRental)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var availabeCarsFromBranch = GetavailabeCarsFromBranch(userRental.BranchId, userRental.PickUpDate, userRental.ReturnDate);

            Rental newRental = new Rental
            {
                CarId = availabeCarsFromBranch.OrderBy(car => car.Mileage)
                                              .FirstOrDefault(car => car.TypeId == userRental.TypeId)
                                              .CarId,
                UserId = userRental.UserId,
                PickUpDate = userRental.PickUpDate,
                ReturnDate = userRental.ReturnDate
            };
            
            db.Rental.Add(newRental);
            db.SaveChanges();

            return Ok(newRental);
        }

        [Route("delete/rentalId/{id}")] // DELETE: api/Rentals/delete/rentalId/5
        [ResponseType(typeof(Rental))]
        public IHttpActionResult DeleteRental(int id)
        {
            Rental rental = db.Rental.Find(id);
            if (rental == null)
            {
                return NotFound();
            }

            db.Rental.Remove(rental);
            db.SaveChanges();

            return Ok(rental);
        }

        [Route("return/{id}")] // PUT: api/Rentals/return/{rentalId}
        [ResponseType(typeof(void))]
        public IHttpActionResult PutRental(int id, Rental rental)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != rental.Id)
            {
                return BadRequest();
            }

            db.Entry(rental).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RentalExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool RentalExists(int id)
        {
            return db.Rental.Count(e => e.Id == id) > 0;
        }

        private IQueryable<Car> GetavailabeCarsFromBranch(int branchId, DateTime pickUpDate, DateTime returnDate)
        {
            var carsThatAreNotAvailabeInDate = db.Rental
                                              .Where(date => !(pickUpDate > date.ReturnDate || returnDate < date.PickUpDate))
                                              .Select(car => car.Car)
                                              .Distinct();

             var availabeCarsFromBranch = db.Car.Where(car => car.IsFix == true && car.BranchId == branchId)
                                            .Except(carsThatAreNotAvailabeInDate);

            return availabeCarsFromBranch;
        }
    }
}
 