const User = require('../models/users');
const ForgotPasswords = require('../models/forgotpasswords');


const Sib = require('sib-api-v3-sdk');
const client = Sib.ApiClient.instance;
client.authentications['api-key'].apiKey = process.env.SIB_API_KEY;
const bcrypt = require('bcrypt');
const tranEmailApi = new Sib.TransactionalEmailsApi();

exports.resetpasswordform = async (req, res, nex) => {
    try {
        let id = req.params.id;
        const passwordreset = await ForgotPasswords.findByPk(id);
        if (passwordreset.isactive) {
            passwordreset.isactive = false;
            await passwordreset.save();
            res.sendFile('resetpass.html', { root: 'views' })
        } else {
            return res.status(401).json({ message: "Link has been expired" })
        }

    } catch (err) {
        console.log(err)

    }
}

exports.requestresetpassword = async (req, res, nex) => {
    try {

        const { email } = req.body;
        const user = await User.findOne({
            where: {
                email: email
            }
        });
        if (user) {
            const sender = {
                email: 'nasimpcm@gmail.com',
                name: 'Nasim'
            }
            const receivers = [
                {
                    email: email
                }
            ]
            const resetres = await user.createForgotpassword({});
            const { id } = resetres;
            const mailres = await tranEmailApi.sendTransacEmail({
                sender,
                to: receivers,
                subject: "Reset Your password",
                htmlContent: `
              <!DOCTYPE html>
                <html>
                <head>
                    <title>Password Reset</title>
                </head>
                <body>
                    <h1>Reset Chat-app password</h1>
                    <p>Click the button below to reset your password:</p>
                    <button><a href="${process.env.WEBSITE}/password/reset/{{params.role}}">Reset Password</a></button>
                </body>
                </html>`, params: {
                    role: id
                }
            })
            res.status(200).json({ message: 'Password reset email sent' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }


    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Interenal Server err' });
    }
}

exports.resetpassword = async (req, res, nex) => {
    try {

        const { resetid, password } = req.body;

        const passwordreset = await ForgotPasswords.findByPk(resetid);
        //console.log(passwordreset);

        const currentTime = new Date();
        const createdAtTime = new Date(passwordreset.createdAt);
        const timeDifference = currentTime - createdAtTime;
        const timeLimit = 5 * 60 * 1000;
        if (timeDifference <= timeLimit) {
            const hashedPassword = await bcrypt.hash(password, 10);

            await User.update(
                {
                    password: hashedPassword
                },
                {
                    where: { id: passwordreset.dataValues.UserId }
                }
            );
            res.status(200).json({ message: "Password reset successful." });
        } else {
            res.status(403).json({ message: "Link has expired" });
        }



    } catch (err) {
        console.log("err resetting password:", err);
        res.status(500).json({ message: "Internal server err" });
    }
};

