import http from 'http'
import socketServices from './services/socket.js'
import{startConsumeMessage} from './services/kafka.js'

const socketService = new socketServices()

const httpServer = http.createServer()

socketService.io.attach(httpServer)
socketService.initListners()
startConsumeMessage()

const PORT = process.env.PORT ||8000
httpServer.listen(PORT, () => {
        console.log(`Http Server running at ${PORT}`)
})

   


