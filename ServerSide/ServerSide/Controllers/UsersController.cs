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
    [RoutePrefix("api/Users")]
    public class UsersController : ApiController
    {
        private RentCarDBEntities db = new RentCarDBEntities();

        [Route("all")] // GET: api/Users/all
        public IQueryable<User> GetUser()
        {
            return db.User;
        }

        [Route("{id}")] // GET: api/Users/5
        [ResponseType(typeof(User))]
        public IHttpActionResult GetUser(string id)
        {
            User user = db.User.Find(id);
            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        [Route("rentals/{id}")] // GET: api/Users/rentals/5
        [ResponseType(typeof(Rental))]
        public IHttpActionResult GetUserRentals(string id)
        {
            var userRentals = db.Rental.Where(rent => rent.UserId == id).OrderBy(rent => rent.PickUpDate);
            if (userRentals == null)
            {
                return NotFound();
            }

            return Ok(userRentals);
        }

        // POST: api/Users
        [ResponseType(typeof(User))]
        public IHttpActionResult PostUser(User user)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var isUserIdExists = db.User.FirstOrDefault(u => u.UserId == user.UserId);
            var isEmailExists = db.User.FirstOrDefault(u => u.Email == user.Email);
            var isUserNameExists = db.User.FirstOrDefault(u => u.UserName == user.UserName);
            bool exist = false;
            string existError = "";

            if (isUserIdExists != null)
            {
                exist = true;
                existError += "\nUser ID is exists";
            }
            if (isEmailExists != null)
            {
                exist = true;
                existError += "\nEmail is exists";
            }
            if (isUserNameExists != null)
            {
                exist = true;
                existError += "\nUsername is exists";
            }

            if(exist == true)
            {
                return Content(HttpStatusCode.BadRequest, existError);
            }

            db.User.Add(user);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateException)
            {
                if (UserExists(user.UserId))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtRoute("DefaultApi", new { id = user.UserId }, user);
        }

        [Route("login")]// POST: api/Users/login
        [ResponseType(typeof(AuthenticateUser))]
        public IHttpActionResult Authenticate(AuthenticateUser user)
        {
            User userFromDb = null;
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                userFromDb = db.User.SingleOrDefault(u =>
                             u.UserName == user.UserName && u.Password == user.Password);

            }
            catch (DbUpdateException)
            {
                throw;
            }

            if (userFromDb != null)
            {
                return Ok(userFromDb);
            }
            else
            {
                return NotFound();
            }
            
        }

        // PUT: api/Users/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutUser(string id, User user)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != user.UserId)
            {
                return BadRequest();
            }

            db.Entry(user).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
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

        // DELETE: api/Users/5
        [ResponseType(typeof(User))]
        public IHttpActionResult DeleteUser(string id)
        {
            User user = db.User.Find(id);
            if (user == null)
            {
                return NotFound();
            }

            db.User.Remove(user);
            db.SaveChanges();

            return Ok(user);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool UserExists(string id)
        {
            return db.User.Count(e => e.UserId == id) > 0;
        }
    }
}