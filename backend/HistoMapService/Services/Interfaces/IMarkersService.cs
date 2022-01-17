using HistoMapService.DTOs.Requests;
using HistoMapService.DTOs.Responses;

namespace HistoMapService.Services.Interfaces
{
    public interface IMarkersService
    {
        GetMarkersResponse GetMarkers(GetMarkersRequest request);
    }
}