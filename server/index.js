import http from 'http'
import socketServices from './services/socket.js'

const socketService = new socketServices()

const httpServer = http.createServer()

socketService.io.attach(httpServer)
socketService.initListners()

const PORT = 8000
httpServer.listen(PORT, () => {
        console.log(`Http Server running at ${PORT}`)
})

   


