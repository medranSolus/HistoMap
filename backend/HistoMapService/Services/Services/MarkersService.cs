using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using HistoMapService.DTOs.Requests;
using HistoMapService.DTOs.Responses;
using HistoMapService.Model;
using HistoMapService.Services.Interfaces;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace HistoMapService.Services.Services
{
    public class MarkersService : IMarkersService
    {

        public dynamic GetMarkersAsync(GetMarkersRequest request)
        {
            using (StreamReader r = new StreamReader("./Data/json_database.json"))
            {
                string json = r.ReadToEnd();

                try{
                    var tmpData = JObject.Parse(json)[request.Year.ToString()];
                    
                    // Lista ksiązek ze wskazanego roku
                    List<BookData> newObject = tmpData.ToObject<List<BookData>>();

                    var response = new GetMarkersResponse();
                    response.Type = "FeatureCollection";
                    response.Features = new List<MarkerForGetMarkersResponse>();

                    foreach(var book in newObject)
                    {
                        if(request.BoundingBox.TopLeft.x >= book.coordinates[0] && request.BoundingBox.TopLeft.y >= book.coordinates[1] && request.BoundingBox.BottomRight.x <= book.coordinates[0] && request.BoundingBox.BottomRight.y <= book.coordinates[1]) {
                            response.Features.Add(new MarkerForGetMarkersResponse() {
                                Title = book.title,
                                Name = book.name,
                                Geometry = new GeometryForGetMarkersResponse() {
                                    Type = "Coordinates",
                                    Coordinates = new CoordinatesForGetMarkersResponse() {
                                        Longitude = book.coordinates[0],
                                        Latitude = book.coordinates[1]
                                    }
                                }
                            }
                            );
                        }
                    }

                    return response;
                }
                catch(Exception)
                {
                    return null;
                }

            }

            throw new Exception();
        }
    }

}
