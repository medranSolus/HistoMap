using Microsoft.EntityFrameworkCore;

namespace HistoMapService.Model
{
    public class HMContext : DbContext
    {
        public HMContext(DbContextOptions<HMContext> options): base(options) {}
    }
}