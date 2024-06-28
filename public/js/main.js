const socket = io(window.location.origin);
var currentGroupId = 0;
var currentUserId;
var groupCreate = 1;
socket.on('message', (groupId) => {
    if (currentGroupId == groupId) {
        showChats();
    }
});

async function myFunction(groupId) {
    currentGroupId = groupId
    if (groupId == 0) {
        document.getElementById('curr_group_name').innerHTML = "Common Group";
        document.getElementById('admin_control').className = "invisible";
        document.getElementById('curr_group_img').setAttribute('src', 'https://picsum.photos/seed/200/200');

    }
    else {

        let group = await axios.get(`../group/get-group?groupId=${groupId}`);
        if (group.data.group.AdminId == currentUserId) {
            document.getElementById('admin_control').className = "btn btn-info";
        }
        else {
            document.getElementById('admin_control').className = "invisible";
        }
        document.getElementById('curr_group_name').innerHTML = group.data.group.name;
        document.getElementById('curr_group_img').setAttribute('src', `https://picsum.photos/seed/${Number(group.data.group.id) + 40}/200`);

    }
    showChats();

}

document.getElementById('chat-category').addEventListener('change', () => {
    if (document.getElementById('chat-category').value == "image") {
        document.getElementById('chat').type = "file";
        document.getElementById('chat').setAttribute('accept', 'image/*');
    } else {
        document.getElementById('chat').type = "text";
        document.getElementById('chat').removeAttribute('accept');

    }
});

var token = localStorage.getItem('token');
create_group.addEventListener('click', showCreateGroupModel);
form_submit.addEventListener('click', createGroup);
admin_control.addEventListener('click', showEditGroupModel);
buy_premium.addEventListener('click', buyPremiumPermission);

window.addEventListener("DOMContentLoaded", async () => {
    //checking for pro sub
    const getUserResponse = await axios.get('/user/get-user', { headers: { "Authorization": token } });
    let { userId, isPremiumUser } = getUserResponse.data;
    currentUserId = userId;
    if (isPremiumUser == 1) {
        document.getElementById('logo_name').innerHTML = "ChatJoy pro";
        document.getElementById('create_group').className = "bg-info  text-center p-2 m-2 rounded-2";
        document.getElementById('buy_premium').className = "bg-info  text-center p-2 m-2 rounded-2 collapse";
    }

    let res = await axios.get(`../group/get-groups`, { headers: { "Authorization": token } });
    for (var i = 0; i < res.data.groups.length; i++) {
        showGroupOnScreen(res.data.groups[i]);

    }
    showChats();
});

async function buyPremiumPermission(e) {
    if (confirm("buy premium member ship:5000rs") == true) {
        document.getElementById('logo_name').innerHTML = "ChatJoy pro";
        document.getElementById('create_group').className = "bg-info  text-center p-2 m-2 rounded-2";
        document.getElementById('buy_premium').className = "bg-info  text-center p-2 m-2 rounded-2 collapse";
        let obj = { currentUserId }
        await axios.post(`/purchase/buy-premium`, obj, { headers: { "Authorization": token } });
    }

}

function showGroupOnScreen(group) {
    if (group.GroupMembers.status == 0) {
        var a = document.querySelector('#group_container');
        a.innerHTML += `<div id="${group.id}"  onclick="myFunction(${group.id})" class="container d-flex align-items-center justify-content-between bg-light p-2 m-1 rounded-2">
    <img src="https://picsum.photos/seed/${Number(group.id) + 40}/200" alt="Profile Picture" class="rounded-circle"
                    style="width: 50px; height: 50px;">
                <strong class="mb-1">${group.name}</strong>
                <button onclick="acceptRequest(event)" >accept</button>
                <button onclick="rejectRequest(event)" >reject</button>
                </div>`;
    }
    else {
        var a = document.querySelector('#group_container');
        a.innerHTML += `<div id="${group.id}" data-group_members_id="1" onclick="myFunction(${group.id})" class="container d-flex align-items-center justify-content-between bg-light p-2 m-1 rounded-2">
    <img src="https://picsum.photos/seed/${Number(group.id) + 40}/200" alt="Profile Picture" class="rounded-circle"
                    style="width: 50px; height: 50px;">
                <strong class="mb-1">${group.name}</strong>
                </div>`;

    }


}

