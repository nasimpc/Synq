
const socket = io(window.location.origin);

var currgroupID = 0;
socket.on('message', (groupId) => {
    if (currgroupID == groupId) {
        ShowChats();
    }
})



async function myfunction(groupId) {
    currgroupID = groupId
    console.log(groupId)
    if (groupId == 0) {
        document.getElementById('curr_group_name').innerHTML = "common";
        document.getElementById('curr_group_members').innerHTML = "all";
    }
    else {
        let group = await axios.get(`../group/get-group?groupId=${groupId}`);
        document.getElementById('curr_group_name').innerHTML = group.data.group.name;
        document.getElementById('curr_group_members').innerHTML = group.data.group.membersNo;
    }
    ShowChats();

}

var token = localStorage.getItem('token');
create_groupBtn.addEventListener('click', showingAllUser);
model_submibtn.addEventListener('click', createGroup);

window.addEventListener("DOMContentLoaded", async () => {
    let res = await axios.get(`../group/get-groups`, { headers: { "Authorization": token } });
    for (var i = 0; i < res.data.groups.length; i++) {
        showGroupOnScreen(res.data.groups[i]);

    }
});

function showGroupOnScreen(group) {
    var a = document.querySelector('#group_container')
    var groupcard = document.createElement('div');
    groupcard.className = "card"
    //groupcard.onclick = function () { myfunction(group['id']); };
    groupcard.setAttribute("onclick", `myfunction(${group['id']})`);
    groupcard.id = group['id'];
    var groupHeading = document.createElement('h3');
    groupHeading.innerHTML = group['name']
    groupcard.appendChild(groupHeading)
    var membersnodiv = document.createElement('small');
    membersnodiv.innerHTML = group['membersNo'];
    groupcard.appendChild(membersnodiv)
    a.appendChild(groupcard);

}

async function send(e) {
    e.preventDefault();
    const chat = event.target.chat.value;

    const obj = {
        chat: chat,

    }
    let res = await axios.post(`/chat/add-chat`, obj, { headers: { "Authorization": token, "groupID": currgroupID } });

    socket.emit('new-message', currgroupID);

    ShowChats();

}


function showChatOnScreen(chats) {
    var a = document.querySelector('#chat_container')
    a.innerHTML = "";
    chats.forEach((chat) => {
        const date = new Date(chat.date_time);
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        const formattedDate = date.toLocaleString('en-US', options);

        var chatdiv = document.createElement('div');
        chatdiv.id = chat['id'];
        chatdiv.appendChild(document.createTextNode(chat['name'] + ': ' + chat['message'] + " " + formattedDate));
        a.appendChild(chatdiv);
    })
}


async function ShowChats() {
    try {
        let savingChats
        const chats = localStorage.getItem(`chatHistory${currgroupID}`);
        if (chats && chats.length != 2) {
            const parsedChatHistory = JSON.parse(chats);
            const lastMessageId = parsedChatHistory[parsedChatHistory.length - 1].messageId;
            const APIresponse = await axios.get(`chat/get-messages?lastMessageId=${lastMessageId}`, { headers: { "groupId": currgroupID } });
            const apiChats = APIresponse.data.chats
            const mergedChats = [...parsedChatHistory, ...apiChats];
            savingChats = mergedChats.slice(-100);
        } else {
            const APIresponse = await axios(`chat/get-messages?lastMessageId=0`, { headers: { "groupId": currgroupID } });
            const apiChats = APIresponse.data.chats
            savingChats = apiChats.slice(-100);
        }
        const getUserResponse = await axios.get('/user/get-user', { headers: { "Authorization": token } });
        const userId = getUserResponse.data.userId
        localStorage.setItem(`chatHistory${currgroupID}`, JSON.stringify(savingChats));
        showChatOnScreen(savingChats, userId)

    } catch (error) {
        console.log(error);
        alert(error.response.data.message);
        window.location = '/';
    }
}
async function showingAllUser() {
    try {
        user_list.parentElement.classList.remove('d-none');

        const usersResponse = await axios.get('user/get-users', { headers: { "Authorization": token } });
        user_list.innerHTML = "";
        let text = ""
        const { users } = usersResponse.data;
        users.forEach((user) => {
            text += `                                    
        <li class="list-group-item  d-flex  justify-content-between">
            <div class="d-flex  align-items-center justify-content-between">
                <img src="https://picsum.photos/seed/${user.imageUrl}/200" alt="Profile Picture"
                    class="rounded-circle me-3" style="width: 35px; height: 35px;">
                <h6><strong class="mb-1">${user.name}</strong></h6>
            </div>
            <input type="checkbox" class="form-check-inline" name="users" value="${user.id}">
        </li>`
        })
        user_list.innerHTML = text;


    } catch (error) {
        console.log(error);
        alert(error.response.data.message);
    }
}
async function createGroup(e) {
    try {

        e.preventDefault();
        const groupName = create_group_form.querySelector('#group_name').value;
        const selectedUsers = Array.from(user_list.querySelectorAll('input[name="users"]:checked'))
            .map(checkbox => checkbox.value);
        const data = {
            name: groupName,
            membersNo: selectedUsers.length + 1,
            membersIds: selectedUsers
        }

        create_group_form.reset();
        let group = await axios.post('group/create-group', data, { headers: { "Authorization": token } });
        showGroupOnScreen(group.data.group);
        alert("Group created successfully")


    } catch (error) {
        console.log(error);
        alert(error.response.data.message);
    }
}
ShowChats();