const { CronJob } = require('cron');
const { Op } = require('sequelize');
const Chat = require('../models/chats');
const ArchivedChat = require('../models/archeived-chat');
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

    const recordsToArchive = await Chat.findAll({
      where: {
        date_time: {
          [Op.lt]: tenDaysAgo,
        },
      },
    });


    await Promise.all(
      recordsToArchive.map(async (record) => {
        await ArchivedChat.create({
          id: record.id,
          message: record.message,
          date_time: record.date_time,
          isImage: record.isImage,
          UserId: record.UserId,
          GroupId: record.GroupId
        });
        await record.destroy();
      })
    );
    console.log('Old records archived successfully.');
  } catch (err) {
    console.log('Error archiving old records:', err);
  }
}

