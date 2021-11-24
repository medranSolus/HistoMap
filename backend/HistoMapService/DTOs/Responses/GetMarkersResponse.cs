using System.Collections.Generic;

namespace HistoMapService.DTOs.Responses
{
    public class GetMarkersResponse
    {
        public List<MarkerForGetMarkersResponse> Features { get; set; }
    }

    public class MarkerForGetMarkersResponse {
        public GeometryForGetMarkersResponse Geometry { get; set; }
        public string Type { get; set; }
        public List<PropertiesForGetMarkersResponse> Properties { get; set; }
    }

    public class PropertiesForGetMarkersResponse {
        public int Count { get; set; }
        public List<int> ContentIds { get; set; }
    }

    public class GeometryForGetMarkersResponse {
        public CoordinatesForGetMarkersResponse Coordinates { get; set; }
    }

    public class CoordinatesForGetMarkersResponse {
        public float Longitude { get; set; }
        public float Latitude { get; set; }
    }
}
