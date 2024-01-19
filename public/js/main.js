async function send(e) {
    e.preventDefault();
    const chat = event.target.chat.value;

    const obj = {
        chat: chat,

    }
    const token = localStorage.getItem('token')
    let res = await axios.post(`/chat/add-chat`, obj, { headers: { "Authorization": token } });
    showNewChatOnScreen(res.data.newChat);

}

window.addEventListener("DOMContentLoaded", async () => {
    //token for authentication
    const token = localStorage.getItem('token')

    //show expenses
    let res = await axios.get(`/chat/get-chats`, { headers: { "Authorization": token } });
    console.log(res);

    for (var i = 0; i < res.data.allChats.length; i++) {
        showNewChatOnScreen(res.data.allChats[i])

    }

})

function showNewChatOnScreen(obj, ID = '1qazx234rfvrrf') {
    if (obj['id']) {
        ID = obj['id']
    }
    var a = document.querySelector('#a')
    var chatdiv = document.createElement('div');
    chatdiv.id = ID;
    chatdiv.appendChild(document.createTextNode(obj['name'] + ': ' + obj['chat']));

    a.appendChild(chatdiv);
}