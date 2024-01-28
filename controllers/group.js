const Group = require('../models/groups');

exports.createGroup = async (request, response, next) => {
    try {

        const user = request.user;
        const { name, membersNo, membersIds } = request.body;
        const group = await user.createGroup({
            name,
            membersNo,
            AdminId: user.id
        })
        membersIds.push(user.id);
        await group.addUsers(membersIds.map((ele) => {
            return Number(ele)
        }));
        return response.status(200).json({ group, message: "Group is succesfylly created" })

    }
    catch (err) {
        console.log(err)
        response.status(500).json({
            error: err
        })
    }
}
exports.getGroups = async (req, res, next) => {
    try {

        const user = req.user;
        const groups = await user.getGroups();
        return res.status(200).json({ groups, message: "groups fetched succesfully" })
    }
    catch (err) {
        console.log('get-groups is failing', JSON.stringify(err));
        res.status(500).json({ error: err });
    }
}
exports.getGroupbyId = async (request, response, next) => {
    try {
        const { groupId } = request.query;
        const group = await Group.findOne({ where: { id: Number(groupId) } });
        response.status(200).json({ group, message: "Group details succesfully fetched" })
    } catch (error) {
        console.log(error);
        return response.status(500).json({ message: 'Internal Server error!' })
    }
}

exports.getGroupMembersbyId = async (request, response, next) => {
    try {
        const { groupId } = request.query;
        const group = await Group.findOne({ where: { id: Number(groupId) } });
        const AllusersData = await group.getUsers();
        const users = AllusersData.map((ele) => {
            return {
                id: ele.id,
                name: ele.name,
            }
        })

        response.status(200).json({ users, message: "Group members name succesfully fetched" })
    } catch (error) {
        console.log(error);
        return response.status(500).json({ message: 'Internal Server error!' })
    }
}
exports.updateGroup = async (request, response, next) => {
    try {
        const user = request.user;
        const { groupId } = request.query;
        const group = await Group.findOne({ where: { id: Number(groupId) } });
        const { name, membersNo, membersIds } = request.body;
        const updatedGroup = await group.update({
            name,
            membersNo,
            AdminId: user.id
        })
        membersIds.push(user.id);
        await updatedGroup.setUsers(null);
        await updatedGroup.addUsers(membersIds.map((ele) => {
            return Number(ele)
        }));
        return response.status(200).json({ updatedGroup, message: "Group is succesfylly updated" })

    } catch (error) {
        console.log(error);
        return response.status(500).json({ message: 'Internal Server error!' })
    }
}