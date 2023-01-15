using airbnbServerDB.Models;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace airbnbServerDB.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    [ApiController]
    public class FlatController : ControllerBase
    {
        // GET: api/<FlatController>
        [HttpGet]
        public IEnumerable<Flat> Get()
        {
            return Flat.Read();
        }

        //// GET api/<FlatController>/5
        //[HttpGet("{id}")]
        //public string Get(int id)
        //{
        //    return "value";
        //}

        // GET api/<FlatController>/5
        [HttpGet("{month}")]
        public Object GetAvg(int month)
        {
            Flat flat = new Flat();
            return flat.getAvgBy(month);
        }

        // GET api/<FlatController>/5
        [HttpGet("/flats")]
        public IActionResult GetByCityPrice(string city, double maxPrice)
        {
            List<Flat> flatsList = Flat.GetByCityPrice(city, maxPrice);

            if (flatsList.Count > 0)
            {
                return Ok(flatsList);
            }
            else
            {
                return NotFound("There are no apartment in our data that meets your requirements");
            }
        }

        // POST api/<FlatController>
        [HttpPost]
        public IActionResult Post([FromBody] Flat flat)
        {
            int numEffected = flat.Insert();
            if (numEffected != 0)
            {
                return Ok("flat succesfully inserted");
            }
            else
            {
                return NotFound("We couldnt insert your flat");
            }
        }

        // PUT api/<FlatController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<FlatController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
