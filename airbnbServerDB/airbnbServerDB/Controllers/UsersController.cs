using airbnbServerDB.Models;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace airbnbServerDB.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        // GET: api/<UsersController>
        [HttpGet]
        public IEnumerable<User> Get()
        {
            return airbnbServerDB.Models.User.Read();
        }

        // GET api/<UsersController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<UsersController>
        [HttpPost]
        public IActionResult Post([FromBody] User user)
        {
            int numEffected = user.Insert();
            if (numEffected != 0)
            {
                return Ok("user succesfully inserted");
            }
            else
            {
                return NotFound("We couldnt insert your user");
            }
        }

        // PUT api/<UsersController>
        [HttpPut]
        public IActionResult Put([FromBody] User user)
        {
            int numEffected = user.Update();
            if (numEffected != 0)
            {
                return Ok("user succesfully updated");
            }
            else
            {
                return NotFound("We couldnt update your user");
            }
        }

        // PUT api/<UsersController>
        [HttpPut("{userEmail}/{isActive}")]
        public IActionResult PutActive(string userEmail, bool isActive)
        {
            User user = new User();
            int numEffected = user.UpdateActive(userEmail, isActive);
            if (numEffected != 0)
            {
                return Ok("user succesfully updated");
            }
            else
            {
                return NotFound("We couldnt update your user");
            }
        }

        // DELETE api/<UsersController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
