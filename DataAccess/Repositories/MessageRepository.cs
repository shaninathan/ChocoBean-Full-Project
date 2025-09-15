using ChocoBean.DataAccess.Context;
using ChocoBean.DataAccess.Entities;
using ChocoBean.DataAccess.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;


public class MessageRepository : IMessageRepository
{
    private readonly ChocoBeanDbContext _context;

    public MessageRepository(ChocoBeanDbContext context)
    {
        _context = context;
    }

    public async Task<Message> Add(Message msg)
    {
        await _context.Messages.AddAsync(msg);
        await _context.SaveChangesAsync();
        return msg;
    }

    public async Task<List<Message>> GetUserMessages(int userId)
    {
        return await _context.Messages
            .Where(m => m.FromUserId == userId || m.ToUserId == userId)
            .ToListAsync();
    }

    public async Task<List<Message>> GetAdminMessages()
    {
        return await _context.Messages
            .Where(m => m.ToUserId == null) // הודעות שנשלחו לאדמין
            .ToListAsync();
    }

    public async Task<Message?> GetById(int id)
    {
        return await _context.Messages.FindAsync(id);
    }

    public async Task Update(Message msg)
    {
        _context.Messages.Update(msg);
        await _context.SaveChangesAsync();
    }
}
