
const socketService = (socket) => {

        socket.on('new-common-message', () => {

                socket.broadcast.emit('common-message', "common message");
        })

}

module.exports = socketService