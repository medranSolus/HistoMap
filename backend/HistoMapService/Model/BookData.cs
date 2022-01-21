using System.Collections.Generic;
using HistoMapService.DTOs.Requests;

namespace HistoMapService.Model
{
    public class BookData
    {
        public string title { get; set; }
        public string name { get; set; }
        public List<float> coordinates { get; set; }
        public FilterForGetMarkersRequest type { get; set; }
    }

}