import {Server} from "socket.io"
import {pub, sub} from './redis.js'
import { produceMessage } from "./kafka.js"
class socketServices{
     #io
    constructor(){
        console.log("init socket service ...")
        this.#io = new Server({
            cors : {
                allowedHeaders : ["*"],
                origin : "*"
            }
        })
        sub.subscribe('MESSAGES')
    }

    initListners (){

        const io = this.#io
        console.log('init socket listners ....')
        io.on('connect', (socket) => {
            console.log(`New socket connected ${socket.id}`)

            socket.on('event:message' ,async ( message ) =>{
                console.log('New message Rec.', message)
                //publish this message to redis
                await pub.publish("MESSAGES", JSON.stringify(message) )
            })
        })

        sub.on("message", async (channel, message) => {
            if(channel === "MESSAGES" ){
                console.log("New message from Redis", message)
                this.#io.emit("message", message)

                await produceMessage(message)
                console.log("Message is produced to kafka broker ")
               
            }
        })
    }

    get io(){
        return this.#io
    }
}

export default socketServices