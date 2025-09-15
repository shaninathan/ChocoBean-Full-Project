using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using ChocoBean.DataAccess.Entities;
using System;

namespace ChocoBean.DataAccess.Context
{
    public class ChocoBeanDbContext : DbContext
    {
        public ChocoBeanDbContext(DbContextOptions<ChocoBeanDbContext> options)
            : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<UserProfile> UserProfiles { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<Message> Messages { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Orders
            modelBuilder.Entity<Order>(e =>
            {
                e.HasKey(x => x.OrderId);
                e.Property(x => x.TotalPrice).HasColumnType("decimal(10,2)");
                e.Property(x => x.OrderId).UseIdentityColumn(seed: 1000, increment: 1);

                // Status עם ValueConverter לטיפול בערכים באנגלית ובעברית
                var statusConverter = new ValueConverter<OrderStatus, string>(
                    v => v.ToString(),
                    v => ConvertStatusStringToEnum(v)
                );

                e.Property(x => x.Status)
                 .HasConversion(statusConverter)
                 .HasMaxLength(20)
                 .IsRequired();

                e.HasOne(o => o.User)
                 .WithMany(u => u.Orders)
                 .HasForeignKey(o => o.UserId)
                 .OnDelete(DeleteBehavior.Cascade);
            });

            // OrderItems → OrderDetails
            modelBuilder.Entity<OrderItem>(e =>
            {
                e.ToTable("OrderDetails");
                e.HasKey(x => x.OrderItemId);
                e.Property(x => x.Price).HasColumnType("decimal(10,2)");

                e.HasOne(oi => oi.Order)
                 .WithMany(o => o.Items)
                 .HasForeignKey(oi => oi.OrderId)
                 .OnDelete(DeleteBehavior.Cascade);

                e.HasOne(oi => oi.Product)
                 .WithMany(p => p.OrderItems)
                 .HasForeignKey(oi => oi.ProductId)
                 .OnDelete(DeleteBehavior.Restrict);
            });

            // Products
            modelBuilder.Entity<Product>(e =>
            {
                e.HasKey(x => x.ProductId);
                e.Property(x => x.Price).HasColumnType("decimal(10,2)");
                e.HasOne(p => p.Category)
                 .WithMany(c => c.Products)
                 .HasForeignKey(p => p.CategoryId)
                 .OnDelete(DeleteBehavior.Restrict);
            });

            // Users
            modelBuilder.Entity<User>(e =>
            {
                e.HasKey(x => x.UserId);
                e.HasIndex(x => x.Email).IsUnique();
                e.HasIndex(x => x.UserName).IsUnique();
                e.Property(x => x.IsAdmin).HasDefaultValue(false);
            });

            // UserProfile
            modelBuilder.Entity<UserProfile>(e =>
            {
                e.HasKey(x => x.ProfileId);
                e.HasOne(x => x.User)
                 .WithOne(u => u.Profile)
                 .HasForeignKey<UserProfile>(x => x.UserId)
                 .OnDelete(DeleteBehavior.Cascade);
            });

            // Categories
            modelBuilder.Entity<Category>(e =>
            {
                e.HasKey(x => x.CategoryId);
                e.Property(x => x.CategoryName).IsRequired();
            });

            // Seed: Categories
            modelBuilder.Entity<Category>().HasData(
                new Category { CategoryId = 1, CategoryName = "שוקולדים" },
                new Category { CategoryId = 2, CategoryName = "קפסולות" },
                new Category { CategoryId = 3, CategoryName = "מכונות קפה" },
                new Category { CategoryId = 4, CategoryName = "מארזי מתנה" }
            );

            // Seed: Products
            modelBuilder.Entity<Product>().HasData(
                new Product { ProductId = 1, ProductName = "שוקולד אגוזים", Description = "שוקולד חלב עם אגוזים קלויים", Price = 20m, UnitsInPackage = 1, CategoryId = 1 },
                new Product { ProductId = 2, ProductName = "שוקולד חלבי", Description = "שוקולד חלב קלאסי", Price = 18m, UnitsInPackage = 1, CategoryId = 1 },
                new Product { ProductId = 3, ProductName = "שוקולד מריר", Description = "שוקולד מריר איכותי 70%", Price = 22m, UnitsInPackage = 1, CategoryId = 1 },
                new Product { ProductId = 4, ProductName = "קפסולה אספרסו חזק", Description = "טעם חזק ועשיר לאספרסו", Price = 25m, UnitsInPackage = 10, CategoryId = 2 },
                new Product { ProductId = 5, ProductName = "קפסולה אספרסו חלש", Description = "טעם עדין ורך לאספרסו", Price = 25m, UnitsInPackage = 10, CategoryId = 2 },
                new Product { ProductId = 8, ProductName = "קפסולה בטעם אגוזים", Description = "קפסולות עם ניחוח אגוזי עדין", Price = 27m, UnitsInPackage = 10, CategoryId = 2 },
                new Product { ProductId = 9, ProductName = "קפסולה בטעם וניל", Description = "קפסולות עם ארומת וניל עדינה", Price = 27m, UnitsInPackage = 10, CategoryId = 2 },
                new Product { ProductId = 10, ProductName = "קפסולה בטעם קרמל", Description = "קפסולות עם ניחוח קרמל מתקתק", Price = 27m, UnitsInPackage = 10, CategoryId = 2 },
                new Product { ProductId = 11, ProductName = "קפסולה בטעם שוקולד", Description = "קפסולות עם ניחוח שוקולדי עשיר", Price = 27m, UnitsInPackage = 10, CategoryId = 2 },
                new Product { ProductId = 12, ProductName = "קפסולה דקפאין", Description = "קפסולות דקפאין בטעם מאוזן", Price = 26m, UnitsInPackage = 10, CategoryId = 2 },
                new Product { ProductId = 13, ProductName = "מכונת קפה צבע זהב", Description = "מכונת קפה מעוצבת בגוון זהב", Price = 799m, UnitsInPackage = 1, CategoryId = 3 },
                new Product { ProductId = 14, ProductName = "מכונת קפה צבע שחור", Description = "מכונת קפה אלגנטית בגוון שחור", Price = 799m, UnitsInPackage = 1, CategoryId = 3 },
                new Product { ProductId = 6, ProductName = "מארז מתנה כוסות+פולי קפה", Description = "סט כוסות קפה עם פולי קפה טריים", Price = 180m, UnitsInPackage = 1, CategoryId = 4 },
                new Product { ProductId = 7, ProductName = "מארז מתנה מקציף+כוסות", Description = "מקציף חלב איכותי עם סט כוסות", Price = 250m, UnitsInPackage = 1, CategoryId = 4 },
                new Product { ProductId = 15, ProductName = "מארז מתנה קפסולות קפה צבעוניות", Description = "מארז קפסולות מגוון צבעוני", Price = 150m, UnitsInPackage = 1, CategoryId = 4 },
                new Product { ProductId = 16, ProductName = "מארז מתנה שוקולד+כוסות", Description = "סט כוסות עם מבחר שוקולדים", Price = 160m, UnitsInPackage = 1, CategoryId = 4 },
                new Product { ProductId = 17, ProductName = "מארז מתנה שוקולד+קפסולות", Description = "מארז משולב שוקולדים וקפסולות", Price = 190m, UnitsInPackage = 1, CategoryId = 4 }
            );
            // Messages
            modelBuilder.Entity<Message>(e =>
            {
                e.HasKey(m => m.MessageId);
                e.Property(m => m.Subject).HasMaxLength(200);
                e.Property(m => m.Content).HasColumnType("nvarchar(max)");
                e.Property(m => m.IsRead).HasDefaultValue(false);
                e.Property(m => m.CreatedAt).HasDefaultValueSql("GETUTCDATE()");

                e.HasOne(m => m.FromUser)
                 .WithMany() // לא חייבים רשימת הודעות ב־User
                 .HasForeignKey(m => m.FromUserId)
                 .OnDelete(DeleteBehavior.Cascade);

                e.HasOne(m => m.ToUser)
                 .WithMany()
                 .HasForeignKey(m => m.ToUserId)
                 .OnDelete(DeleteBehavior.Restrict);
            });

        }


        // פונקציה שממירה מחרוזת ל-OrderStatus
        private static OrderStatus ConvertStatusStringToEnum(string status)
        {
            return status switch
            {
                "Pending" => OrderStatus.התקבל,
                "Processing" => OrderStatus.בטיפול,
                "Paid" => OrderStatus.שולם,
                "Completed" => OrderStatus.הושלם,
                _ => Enum.Parse<OrderStatus>(status) // אם כבר בעברית
            };
        }
    }
}
