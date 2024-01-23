const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { createServer } = require("http");
const { Server } = require("socket.io");

const PORT = process.env.PORT;

const bodyParser = require('body-parser');
const sequelize = require('./util/database');
const User = require('./models/users');
const Chat = require('./models/chats');
//const Forgotpasswords = require('./models/forgotpasswords');

const websocketService = require('./services/websocket');

const maninRoute = require('./routes/intro');
const userRoute = require('./routes/user');
const chatRoute = require('./routes/chat');

const app = express();
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],

}));

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: ["https://admin.socket.io",],
        credentials: true
    }
});
io.on('connection', websocketService)

app.use(bodyParser.json({ extended: false }));
app.use(express.static('public'));

Chat.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Chat);

app.use('/chat', chatRoute);
app.use('/user', userRoute)
app.use(maninRoute);

Chat.belongsTo(User, { constraints: true });
User.hasMany(Chat);

async function initiate() {
    try {
        await sequelize.sync();
        httpServer.listen(PORT, () => {
            console.log(`Server is running at ${PORT}`);
        });
    } catch (error) {
        console.log(error);
    }
}
initiate();