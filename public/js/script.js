const socket = io();
const roomName = document.getElementById("roomName");
const usersList= document.getElementById("userListItems");
const chatForm = document.getElementById("messageForm");
const messages = document.getElementById("messages");


const user = {
    username: localStorage.getItem("username"),
    room: localStorage.getItem("room")
};

socket.emit("joinRoom" , user);

socket.on("roomUsers", ({room , users}) => {
    showRoomName(room);
    showUsers(users);
});

socket.on("message" , (msg) => {
    writeMsg(msg);
    messages.scrollTop = messages.scrollHeight;
})



function writeMsg(msg){
    const messageList = document.getElementById("messageList");
    const msgElement = `<div class="message">
                        <p class="username"> ${msg.username} <span class="timestamp">${msg.time}</span></p>
                        <p class="message-text">${msg.message}</p>
                        </div>`;
    messageList.insertAdjacentHTML('beforeend',msgElement);
}
chatForm.addEventListener("submit" , (e) => {
 e.preventDefault();
 const msg  = e.target.elements.messageInput.value;
 e.target.elements.messageInput.value = "";
 e.target.elements.messageInput.focus();

 socket.emit("chatMessage" , msg);
});

function showRoomName(room){ 
    roomName.innerText = room;
}

function showUsers(users){
    usersList.innerHTML = "";
    for(const user of users){ 
        const userElement = document.createElement("li");
        userElement.innerText = user.username;
        usersList.appendChild(userElement);
    }
}