async function send(e) {
    try {
        e.preventDefault();
        if (document.getElementById('chat-category').value == "text") {
            const chat = event.target.chat.value;
            const obj = { chat }
            await axios.post(`/chat/add-chat`, obj, { headers: { "Authorization": token, "groupID": currentGroupId } });
        } else {

            const file = event.target.chat.files[0]
            if (file && file.type.startsWith('image/')) {
                const formData = new FormData();
                formData.append('image', file);
                formData.append('GroupId', currentGroupId)
                await axios.post('chat/add-chatImage', formData, { headers: { "Authorization": token, "groupID": currentGroupId } })
            } else {
                alert('Please select a valid image file.');
            }
        }
        chat_form.reset();
        socket.emit('new-message', currentGroupId);
        showChats();
    }
    catch (err) {
        console.log(err);
        alert(err.response.data.message);
    }

}


function showChatOnScreen(chats) {

    let pos = "start";
    let currMsg;
    var a = document.querySelector('#chat_container');
    a.innerHTML = "";
    chats.forEach((chat) => {
        if (chat.userId == currentUserId) { pos = "end"; } else { pos = "start"; }
        if (chat.isImage) {
            currMsg = `<img src="${chat.message}" style="height: 40vh;"></img>`;
        }
        else { currMsg = `<p class="my-0">${chat.message}</p>` }
        const date = new Date(chat.date_time);
        const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        const formattedDate = date.toLocaleString('en-US', options);

        var chatdiv = document.createElement('div');
        chatdiv.id = chat['id'];
        chatdiv.innerHTML = `<div class="card p-2 float-${pos} rounded-3 bg-info-subtle">
            <p class="text-primary my-0"><small>${chat.name}</small></p>
            ${currMsg}
            <small class="text-muted text-end">${formattedDate}</small>
        </div>`
        a.appendChild(chatdiv);
    })
}


async function showChats() {
    try {
        let currChats
        const chats = localStorage.getItem(`chatHistory${currentGroupId}`);
        if (chats && chats.length != 2) {
            const parsedChatHistory = JSON.parse(chats);
            const lastMessageId = parsedChatHistory[parsedChatHistory.length - 1].messageId;
            const APIresponse = await axios.get(`chat/get-chats?lastChatId=${lastMessageId}`, { headers: { "groupId": currentGroupId } });
            const apiChats = APIresponse.data.chats
            const mergedChats = [...parsedChatHistory, ...apiChats];
            currChats = mergedChats.slice(-100);
        } else {
            const APIresponse = await axios(`chat/get-chats?lastChatId=0`, { headers: { "groupId": currentGroupId } });
            const apiChats = APIresponse.data.chats
            currChats = apiChats.slice(-100);
        }
        localStorage.setItem(`chatHistory${currentGroupId}`, JSON.stringify(currChats));
        showChatOnScreen(currChats);

    } catch (err) {
        console.log(err);
        alert(err.response.data.message);
    }
}
async function showCreateGroupModel() {
    try {
        user_list.parentElement.classList.remove('d-none');

        const usersRes = await axios.get('user/get-users', { headers: { "Authorization": token } });
        const { users } = usersRes.data;
        user_list.innerHTML = "";
        users.forEach((user) => {
            user_list.innerHTML += `                                    
        <li class="list-group-item  d-flex  justify-content-between">
            <div class="d-flex  align-items-center justify-content-between">
                <img src="https://picsum.photos/seed/${Number(user.id) + 100}/200" alt="Profile Picture"
                    class="rounded-circle me-3" style="width: 35px; height: 35px;">
                <h6><strong class="mb-1">${user.name}</strong></h6>
            </div>
            <input type="checkbox" class="form-check-inline" name="users" value="${user.id}">
        </li>`
        })
        groupCreate = 1;
    } catch (err) {
        console.log(err);
        alert(err.response.data.message);
    }
}
async function createGroup(e) {
    let group;
    try {

        e.preventDefault();
        const groupName = create_group_form.querySelector('#form_name').value;
        const selectedUsers = Array.from(user_list.querySelectorAll('input[name="users"]:checked'))
            .map(checkbox => checkbox.value);
        const data = {
            name: groupName,
            membersIds: selectedUsers
        }
        if (groupCreate == 1) {

            group = await axios.post('group/create-group', data, { headers: { "Authorization": token } });
            alert("Group successfully created")

        }
        else {
            group = await axios.post(`group/update-group?groupId=${currentGroupId}`, data, { headers: { "Authorization": token } });
            form_submit.innerHTML = "Create Group";
            form_heading.innerHTML = `Create new group`;
            groupedit = 0;
            document.getElementById('curr_group_name').innerHTML = group.data.group.name;
            await document.getElementById(`${currentGroupId}`).remove();
            alert("Group successfully updated")
        }
        create_group_form.reset();
        var myModalEl = document.getElementById('group_model');
        var modal = bootstrap.Modal.getInstance(myModalEl)
        modal.hide();
        showGroupOnScreen(group.data.group);

    } catch (err) {
        console.log(err);
        alert(err.response.data.message);
    }
}


