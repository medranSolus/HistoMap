using System.Threading.Tasks;
using HistoMapService.DTOs.Requests;
using HistoMapService.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HistoMapService.Controllers
{
    public class MarkersController : ControllerBase
    {
        private readonly IMarkersService _markersService;

        public MarkersController(IMarkersService markersService)
        {
            _markersService = markersService;
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetMarkers([FromBody] GetMarkersRequest request)
        {
            var response = await _markersService.GetMarkersAsync(request);
            return Ok(response);
        }
    }
}