using System.Collections.Generic;

namespace HistoMapService.DTOs.Requests
{
    public class GetMarkersRequest
    {
        public BoundingBoxForGetMarkersRequest BoundingBox { get; set; }
        public int Radius { get; set; }
        public int Year { get; set; }
        public List<FilterForGetMarkersRequest> Filters { get; set; }

    }

    public enum FilterForGetMarkersRequest {
        Countries = 0,
        Mountains = 1,
        Rivers = 2
    }

    public class BoundingBoxForGetMarkersRequest {
        public PointForGetMarkersRequest TopLeft { get; set; }
        public PointForGetMarkersRequest BottomRight { get; set; }
    }

    public class PointForGetMarkersRequest {
        public float x { get; set; }
        public float y { get; set; }
    }
}