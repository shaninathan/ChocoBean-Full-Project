using ChocoBean.DTO;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ChocoBean.BusinessLogic.Interfaces
{
    public interface IMessageService
    {
        Task<MessageDto> SendMessage(MessageDto dto);
        Task<List<MessageDto>> GetUserMessages(int userId);
        Task<List<MessageDto>> GetAdminMessages();
        Task MarkAsRead(int messageId);
    }
}
