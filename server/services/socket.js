import {Server} from "socket.io"

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
    }

    initListners(){

        const io = this.#io
        console.log('init socket listnres ....')
        io.on('connect', (socket) => {
            console.log(`New socket connected ${socket.id}`)

            socket.on('event:message' ,({ message }) =>{
                console.log('New message Rec.', message)
            })
        })
    }

    get io(){
        return this.#io
    }
}

export default socketServices