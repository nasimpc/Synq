const { where } = require('sequelize');
const Groupmember = require('../models/groupMembers');
const Group = require('../models/groups');
const User = require('../models/users');

exports.createGroup = async (req, res) => {
    try {

        const user = req.user;
        const { name, membersIds } = req.body;
        const group = await user.createGroup({
            name,
            count: 1,
            AdminId: user.id

        })
        await group.addUsers(membersIds.map((ele) => {
            return Number(ele)
        }));
        await Groupmember.update({ status: 1 }, { where: { UserId: user.id, GroupId: group.dataValues.id } });
        res.status(200).json({ group, message: "Group is succesfylly created" })

    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            err: err
        })
    }
}

exports.getGroupbyId = async (req, res) => {
    try {
        const { groupId } = req.query;
        const group = await Group.findOne({ where: { id: Number(groupId) } });
        res.status(200).json({ group, message: "Group details succesfully fetched" })
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal Server err!' })
    }
}

exports.getGroups = async (req, res) => {
    try {

        const user = req.user;
        const groups = await user.getGroups();
        res.status(200).json({ groups, message: "groups fetched succesfully" })
    }
    catch (err) {
        console.log('get-groups is failing', JSON.stringify(err));
        res.status(500).json({ err: err });
    }
}


exports.getGroupMembersbyId = async (req, res) => {
    try {
        const { groupId } = req.query;
        const group = await Group.findOne({ where: { id: Number(groupId) } });
        const allUsersData = await group.getUsers();
        const users = allUsersData.map((ele) => {
            return {
                id: ele.id,
                name: ele.name,
            }
        })

        res.status(200).json({ users, message: "Group members name succesfully fetched" })
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal Server err!' })
    }
}
exports.updateGroup = async (req, res) => {
    try {
        const user = req.user;
        const { groupId } = req.query;
        const group = await Group.findOne({ where: { id: Number(groupId) } });
        const { name, membersIds } = req.body;
        const updatedGroup = await group.update({ name })
        membersIds.push(user.id);
        await updatedGroup.setUsers(membersIds.map((ele) => {
            return Number(ele)
        }));
        res.status(200).json({ group: updatedGroup, message: "Group succesfylly updated" })

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal Server err!' })
    }
}
exports.acceptRequest = async (req, res) => {
    try {

        let { currentUserId, currentGroupId } = req.body;
        let group = await Group.findOne({ where: { id: currentGroupId } });
        if (group.dataValues.count >= 6) {
            res.status(403).json({ success: false, message: "Group can't contain more than 6 people" });
            return
        }
        let user = await User.findOne({ where: { id: currentUserId } });
        let currCoins = user.dataValues.availableCoins;
        if (currCoins < 150) {
            res.status(403).json({ success: false, message: "User do not have min 150 coins" });
            return
        }
        await User.update({ availableCoins: currCoins - 150 }, { where: { id: currentUserId } });
        await Group.increment({ count: +1 }, { where: { id: currentGroupId } })
        await Groupmember.update(
            { status: 1 },
            {
                where: {
                    UserId: currentUserId,
                    GroupId: currentGroupId
                }
            }
        )
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal Server err!' })
    }
}
exports.rejectRequest = async (req, res) => {
    try {
        let { currentUserId, currentGroupId } = req.body;
        await Groupmember.destroy({
            where: {
                UserId: currentUserId,
                GroupId: currentGroupId
            }
        })

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal Server err!' })
    }
}