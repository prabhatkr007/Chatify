import http from 'http'
import socketServices from './services/socket.js'
import dotenv from 'dotenv'
dotenv.config({ path: './.env' });

const socketService = new socketServices()

const httpServer = http.createServer()

socketService.io.attach(httpServer)
socketService.initListners()

const PORT = process.env.PORT ||8000
httpServer.listen(PORT, () => {
        console.log(`Http Server running at ${PORT}`)
})

   


