const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { createServer } = require("http");
const { Server } = require("socket.io");
const sequelize = require('./util/database');

const PORT = process.env.PORT;

const User = require('./models/users');
const GroupMember = require('./models/groupMembers');
const Chat = require('./models/chats');
const Group = require('./models/groups');

const maninRoute = require('./routes/intro');
const purchaseRoute = require('./routes/purchase');
const userRoute = require('./routes/user');
const chatRoute = require('./routes/chat');
const groupRoute = require('./routes/group');

const cronService = require('./services/cronService');
cronService.cronSchedule;

const app = express();
app.use(cors({ origin: '*', methods: ['GET', 'POST'], }));

const httpServer = createServer(app);
const io = new Server(httpServer);
io.on('connection', (socket) => {
    socket.on('new-message', (groupId) => {
        socket.broadcast.emit('message', groupId);
    })
});

app.use(express.json());
app.use(express.static('public'));

app.use('/chat', chatRoute);
app.use('/purchase', purchaseRoute);
app.use('/user', userRoute)
app.use('/group', groupRoute);
app.use(maninRoute);

Chat.belongsTo(User);
User.hasMany(Chat);

User.belongsToMany(Group, { through: GroupMember });
Group.belongsToMany(User, { through: GroupMember });

Group.belongsTo(User, { foreignKey: 'AdminId' })

Group.hasMany(Chat);
Chat.belongsTo(Group);

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