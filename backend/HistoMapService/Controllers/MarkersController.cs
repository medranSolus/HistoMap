using HistoMapService.DTOs.Requests;
using HistoMapService.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

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
        public IActionResult GetMarkers([FromBody] GetMarkersRequest request)
        {
            return Ok(_markersService.GetMarkers(request));
        }
    }
}