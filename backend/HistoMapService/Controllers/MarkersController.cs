using System.Collections.Generic;
using System.Threading.Tasks;
using HistoMapService.DTOs.Requests;
using HistoMapService.DTOs.Responses;
using HistoMapService.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HistoMapService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MarkersController : ControllerBase
    {
        private readonly IMarkersService _markersService;

        public MarkersController(IMarkersService markersService)
        {
            _markersService = markersService;
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> GetMarkers([FromBody] GetMarkersRequest request)
        {
            // var response = await _markersService.GetMarkersAsync(request);
            return Ok("{\n    \"type\": \"FeatureCollection\",\n    \"features\": [\n        {\n            \"geometry\": {\n                \"type\": \"Point\",\n                \"coordinates\": [13.4, 42.35]\n            },\n            \"type\": \"Feature\",\n            \"properties\": {\n                \"count\": 9,\n                \"name\": \"Wiebestr./Huttenstr. (Berlin)\"\n            }\n        },\n        {\n            \"geometry\": {\n                \"type\": \"Point\",\n                \"coordinates\": [37.89935, 7.01931]\n            },\n            \"type\": \"Feature\",\n            \"properties\": {\n                \"count\": 3,\n                \"name\": \"Wiebestr./Huttenstr. (Berlin)\"\n            }\n        },\n        {\n            \"geometry\": {\n                \"type\": \"Point\",\n                \"coordinates\": [-10.21128, 39.02026]\n            },\n            \"type\": \"Feature\",\n            \"properties\": {\n                \"count\": 1,\n                \"name\": \"Wiebestr./Huttenstr. (Berlin)\"\n            }\n        }\n    ]\n}");
            
        }
    }
}