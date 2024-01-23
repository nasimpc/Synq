const Chat = require("../models/chats");
const User = require('../models/users');
const { Op } = require('sequelize');


exports.addChat = async (req, res) => {
    const chat = req.body.chat;
    try {
        await req.user.createChat({
            message: chat,
        });
        res.status(200).json({
            succes: true,
            message: "Message Added to Database",
            newChat: { name: req.user.name, chat: chat },
        });
    } catch (err) {
        console.log(err);
        res
            .status(500)
            .json({ success: false, message: "Unable to add chat to DataBase" });
    }
};
exports.getChats = async (req, res, next) => {
    try {

        const chats = await Chat.findAll({});
        res.status(200).json({
            allChats: chats,

        });
    }
    catch (err) {
        console.log('get-chats is failing', JSON.stringify(err));
        res.status(500).json({ error: err });
    }
}
exports.getcurrentuser = async (request, response, next) => {
    const user = request.user;
    response.json({ userId: user.id, user });
}
exports.getAllChatHistory = async (request, response, next) => {
    try {

        const lastMessageId = request.query.lastMessageId || 0;
        const chatsRaw = await Chat.findAll({
            include: [
                {
                    model: User,
                    attibutes: ['id', 'name', 'date_time']
                }
            ],
            order: [['date_time', 'ASC']],
            where: {
                // GroupId: null,
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
        return response.status(200).json({ chats, message: "User chat History Fetched" })

    } catch (error) {
        console.log(error);
        return response.status(500).json({ message: 'Internal Server error!' })
    }
}