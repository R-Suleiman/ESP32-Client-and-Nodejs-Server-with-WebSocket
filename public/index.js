const dataDOM = document.querySelector('.data')

const client = new WebSocket(
  'ws://https://sen-esp32-nodejs-websocket.onrender.com'
)
client.onopen = () => {
  console.log('Connected to webSocket server!')
}

// Handle data accordingly, example Blob data(raw) or JSON
client.onmessage = (event) => {
  if (event.data instanceof Blob) {
    const reader = new FileReader()
    reader.onload = () => {
      const textData = reader.result // this will contain the text data fonm Blob
      dataDOM.textContent = textData
    }
    reader.readAsText(event.data)
  } else {
    dataDOM.textContent = event.data
  }
}

client.onclose = () => {
  console.log('Disconnected from WebSocket server')
}
