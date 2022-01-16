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

                    var bookMap = new Dictionary<Tuple<float, float>, List<BookInfo>>();
                    foreach(var book in newObject)
                    {
                        if(request.BoundingBox.TopLeft.x <= book.coordinates[0]
                            && request.BoundingBox.TopLeft.y >= book.coordinates[1]
                            && request.BoundingBox.BottomRight.x >= book.coordinates[0]
                            && request.BoundingBox.BottomRight.y <= book.coordinates[1]) {

                            int digits = 2;
                            if (request.Radius <= 200)
                                digits = 2;
                            else if (request.Radius <= 400)
                                digits = 2;
                            else if (request.Radius <= 600)
                                digits = 2;
                            else if (request.Radius <= 800)
                                digits = 2;
                            else if (request.Radius <= 1000)
                                digits = 2;
                            else if (request.Radius <= 1200)
                                digits = 2;

                            Tuple<float, float> coords = new((float)Math.Round(book.coordinates[0], digits), (float)Math.Round(book.coordinates[1], digits));
                            bookMap[coords].Add(new BookInfo {
                                Title = book.title,
                                Name = book.name
                            });
                        }
                    }

                    foreach(var item in bookMap) {
                        response.Features.Add(new MarkerForGetMarkersResponse() {
                            BookCount = item.Value.Count,
                            Books = item.Value,
                            Geometry = new GeometryForGetMarkersResponse() {
                                Type = "Coordinates",
                                Coordinates = new CoordinatesForGetMarkersResponse() {
                                    Longitude = item.Key.Item1,
                                    Latitude = item.Key.Item2
                                }
                            }
                        }
                        );

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
