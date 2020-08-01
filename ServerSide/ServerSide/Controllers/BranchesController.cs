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

namespace ServerSide.Controllers
{
    [RoutePrefix("api/Branches")]
    public class BranchesController : ApiController
    {
        private RentCarDBEntities db = new RentCarDBEntities();

        [Route("all")] // GET: api/Branches/all
        public IQueryable<Branch> GetBranch()
        {
            return db.Branch;
        }

        [Route("{id}")] // GET: api/Branches/10
        [ResponseType(typeof(Branch))]
        public IHttpActionResult GetBranch(int id)
        {
            Branch branch = db.Branch.Find(id);
            if (branch == null)
            {
                return NotFound();
            }

            return Ok(branch);
        }

        [Route("branch-name/{id}")] // GET: api/Branches/10
        [ResponseType(typeof(string))]
        public IHttpActionResult GetBranchName(int id)
        {
            Branch branch = db.Branch.Find(id);
            if (branch == null)
            {
                return NotFound();
            }

            return Ok(branch.Name);
        }

        // PUT: api/Branches/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutBranch(int id, Branch branch)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != branch.BranchId)
            {
                return BadRequest();
            }

            db.Entry(branch).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BranchExists(id))
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

        // POST: api/Branches
        [ResponseType(typeof(Branch))]
        public IHttpActionResult PostBranch(Branch branch)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Branch.Add(branch);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = branch.BranchId }, branch);
        }

        // DELETE: api/Branches/5
        [ResponseType(typeof(Branch))]
        public IHttpActionResult DeleteBranch(int id)
        {
            Branch branch = db.Branch.Find(id);
            if (branch == null)
            {
                return NotFound();
            }

            db.Branch.Remove(branch);
            db.SaveChanges();

            return Ok(branch);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool BranchExists(int id)
        {
            return db.Branch.Count(e => e.BranchId == id) > 0;
        }
    }
}