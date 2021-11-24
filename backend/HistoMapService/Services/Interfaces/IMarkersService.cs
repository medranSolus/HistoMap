using System.Threading.Tasks;
using HistoMapService.DTOs.Requests;
using HistoMapService.DTOs.Responses;

namespace HistoMapService.Services.Interfaces
{
    public interface IMarkersService
    {
        Task<GetMarkersResponse> GetMarkersAsync(GetMarkersRequest request);

    }
}