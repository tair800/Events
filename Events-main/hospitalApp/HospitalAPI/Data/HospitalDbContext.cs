using Microsoft.EntityFrameworkCore;
using HospitalAPI.Models;

namespace HospitalAPI.Data
{
    public class HospitalDbContext : DbContext
    {
        public HospitalDbContext(DbContextOptions<HospitalDbContext> options) : base(options)
        {
        }

        public DbSet<Event> Events { get; set; }
        public DbSet<Blog> Blogs { get; set; }
        public DbSet<Employee> Employees { get; set; }
        public DbSet<EmployeeDegree> EmployeeDegrees { get; set; }
        public DbSet<EmployeeCertificate> EmployeeCertificates { get; set; }

        public DbSet<Logo> Logos { get; set; }
        public DbSet<AboutCarousel> AboutCarousel { get; set; }
        public DbSet<About> About { get; set; }
        public DbSet<Contact> Contacts { get; set; }
        public DbSet<HomeSection> HomeSections { get; set; }
        public DbSet<Gallery> Gallery { get; set; }
        public DbSet<Request> Requests { get; set; }
        public DbSet<Mail> Mails { get; set; }
        public DbSet<EventEmployee> EventEmployees { get; set; }
        public DbSet<EventSpeaker> EventSpeakers { get; set; }
        public DbSet<EventTimeline> EventTimeline { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            // Configure Events table for SQLite
            modelBuilder.Entity<Event>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Subtitle).HasMaxLength(300);
                entity.Property(e => e.Description).HasMaxLength(1000);
                entity.Property(e => e.Venue).HasMaxLength(200);
                entity.Property(e => e.Trainer).HasMaxLength(100);
                entity.Property(e => e.Time).HasMaxLength(10);
                entity.Property(e => e.Currency).HasMaxLength(3);
                entity.Property(e => e.MainImage).HasMaxLength(500);
                entity.Property(e => e.DetailImageLeft).HasMaxLength(500);
                entity.Property(e => e.DetailImageMain).HasMaxLength(500);
                entity.Property(e => e.DetailImageRight).HasMaxLength(500);
                entity.Property(e => e.Price).HasColumnType("REAL");
                // English language fields
                entity.Property(e => e.TitleEn).HasMaxLength(200);
                entity.Property(e => e.SubtitleEn).HasMaxLength(300);
                entity.Property(e => e.DescriptionEn).HasMaxLength(1000);
                entity.Property(e => e.LongDescriptionEn);
                entity.Property(e => e.VenueEn).HasMaxLength(200);
                entity.Property(e => e.TrainerEn).HasMaxLength(100);
                entity.Property(e => e.RegionEn).HasMaxLength(100);
                // Russian language fields
                entity.Property(e => e.TitleRu).HasMaxLength(200);
                entity.Property(e => e.SubtitleRu).HasMaxLength(300);
                entity.Property(e => e.DescriptionRu).HasMaxLength(1000);
                entity.Property(e => e.LongDescriptionRu);
                entity.Property(e => e.VenueRu).HasMaxLength(200);
                entity.Property(e => e.TrainerRu).HasMaxLength(100);
                entity.Property(e => e.RegionRu).HasMaxLength(100);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            });

            // Configure Blogs table for SQLite
            modelBuilder.Entity<Blog>(entity =>
            {
                entity.HasKey(b => b.Id);
                entity.Property(b => b.Number).IsRequired().HasMaxLength(10);
                entity.Property(b => b.Title).IsRequired().HasMaxLength(300);
                entity.Property(b => b.Description).HasMaxLength(500);
                entity.Property(b => b.Date).IsRequired().HasMaxLength(50);
                entity.Property(b => b.SecondDescTitle).HasMaxLength(200);
                entity.Property(b => b.SecondDescBody).HasMaxLength(1000);
                entity.Property(b => b.ThirdTextTitle).HasMaxLength(200);
                entity.Property(b => b.ThirdTextBody).HasMaxLength(1000);
                // English language fields
                entity.Property(b => b.TitleEn).HasMaxLength(300);
                entity.Property(b => b.DescriptionEn).HasMaxLength(500);
                entity.Property(b => b.SecondDescTitleEn).HasMaxLength(200);
                entity.Property(b => b.SecondDescBodyEn).HasMaxLength(1000);
                entity.Property(b => b.ThirdTextTitleEn).HasMaxLength(200);
                entity.Property(b => b.ThirdTextBodyEn).HasMaxLength(1000);
                // Russian language fields
                entity.Property(b => b.TitleRu).HasMaxLength(300);
                entity.Property(b => b.DescriptionRu).HasMaxLength(500);
                entity.Property(b => b.SecondDescTitleRu).HasMaxLength(200);
                entity.Property(b => b.SecondDescBodyRu).HasMaxLength(1000);
                entity.Property(b => b.ThirdTextTitleRu).HasMaxLength(200);
                entity.Property(b => b.ThirdTextBodyRu).HasMaxLength(1000);
                entity.Property(b => b.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
                entity.Property(b => b.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            });



            // Configure Logos table for SQLite
            modelBuilder.Entity<Logo>(entity =>
            {
                entity.HasKey(l => l.Id);
                entity.Property(l => l.Name).IsRequired().HasMaxLength(100);
                entity.Property(l => l.Image).IsRequired().HasMaxLength(500);
                entity.Property(l => l.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
                entity.Property(l => l.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            });

            // Configure AboutCarousel table for SQLite
            modelBuilder.Entity<AboutCarousel>(entity =>
            {
                entity.HasKey(ac => ac.Id);
                entity.Property(ac => ac.Name).IsRequired().HasMaxLength(200);
                entity.Property(ac => ac.Image).IsRequired().HasMaxLength(500);
                entity.Property(ac => ac.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
                entity.Property(ac => ac.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            });

            // Configure About table for SQLite
            modelBuilder.Entity<About>(entity =>
            {
                entity.HasKey(a => a.Id);
                entity.Property(a => a.Title).IsRequired().HasMaxLength(500);
                entity.Property(a => a.Description).IsRequired();
                entity.Property(a => a.Img).IsRequired().HasMaxLength(500);
                entity.Property(a => a.TitleEn).HasMaxLength(500);
                entity.Property(a => a.DescriptionEn);
                entity.Property(a => a.TitleRu).HasMaxLength(500);
                entity.Property(a => a.DescriptionRu);
            });

            // Configure Contact table for SQLite
            modelBuilder.Entity<Contact>(entity =>
            {
                entity.HasKey(c => c.Id);
                entity.Property(c => c.Type).IsRequired().HasMaxLength(50);
                entity.Property(c => c.Value).IsRequired().HasMaxLength(500);
                entity.Property(c => c.Icon).IsRequired().HasMaxLength(100);
                entity.Property(c => c.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
                entity.Property(c => c.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            });

            // Configure HomeSection table for SQLite
            modelBuilder.Entity<HomeSection>(entity =>
            {
                entity.HasKey(h => h.Id);
                entity.Property(h => h.Section1Description).HasColumnName("section_1_description").HasMaxLength(2000);
                entity.Property(h => h.Section1DescriptionEn).HasColumnName("section_1_description_en").HasMaxLength(2000);
                entity.Property(h => h.Section1DescriptionRu).HasColumnName("section_1_description_ru").HasMaxLength(2000);
                entity.Property(h => h.Section2Image).HasColumnName("section_2_image").HasMaxLength(500);
                entity.Property(h => h.Section3Image).HasColumnName("section_3_image").HasMaxLength(500);
                entity.Property(h => h.Section4Title).HasColumnName("section_4_title").HasMaxLength(500);
                entity.Property(h => h.Section4TitleEn).HasColumnName("section_4_title_en").HasMaxLength(500);
                entity.Property(h => h.Section4TitleRu).HasColumnName("section_4_title_ru").HasMaxLength(500);
                entity.Property(h => h.Section4Description).HasColumnName("section_4_description").HasMaxLength(2000);
                entity.Property(h => h.Section4DescriptionEn).HasColumnName("section_4_description_en").HasMaxLength(2000);
                entity.Property(h => h.Section4DescriptionRu).HasColumnName("section_4_description_ru").HasMaxLength(2000);
                entity.Property(h => h.Section4PurposeTitle).HasColumnName("section_4_purpose_title").HasMaxLength(500);
                entity.Property(h => h.Section4PurposeTitleEn).HasColumnName("section_4_purpose_title_en").HasMaxLength(500);
                entity.Property(h => h.Section4PurposeTitleRu).HasColumnName("section_4_purpose_title_ru").HasMaxLength(500);
                entity.Property(h => h.Section4PurposeDescription).HasColumnName("section_4_purpose_description").HasMaxLength(2000);
                entity.Property(h => h.Section4PurposeDescriptionEn).HasColumnName("section_4_purpose_description_en").HasMaxLength(2000);
                entity.Property(h => h.Section4PurposeDescriptionRu).HasColumnName("section_4_purpose_description_ru").HasMaxLength(2000);
                entity.Property(h => h.CreatedAt).HasColumnName("created_at").HasDefaultValueSql("CURRENT_TIMESTAMP");
                entity.Property(h => h.UpdatedAt).HasColumnName("updated_at").HasDefaultValueSql("CURRENT_TIMESTAMP");
            });

            // Configure Gallery table for SQLite
            modelBuilder.Entity<Gallery>(entity =>
            {
                entity.HasKey(g => g.Id);
                entity.Property(g => g.Title).IsRequired().HasMaxLength(200);
                entity.Property(g => g.Description).HasMaxLength(500);
                entity.Property(g => g.Image).IsRequired().HasMaxLength(500);
                entity.Property(g => g.IsActive).HasDefaultValue(true);
                entity.Property(g => g.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
                entity.Property(g => g.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            });

            // Configure Employee table for SQLite
            modelBuilder.Entity<Employee>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Fullname).IsRequired().HasMaxLength(255);
                entity.Property(e => e.Field).IsRequired().HasMaxLength(255);
                entity.Property(e => e.Clinic).IsRequired().HasMaxLength(255);
                entity.Property(e => e.Image).HasMaxLength(500);
                entity.Property(e => e.DetailImage).HasMaxLength(500);
                entity.Property(e => e.Phone).HasMaxLength(50);
                entity.Property(e => e.WhatsApp).HasMaxLength(50);
                entity.Property(e => e.Email).HasMaxLength(255);
                entity.Property(e => e.Location).HasMaxLength(255);
                entity.Property(e => e.FirstDesc);
                entity.Property(e => e.SecondDesc);
                // English language fields
                entity.Property(e => e.FullnameEn).HasMaxLength(255);
                entity.Property(e => e.FieldEn).HasMaxLength(255);
                entity.Property(e => e.ClinicEn).HasMaxLength(255);
                entity.Property(e => e.LocationEn).HasMaxLength(255);
                entity.Property(e => e.FirstDescEn).HasColumnName("first_desc_en");
                entity.Property(e => e.SecondDescEn).HasColumnName("second_desc_en");
                // Russian language fields
                entity.Property(e => e.FullnameRu).HasMaxLength(255);
                entity.Property(e => e.FieldRu).HasMaxLength(255);
                entity.Property(e => e.ClinicRu).HasMaxLength(255);
                entity.Property(e => e.LocationRu).HasMaxLength(255);
                entity.Property(e => e.FirstDescRu).HasColumnName("first_desc_ru");
                entity.Property(e => e.SecondDescRu).HasColumnName("second_desc_ru");
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
                
                // Configure relationships
                entity.HasMany<EmployeeDegree>()
                    .WithOne()
                    .HasForeignKey(ed => ed.EmployeeId)
                    .OnDelete(DeleteBehavior.Cascade);
                    
                entity.HasMany<EmployeeCertificate>()
                    .WithOne()
                    .HasForeignKey(ec => ec.EmployeeId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Configure EmployeeDegree table for SQLite
            modelBuilder.Entity<EmployeeDegree>(entity =>
            {
                entity.ToTable("Employee_degrees");
                entity.HasKey(ed => ed.Id);
                entity.Property(ed => ed.UniversityName).IsRequired().HasMaxLength(255);
                // English language field
                entity.Property(ed => ed.UniversityNameEn).HasMaxLength(255);
                // Russian language field
                entity.Property(ed => ed.UniversityNameRu).HasMaxLength(255);
            });

            // Configure EmployeeCertificate table for SQLite
            modelBuilder.Entity<EmployeeCertificate>(entity =>
            {
                entity.ToTable("Employee_certificates");
                entity.HasKey(ec => ec.Id);
                entity.Property(ec => ec.CertificateImage).IsRequired().HasMaxLength(500);
                entity.Property(ec => ec.CertificateName).IsRequired().HasMaxLength(255);
                // English language field
                entity.Property(ec => ec.CertificateNameEn).HasMaxLength(255);
                // Russian language field
                entity.Property(ec => ec.CertificateNameRu).HasMaxLength(255);
            });

            // Configure Request table for SQLite
            modelBuilder.Entity<Request>(entity =>
            {
                entity.HasKey(r => r.Id);
                entity.Property(r => r.Name).IsRequired().HasMaxLength(100);
                entity.Property(r => r.Surname).IsRequired().HasMaxLength(100);
                entity.Property(r => r.Email).IsRequired().HasMaxLength(255);
                entity.Property(r => r.Phone).IsRequired().HasMaxLength(20);
                entity.Property(r => r.FinCode).IsRequired().HasMaxLength(20);
                entity.Property(r => r.Vezife).IsRequired().HasMaxLength(200);
                entity.Property(r => r.Status).IsRequired().HasMaxLength(20).HasDefaultValue("pending");
                entity.Property(r => r.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
                entity.Property(r => r.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            });

            // Configure Mail table for SQLite
            modelBuilder.Entity<Mail>(entity =>
            {
                entity.HasKey(m => m.Id);
                entity.Property(m => m.Name).IsRequired().HasMaxLength(100);
                entity.Property(m => m.Surname).IsRequired().HasMaxLength(100);
                entity.Property(m => m.Email).IsRequired().HasMaxLength(255);
                entity.Property(m => m.Phone).IsRequired().HasMaxLength(20);
                entity.Property(m => m.Message).IsRequired().HasMaxLength(1000);
                entity.Property(m => m.Status).IsRequired().HasMaxLength(20).HasDefaultValue("unread");
                entity.Property(m => m.ReplyMessage).HasMaxLength(1000);
                entity.Property(m => m.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
                entity.Property(m => m.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            });

            // Configure EventEmployee table for SQLite
            modelBuilder.Entity<EventEmployee>(entity =>
            {
                entity.HasKey(ee => ee.Id);
                entity.Property(ee => ee.EventId).IsRequired();
                entity.Property(ee => ee.EmployeeId).IsRequired();
                entity.Property(ee => ee.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
                entity.Property(ee => ee.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
                
                // Configure relationships
                entity.HasOne<Event>()
                    .WithMany()
                    .HasForeignKey(ee => ee.EventId)
                    .OnDelete(DeleteBehavior.Cascade);
                    
                entity.HasOne<Employee>()
                    .WithMany()
                    .HasForeignKey(ee => ee.EmployeeId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Configure EventSpeaker table for SQLite
            modelBuilder.Entity<EventSpeaker>(entity =>
            {
                entity.HasKey(es => es.Id);
                entity.Property(es => es.EventId).IsRequired();
                entity.Property(es => es.Name).IsRequired().HasMaxLength(255);
                entity.Property(es => es.Title).IsRequired().HasMaxLength(255);
                entity.Property(es => es.Image).HasMaxLength(500);
                // English language fields
                entity.Property(es => es.NameEn).HasMaxLength(255);
                entity.Property(es => es.TitleEn).HasMaxLength(255);
                // Russian language fields
                entity.Property(es => es.NameRu).HasMaxLength(255);
                entity.Property(es => es.TitleRu).HasMaxLength(255);
                entity.Property(es => es.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
                entity.Property(es => es.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
                
                // Configure relationship with Event
                entity.HasOne<Event>()
                    .WithMany()
                    .HasForeignKey(es => es.EventId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Configure EventTimeline table for SQLite
            modelBuilder.Entity<EventTimeline>(entity =>
            {
                entity.HasKey(et => et.Id);
                entity.Property(et => et.EventId).IsRequired();
                entity.Property(et => et.StartTime).IsRequired().HasMaxLength(10);
                entity.Property(et => et.EndTime).IsRequired().HasMaxLength(10);
                entity.Property(et => et.Title).IsRequired().HasMaxLength(255);
                entity.Property(et => et.Description).HasMaxLength(1000);
                entity.Property(et => et.Info).HasMaxLength(2000);
                entity.Property(et => et.OrderIndex).IsRequired();
                // English language fields
                entity.Property(et => et.TitleEn).HasMaxLength(255);
                entity.Property(et => et.DescriptionEn).HasMaxLength(1000);
                entity.Property(et => et.InfoEn).HasMaxLength(2000);
                // Russian language fields
                entity.Property(et => et.TitleRu).HasMaxLength(255);
                entity.Property(et => et.DescriptionRu).HasMaxLength(1000);
                entity.Property(et => et.InfoRu).HasMaxLength(2000);
                entity.Property(et => et.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
                entity.Property(et => et.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
                
                // Configure relationship with Event
                entity.HasOne<Event>()
                    .WithMany()
                    .HasForeignKey(et => et.EventId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlite("Data Source=HospitalAPI.db");
            }
        }
    }
}
