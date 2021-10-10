using Microsoft.EntityFrameworkCore;

namespace HistoMapService.Model
{
    public class LSContext : DbContext
    {
        public LSContext(DbContextOptions<LSContext> options): base(options) {}
    }
}