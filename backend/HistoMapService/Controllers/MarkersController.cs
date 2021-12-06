using System.Threading.Tasks;
using HistoMapService.DTOs.Requests;
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
            var response = await _markersService.GetMarkersAsync(request);
            return Ok(response);
        }
    }
}