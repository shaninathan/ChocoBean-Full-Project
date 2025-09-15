using AutoMapper;
using ChocoBean.BusinessLogic.Interfaces;
using ChocoBean.DataAccess.Entities;
using ChocoBean.DataAccess.Interfaces;
using ChocoBean.DTO;

namespace ChocoBean.BusinessLogic.Services;

// =================== OrderService ===================
public class OrderService : IOrderService
{
    private readonly IOrderRepository _orders;
    private readonly IProductRepository _products;
    private readonly IMapper _mapper;

    public OrderService(IOrderRepository orders, IProductRepository products, IMapper mapper)
    {
        _orders = orders;
        _products = products;
        _mapper = mapper;
    }

    public async Task<OrderDto> CreateOrder(int userId, OrderDto order)
    {
        decimal total = 0m;
        var items = new List<OrderItem>();

        foreach (var i in order.Items)
        {
            var product = await _products.GetById(i.ProductId)
                          ?? throw new Exception($"Product with ID {i.ProductId} not found");

            var price = product.Price;
            total += price * i.Quantity;

            items.Add(new OrderItem
            {
                ProductId = product.ProductId,
                Quantity = i.Quantity,
                Price = price
            });
        }

        var entity = new Order
        {
            UserId = userId,
            OrderDate = DateTime.UtcNow,
            TotalPrice = total,
            Status = OrderStatus.התקבל,
            Items = items
        };

        entity = await _orders.Add(entity);
        return _mapper.Map<OrderDto>(entity);
    }

    public async Task<List<OrderDto>> GetMyOrders(int userId)
    {
        var list = await _orders.GetUserOrders(userId);
        return _mapper.Map<List<OrderDto>>(list);
    }

    public async Task DeleteOrder(int userId, int orderId)
    {
        var order = await _orders.GetById(orderId, userId)
                    ?? throw new Exception("Order not found");
        await _orders.Delete(order);
    }
}

// =================== ProductService ===================
public class ProductService : IProductService
{
    private readonly IProductRepository _repo;
    private readonly IMapper _mapper;

    public ProductService(IProductRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<List<ProductDto>> GetAll()
    {
        var products = await _repo.GetAll();
        return _mapper.Map<List<ProductDto>>(products);
    }

    public async Task<ProductDto?> GetById(int id)
    {
        var product = await _repo.GetById(id);
        return product == null ? null : _mapper.Map<ProductDto>(product);
    }
}

// =================== CategoryService ===================
public class CategoryService : ICategoryService
{
    private readonly ICategoryRepository _repo;
    private readonly IMapper _mapper;

    public CategoryService(ICategoryRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<List<CategoryDto>> GetAll()
    {
        var categories = await _repo.GetAll();
        return _mapper.Map<List<CategoryDto>>(categories);
    }
}
public class MessageService : IMessageService
{
    private readonly IMessageRepository _repo;
    private readonly IMapper _mapper;

    public MessageService(IMessageRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<MessageDto> SendMessage(MessageDto dto)
    {
        var msg = _mapper.Map<Message>(dto);
        await _repo.Add(msg);
        return _mapper.Map<MessageDto>(msg);
    }

    public async Task<List<MessageDto>> GetUserMessages(int userId)
    {
        var msgs = await _repo.GetUserMessages(userId);
        return _mapper.Map<List<MessageDto>>(msgs);
    }

    public async Task<List<MessageDto>> GetAdminMessages()
    {
        var msgs = await _repo.GetAdminMessages();
        return _mapper.Map<List<MessageDto>>(msgs);
    }

    public async Task MarkAsRead(int messageId)
    {
        var msg = await _repo.GetById(messageId);
        if (msg != null)
        {
            msg.IsRead = true;
            await _repo.Update(msg);
        }
    }
}