async function showEditGroupModel(e) {
    try {
        let status;
        const groupId = currentGroupId
        user_list.parentElement.classList.remove('d-none');
        const usersResponse = await axios.get('user/get-users', { headers: { "Authorization": token } });
        const memberApi = await axios(`group/get-group-members?groupId=${groupId}`);
        const groupMebers = memberApi.data.users;
        const membersId = new Set(groupMebers.map(item => item.id));
        user_list.innerHTML = "";
        const { users } = usersResponse.data;
        users.forEach((user) => {
            if (membersId.has(user.id)) { status = "checked" } else { status = "" }
            user_list.innerHTML += `                                    
                <li class="list-group-item  d-flex  justify-content-between">
                    <div class="d-flex  align-items-center justify-content-between">
                        <img src="https://picsum.photos/seed/${Number(user.id) + 100}/200" alt="Profile Picture"
                            class="rounded-circle me-3" style="width: 35px; height: 35px;">
                        <h6><strong class="mb-1">${user.name}</strong></h6>
                    </div>
                    <input type="checkbox" class="form-check-inline" name="users" value="${user.id}" ${status}>
                </li>`
        })

        const group = await axios(`group/get-group?groupId=${groupId}`);
        document.getElementById('form_name').value = group.data.group.name;
        form_submit.innerHTML = "Update Details";
        form_heading.innerHTML = `Update ${group.data.group.name} Details`;
        groupCreate = 0;
    } catch (err) {
        console.log(err);
        alert(err.response.data.message);
    }
}
async function showingProfileModel() {
    try {
        const user = await axios.get('/user/get-user', { headers: { "Authorization": token } });
        profile_model_name.innerHTML = `Name: ${user.data.user.name}`;
        profile_model_email.innerHTML = `Email: ${user.data.user.email}`;
        profile_model_phno.innerHTML = `Phno: ${user.data.user.phonenumber}`;

    } catch (error) {
        console.log(error);
        alert(error.response.data.message);
    }
}
async function acceptRequest(e) {
    try {
        let obj = { currentUserId, currentGroupId };
        if (confirm("Join the group:150rs") == true) {
            await axios.post(`/group/accept-request`, obj);
        }
    } catch (err) {
        console.log(err);
        alert(err.response.data.message);
    }
}
async function rejectRequest(e) {
    try {
        let obj = { currentUserId, currentGroupId };
        await axios.post(`/group/reject-request`, obj);
    } catch (error) {
        console.log(error);
    }
}