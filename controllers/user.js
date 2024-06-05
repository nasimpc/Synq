const User = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const secretkey = process.env.JWT_SECRET_KEY;

function isStringNotValid(string) {
    let result = (string == undefined || string.length === 0) ? true : false;
    return result;
}
function generateAccessToken(id, name) {
    return jwt.sign({ userId: id, name: name }, secretkey);
}

exports.addUser = async (req, res, nex) => {
    try {
        const { name, email, password } = req.body;
        if (isStringNotValid(name) || isStringNotValid(email) || isStringNotValid(password)) {
            return res.status(400).json({ err: "Something is missing" })
        }
        const saltrounds = 5;
        const hashedPassword = await bcrypt.hash(password, saltrounds);
        const user = await User.create({ name, email, password: hashedPassword });
        res.status(201).json({ message: 'Successfuly create new user', token: generateAccessToken(user.dataValues.id, user.dataValues.name) });

    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Interenal Server err' });
    }
}
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (isStringNotValid(email) || isStringNotValid(password)) {
            return res.status(400).json({ message: "Email id or password is missing", success: false })
        }
        const user = await User.findAll({ where: { email } })
        if (user.length > 0) {
            bcrypt.compare(password, user[0].password, (err, result) => {
                if (err) {
                    res.status(500).json({ success: false, message: "Something went wrong" })
                }
                if (result == true) {
                    res.status(200).json({ success: true, message: "User logged in sucessfully", token: generateAccessToken(user[0].id, user[0].name) })
                }
                else {
                    return res.status(400).json({ success: false, message: "Password is incorrect" })
                }
            })
        }
        else {
            return res.status(404).json({ success: false, message: "User not found" })
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: err, success: false })

    }
}


exports.getcurrentuser = async (req, res, nex) => {
    const user = req.user;
    res.json({ userId: user.id, user });
}
exports.getAlluser = async (req, res, nex) => {
    try {
        const user = req.user;
        const users = await User.findAll({
            attributes: ['id', 'name'],
            where: {
                id: {
                    [Op.not]: user.id
                }
            }
        });
        return res.status(200).json({ users, message: "All users succesfully fetched" })

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Internal Server err!' })
    }
}

