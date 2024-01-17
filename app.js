const express = require('express');
const cors = require('cors');
require('dotenv').config();

const PORT = process.env.PORT;

const bodyParser = require('body-parser');
const sequelize = require('./util/database');
const User = require('./models/users');
//const Forgotpasswords = require('./models/forgotpasswords');

const maninRoute = require('./routes/intro');
const userRoute = require('./routes/user');

const app = express();
app.use(cors());

app.use(bodyParser.json({ extended: false }));
app.use(express.static('public'));

app.use('/user', userRoute)
app.use(maninRoute)

async function initiate() {
    try {
        await sequelize.sync();
        app.listen(PORT, () => {
            console.log(`Server is running at ${PORT}`);
        });
    } catch (error) {
        console.log(error);
    }
}
initiate();