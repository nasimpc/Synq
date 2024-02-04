const Chat = require('../models/chats');
const ArchivedChat = require('../models/archeivedchat');
const { CronJob } = require('cron');
const { Op } = require('sequelize');

exports.job = new CronJob(
  '0 0 * * *',
  function () {
    archiveOldChats();
  },
  null,
  false,
  'Asia/Kolkata'
);

async function archiveOldChats() {
  try {
    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

    const chatsToArchive = await Chat.findAll({
      where: { date_time: { [Op.lt]: tenDaysAgo, }, },
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

