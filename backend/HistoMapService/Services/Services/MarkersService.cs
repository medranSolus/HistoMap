using System.Threading.Tasks;
using HistoMapService.DTOs.Requests;
using HistoMapService.DTOs.Responses;
using HistoMapService.Services.Interfaces;

namespace HistoMapService.Services.Services
{
    public class MarkersService : IMarkersService
    {
        public Task<GetMarkersResponse> GetMarkersAsync(GetMarkersRequest request)
        {
            throw new System.NotImplementedException();
        }
    }
}