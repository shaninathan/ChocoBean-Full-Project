using ChocoBean.DataAccess.Entities;

public interface IMessageRepository
{
    Task<Message> Add(Message msg);
    Task<List<Message>> GetUserMessages(int userId);
    Task<List<Message>> GetAdminMessages();
    Task<Message?> GetById(int id);
    Task Update(Message msg);
}
