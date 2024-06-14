const Chat = require('../models/chats');
const ArchivedChat = require('../models/archeivedChat');
const cron = require('node-cron');
const { Op } = require('sequelize');

exports.cronSchedule = cron.schedule('0 * * * *', () => {
  archiveOldChats();
});

async function archiveOldChats() {
  try {
    const tenthDay = new Date();
    tenthDay.setDate(tenthDay.getDate() - 10);

    const chatsToArchive = await Chat.findAll({
      where: { date_time: { [Op.lt]: tenthDay, }, },
    });

    await Promise.all(
      chatsToArchive.map(async (chat) => {
        await ArchivedChat.create({
          id: chat.id,
          message: chat.message,
          date_time: chat.date_time,
          isImage: chat.isImage,
          UserId: chat.UserId,
          GroupId: chat.GroupId
        });
        await chat.destroy();
      })
    );
    console.log('Old chats archived successfully.');
  } catch (err) {
    console.log('Error archiving old chats:', err);
  }
}

