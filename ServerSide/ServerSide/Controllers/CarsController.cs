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
    [RoutePrefix("api/cars")]
    public class CarsController : ApiController
    {
        private RentCarDBEntities db = new RentCarDBEntities();

        [Route("all")] // GET: api/cars/all
        public IQueryable<Car> GetCar()
        {
            return db.Car;
        }

        [Route("type")] // GET: api/cars/type
        //public IQueryable<CarType> GetCarType()
        public IQueryable<CarTypeFacade> GetCarType()
        {
            return db.CarType.Select(type => new CarTypeFacade
            {
                TypeId = type.TypeId,
                Manufacturer = type.Manufacturer,
                Model = type.Model,
                DailyPrice = type.DailyPrice,
                DelayedPrice = type.DelayedPrice,
                Transmission = type.Transmission,
                ProductionYear = type.ProductionYear,
                Image = type.Image
            });
        }

        [Route("{id}")] // GET: api/cars/{id}
        [ResponseType(typeof(Car))]
        public IHttpActionResult GetCar(int id)
        {
            Car car = db.Car.Find(id);
            if (car == null)
            {
                return NotFound();
            }

            return Ok(car);
        }

        [Route("type/{id}")] // GET: api/cars/type/{id}
        [ResponseType(typeof(CarType))]
        public IHttpActionResult GetCarsFromType(int id)
        {
            CarType carType = db.CarType.Find(id);
            if (carType == null)
            {
                return NotFound();
            }
            return Ok(carType.Car);
        }

        [Route("type/car/{id}")] // GET: api/cars/type/car/{id}
        [ResponseType(typeof(CarTypeFacade))]
        public IHttpActionResult GetTypeFromCarId(int id)
        {
            var car = db.Car.Find(id);
            if (car == null)
            {
                return NotFound();
            }

            var carType = new CarTypeFacade
            {
                TypeId = car.CarType.TypeId,
                Manufacturer = car.CarType.Manufacturer,
                Model = car.CarType.Model,
                DailyPrice = car.CarType.DailyPrice,
                DelayedPrice = car.CarType.DelayedPrice,
                Transmission = car.CarType.Transmission,
                ProductionYear = car.CarType.ProductionYear,
                Image = car.CarType.Image
            };
            return Ok(carType);
        }

        [Route("return/{id}")] // PUT: api/Cars/return/{id}
        [ResponseType(typeof(void))]
        public IHttpActionResult PutCar(int id, Car car)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != car.CarId)
            {
                return BadRequest();
            }

            db.Entry(car).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CarExists(id))
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

        [Route("update/carType/{id}")] // PUT: api/Cars/update/carType/{id}
        [ResponseType(typeof(CarType))]
        public IHttpActionResult PutCarType(int id, CarType carType)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != carType.TypeId)
            {
                return BadRequest();
            }

            db.Entry(carType).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CarTypeExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok(carType);
        }

        [Route("new/car")]// POST: api/Cars/new/car
        [ResponseType(typeof(Car))]
        public IHttpActionResult PostCar(Car car)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Car.Add(car);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateException)
            {
                if (CarExists(car.CarId))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }
            return Ok(car);
        }

        [Route("new/carType")]// POST: api/Cars/new/carType
        [ResponseType(typeof(CarType))]
        public IHttpActionResult PostCarType(CarType carType)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.CarType.Add(carType);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateException)
            {
                if (CarTypeExists(carType.TypeId))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }
            return Ok(carType);
        }

        // DELETE: api/Cars/5
        [ResponseType(typeof(Car))]
        public IHttpActionResult DeleteCar(int id)
        {
            var cars = db.Rental.Where(rent => rent.CarId == id).Select(rent => rent.Car);
            Car car = db.Car.Find(id);
            if (car == null)
            {
                return NotFound();
            }

            db.Car.RemoveRange(cars);
            db.Car.Remove(car);
            db.SaveChanges();

            return Ok(car);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool CarExists(int id)
        {
            return db.Car.Count(e => e.CarId == id) > 0;
        }

        private bool CarTypeExists(int id)
        {
            return db.CarType.Count(e => e.TypeId == id) > 0;
        }
    }
}