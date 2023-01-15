using airbnbServerDB.Models;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace airbnbServerDB.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        // GET: api/<OrdersController>
        [HttpGet]
        public IEnumerable<Vacation> Get()
        {
            return Vacation.Read();
        }

        // GET api/<OrdersController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // GET api/<FlatController>/5
        [HttpGet("/getByDates/startDate/{startDate}/endDate/{endDate}")]
        public IActionResult getByDates(DateTime startDate, DateTime endDate)
        {
            List<Vacation> vacationList = Vacation.getByDates(startDate, endDate);

            if (vacationList.Count > 0)
            {
                return Ok(vacationList);
            }
            else
            {
                return NotFound("There are no apartment in our data that meets your requirements");
            }
        }

        // POST api/<OrdersController>
        [HttpPost]
        public IActionResult Post([FromBody] Vacation vacation)
        {
            int numEffected = vacation.Insert();
            if (numEffected != 0)
            {
                return Ok("vacation succesfully inserted");
            }
            else
            {
                return NotFound("We couldnt insert your vacation");
            }
        }

        // PUT api/<OrdersController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<OrdersController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
