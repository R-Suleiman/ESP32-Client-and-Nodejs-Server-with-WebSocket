const path = require('path')
const express = require('express')
const webSocket = require('ws')
require('dotenv').config()

const app = express()

app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

const wss = new webSocket.Server({ noServer: true })

// Send the port to the ESP32
app.get('/get-port', (req, res) => {
  const port = process.env.PORT || 8080
  res.json({ port })
})

// Establish a connection and handle incoming events
wss.on('connection', (ws) => {
  ws.on('message', (data) => {
    // Broadcast data to all connected front-end clients
    wss.clients.forEach((client) => {
      if (client.readyState === webSocket.OPEN) {
        client.send(data)
      }
    })
  })
})

const port = process.env.PORT || 8080
const server = app.listen(port)

server.on('upgrade', (request, Socket, head) => {
  wss.handleUpgrade(request, Socket, head, (socket) => {
    wss.emit('connection', socket, request)
  })
})
