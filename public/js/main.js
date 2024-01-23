const socket = io(window.location.origin);
socket.on('common-message', () => {
    ShowCommonChats();
})

async function send(e) {
    e.preventDefault();
    const chat = event.target.chat.value;

    const obj = {
        chat: chat,

    }
    const token = localStorage.getItem('token');
    let res = await axios.post(`/chat/add-chat`, obj, { headers: { "Authorization": token } });
    socket.emit('new-common-message');
    ShowCommonChats();

}


function showChatOnScreen(chats) {
    var a = document.querySelector('#a')
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
async function ShowCommonChats() {
    try {
        let savingChats
        const chats = localStorage.getItem('chatHistory');
        if (chats && chats.length != 2) {
            const parsedChatHistory = JSON.parse(chats);
            const lastMessageId = parsedChatHistory[parsedChatHistory.length - 1].messageId;
            const APIresponse = await axios(`chat/get-messages?lastMessageId=${lastMessageId}`);
            const apiChats = APIresponse.data.chats
            const mergedChats = [...parsedChatHistory, ...apiChats];
            savingChats = mergedChats.slice(-1000);
        } else {
            const APIresponse = await axios(`chat/get-messages?lastMessageId=0`);
            const apiChats = APIresponse.data.chats
            savingChats = apiChats.slice(-1000);
        }
        const token = localStorage.getItem('token');
        const getUserResponse = await axios.get('/chat/get-user', { headers: { "Authorization": token } });
        const userId = getUserResponse.data.userId
        localStorage.setItem("chatHistory", JSON.stringify(savingChats));
        showChatOnScreen(savingChats, userId)

    } catch (error) {
        console.log(error);
        alert(error.response.data.message);
        window.location = '/';
    }
}
ShowCommonChats();