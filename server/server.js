const express = require('express')
const http = require('http')
const socketIO = require('socket.io')

const port = process.env.PORT || 3000;

const app = express()

app.use(express.static('build'));

// need http wrapper for socketIO constructor
const server = http.createServer(app)

server.listen(port, () => console.log(`Listening on port ${port}`))

const io = socketIO(server)

let serverCalculations = [];

// establish socket connection when the user use site
io.on('connection', socket => {
console.log('this is the sever===========================');

    socket.on('add calculation', (event) => {
        console.log('this is the event=============', event);

        if (serverCalculations.length < 10) {
            serverCalculations.push(event.calculation)
        } else {
            serverCalculations.shift()
            serverCalculations.push(event.calculation)
        }

        io.sockets.emit('calc', serverCalculations.reverse()) //.reverse is so when a new calculation is inputed it will appear on the top instead of bottom
    })

    //when new user opens the app 'new user' event will emit the array from calculation 
    socket.on('new user', () => {
        io.sockets.emit('calc', serverCalculations.reverse())
    })

    // disconnect is fired when a client leaves the server
    socket.on('disconnect', () => {
        console.log('user disconnected')
    })
})