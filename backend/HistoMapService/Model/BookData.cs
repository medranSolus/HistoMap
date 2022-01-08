using System.Collections.Generic;

namespace HistoMapService.Model
{
    public class BookData
    {
        public string title { get; set; }
        public string name { get; set; }
        public List<float> coordinates { get; set; }
    }

}