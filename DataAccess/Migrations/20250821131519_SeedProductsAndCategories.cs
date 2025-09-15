using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class SeedProductsAndCategories : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Products",
                columns: new[] { "ProductId", "CategoryId", "Description", "Price", "ProductName", "UnitsInPackage" },
                values: new object[,]
                {
                    { 8, 2, "קפסולות עם ניחוח אגוזי עדין", 27m, "קפסולה בטעם אגוזים", 10 },
                    { 9, 2, "קפסולות עם ארומת וניל עדינה", 27m, "קפסולה בטעם וניל", 10 },
                    { 10, 2, "קפסולות עם ניחוח קרמל מתקתק", 27m, "קפסולה בטעם קרמל", 10 },
                    { 11, 2, "קפסולות עם ניחוח שוקולדי עשיר", 27m, "קפסולה בטעם שוקולד", 10 },
                    { 12, 2, "קפסולות דקפאין בטעם מאוזן", 26m, "קפסולה דקפאין", 10 },
                    { 13, 3, "מכונת קפה מעוצבת בגוון זהב", 799m, "מכונת קפה צבע זהב", 1 },
                    { 14, 3, "מכונת קפה אלגנטית בגוון שחור", 799m, "מכונת קפה צבע שחור", 1 },
                    { 15, 4, "מארז קפסולות מגוון צבעוני", 150m, "מארז מתנה קפסולות קפה צבעוניות", 1 },
                    { 16, 4, "סט כוסות עם מבחר שוקולדים", 160m, "מארז מתנה שוקולד+כוסות", 1 },
                    { 17, 4, "מארז משולב שוקולדים וקפסולות", 190m, "מארז מתנה שוקולד+קפסולות", 1 }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 10);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 11);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 12);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 13);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 14);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 15);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 16);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 17);
        }
    }
}
