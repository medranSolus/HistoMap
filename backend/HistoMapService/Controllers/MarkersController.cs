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
        public Task<IActionResult> GetMarkers([FromBody] GetMarkersRequest request)
        {
            var response = _markersService.GetMarkersAsync(request);
            return Ok(response);            
        }
    }
}