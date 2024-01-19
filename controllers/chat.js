const Chat = require("../models/chat");

exports.addChat = async (req, res) => {
    const chat = req.body.chat;
    try {
        await req.user.createChat({
            name: req.user.name,
            chat: chat,
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