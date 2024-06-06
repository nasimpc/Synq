const User = require('../models/users');

exports.buyPremium = async (req, res) => {
    let userId = req.body.currentUserId;
    const user = await User.findByPk(userId);
    let availableCoins = Number(user.availableCoins) - Number(5000);
    await User.update({ availableCoins, isPremiumUser: true }, { where: { id: userId } });
}
