const Chat = require("../models/chats");
const User = require('../models/users');
const { Op } = require('sequelize');
const awsService = require('../services/awsS3Service');

exports.addChat = async (req, res) => {
    const chat = req.body.chat;
    let groupId = req.header('groupID');
    groupId = Number(groupId);
    if (groupId == 0) { groupId = null; }
    try {
        await req.user.createChat({ message: chat, GroupId: groupId });
        res.status(200).json({
            succes: true,
            message: "Message Added to Database",
            newChat: { name: req.user.name, chat: chat },
        });
    } catch (err) {
        console.log(err);
        res.status(500)
            .json({ success: false, message: "Unable to add chats to DataBase" });
    }
};
exports.getChats = async (req, res) => {
    try {
        const chats = await Chat.findAll({});
        res.status(200).json({
            allChats: chats,
        });
    }
    catch (err) {
        console.log('get-chats is failing', JSON.stringify(err));
        res.status(500).json({ err: err });
    }
}

exports.getAllChatHistory = async (req, res) => {
    try {

        let groupId = req.header('groupId');
        groupId = Number(groupId);
        if (groupId == 0) { groupId = null; }
        const lastMessageId = req.query.lastMessageId || 0;
        const chatsRaw = await Chat.findAll({
            include: [
                {
                    model: User,
                    attibutes: ['id', 'name', 'date_time']
                }
            ],
            order: [['date_time', 'ASC']],
            where: {
                GroupId: groupId,
                id: {
                    [Op.gt]: lastMessageId
                }
            }
        });
        const chats = chatsRaw.map((ele) => {
            const user = ele.User;
            return {
                messageId: ele.id,
                message: ele.message,
                isImage: ele.isImage,
                name: user.name,
                userId: user.id,
                date_time: ele.date_time
            }
        })
        return res.status(200).json({ chats, message: "User chat History Fetched" })

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Internal Server err!' })
    }
}
exports.addChatImage = async (req, res) => {
    try {
        const user = req.user;
        const image = req.file;
        let groupId = req.header('groupID');
        groupId = Number(groupId);
        if (groupId == 0) { groupId = null; }
        const filename = `chat-images/group${groupId}/user${user.id}/${Date.now()}_${image.originalname}`;
        const imageUrl = await awsService.uploadToS3(image.buffer, filename)
        await user.createChat({ message: imageUrl, GroupId: groupId, isImage: true })
        return res.status(200).json({ message: "image saved to database succesfully" })

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Internal Server err!' })
    }
}

