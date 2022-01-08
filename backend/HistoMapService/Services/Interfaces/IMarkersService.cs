using System.Threading.Tasks;
using HistoMapService.DTOs.Requests;
using HistoMapService.DTOs.Responses;

namespace HistoMapService.Services.Interfaces
{
    public interface IMarkersService
    {
        dynamic GetMarkersAsync(GetMarkersRequest request);

    }
}