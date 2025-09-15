using AutoMapper;
using ChocoBean.DataAccess.Context;
using ChocoBean.DataAccess.Entities;
using ChocoBean.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace ChocoBean.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class OrdersController : ControllerBase
    {
        private readonly ChocoBeanDbContext _context;
        private readonly IMapper _mapper;

        public OrdersController(ChocoBeanDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // יצירת הזמנה
        [HttpPost]
        public async Task<IActionResult> Create(OrderDto request)
        {
            var userId = GetUserId();

            var order = new Order
            {
                UserId = userId,
                OrderDate = DateTime.UtcNow,
                Status = Enum.TryParse<OrderStatus>(request.Status, out var st) ? st : OrderStatus.התקבל,
                TotalPrice = request.TotalPrice,
                Items = request.Items.Select(i => new OrderItem
                {
                    ProductId = i.ProductId,
                    Quantity = i.Quantity,
                    Price = i.Price
                }).ToList()
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            // טעינת User לפני מיפוי ל-DTO
            await _context.Entry(order).Reference(o => o.User).LoadAsync();

            var dto = _mapper.Map<OrderDto>(order);
            return Ok(dto);
        }

        // ההזמנות שלי
        [HttpGet("mine")]
        public async Task<IActionResult> GetMine()
        {
            var userId = GetUserId();

            var orders = await _context.Orders
                .Include(o => o.Items).ThenInclude(i => i.Product)
                .Include(o => o.User) // חשוב - כדי שהDTO לא ייפול
                .Where(o => o.UserId == userId)
                .ToListAsync();

            var dto = _mapper.Map<List<OrderDto>>(orders);
            return Ok(dto);
        }

        // כל ההזמנות (Admin בלבד)
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAll()
        {
            var orders = await _context.Orders
                .Include(o => o.Items).ThenInclude(i => i.Product)
                .Include(o => o.User)
                .ToListAsync();

            var dto = _mapper.Map<List<OrderDto>>(orders);
            return Ok(dto);
        }

        // עדכון סטטוס (Admin בלבד)
        [HttpPut("{orderId}/status")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateStatus(int orderId, [FromBody] string status)
        {
            var order = await _context.Orders.FindAsync(orderId);
            if (order == null) return NotFound();

            if (!Enum.TryParse<OrderStatus>(status, out var st))
                return BadRequest("Invalid status");

            order.Status = st;
            await _context.SaveChangesAsync();

            // טעינת User לפני מיפוי ל-DTO
            await _context.Entry(order).Reference(o => o.User).LoadAsync();

            var dto = _mapper.Map<OrderDto>(order);
            return Ok(dto);
        }

        // מחיקת הזמנה (רק המשתמש עצמו)
        [HttpDelete("{orderId}")]
        public async Task<IActionResult> Delete(int orderId)
        {
            var userId = GetUserId();
            var order = await _context.Orders
                .Where(o => o.UserId == userId && o.OrderId == orderId)
                .FirstOrDefaultAsync();

            if (order == null) return NotFound();

            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();

            return Ok();
        }

        // Utility - שליפת userId מה־JWT
        private int GetUserId()
        {
            var userIdClaim = User.FindFirst("userId")
                ?? User.FindFirst(ClaimTypes.NameIdentifier)
                ?? User.FindFirst("nameid");

            if (userIdClaim == null)
                throw new Exception("UserId claim missing in token");

            return int.Parse(userIdClaim.Value);
        }
    }
}
