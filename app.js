const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { createServer } = require("http");
const { Server } = require("socket.io");

const PORT = process.env.PORT;

const bodyParser = require('body-parser');
const sequelize = require('./util/database');

const User = require('./models/users');
const Forgotpasswords = require('./models/forgotpasswords');
const GroupMember = require('./models/groupmembers');
const Chat = require('./models/chats');
const Group = require('./models/groups');


const maninRoute = require('./routes/intro');
const userRoute = require('./routes/user');
const chatRoute = require('./routes/chat');
const groupRoute = require('./routes/group');
const passwordRoutes = require('./routes/resetpass');

const cronService = require('./services/cronService');
cronService.cronSchedule;

const httpServer = createServer(app);
const io = new Server(httpServer);
io.on('connection', (socket) => {
    socket.on('new-message', (groupId) => {
        socket.broadcast.emit('message', groupId);
    })
});

const app = express();
app.use(cors({ origin: '*', methods: ['GET', 'POST'], }));

app.use(bodyParser.json({ extended: false }));
app.use(express.static('public'));

app.use('/chat', chatRoute);
app.use('/user', userRoute)
app.use('/group', groupRoute);
app.use('/password', passwordRoutes);
app.use(maninRoute);

Chat.belongsTo(User);
User.hasMany(Chat);

Forgotpasswords.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Forgotpasswords);

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