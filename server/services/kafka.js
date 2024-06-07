import { Kafka } from "kafkajs"
import fs from 'fs'
import path from 'path'
import { KAFKA_USERNAME, KAFKA_BROKERS, KAFKA_PASSWORD} from '../env.js'
import prismaClient from "./prisma.js"

const kafka = new Kafka({
    brokers:KAFKA_BROKERS,
    ssl:{
        ca:[fs.readFileSync(path.resolve('./ca.pem'), 'utf-8')]
    },
    sasl:{
        username : KAFKA_USERNAME,
        password:KAFKA_PASSWORD,
        mechanism: "plain"
    }
})

let producer = null

async function createProducer(){
    if(producer) return producer

    const _producer = kafka.producer()
    await _producer.connect()
    producer = _producer
    return producer
}

export async function produceMessage(message){
    console.log("Producer is running...")
    const producer = await createProducer() // will not create on every call producer is saved after first creation
    await producer.send({
        messages : [{key:`message-${Date.now}`, value:message}],
        topic:"MESSAGES"
    })

    return true
}


let consumer = null

async function createConsumer(){
    if(consumer) return consumer

    const _consumer = kafka.consumer({groupId : 'default'})
    await _consumer.connect()
    consumer = _consumer
    return consumer
}


export async function startConsumeMessage(){
    console.log("Consumer is running...")

    const consumer = await createConsumer() 
    await consumer.subscribe({topic:'MESSAGES', fromBeginning : true})

    await consumer.run({
        autoCommit:true,
        eachMessage: async ({message, pause}) =>{
            console.log("New Message Rec...")
            if(!message.value) return
            try{
                await prismaClient.message.create({
                    data:{
                        text:message.value.toString()
                    }
                })
            }catch(err){
                console.log("something wrong with db:",err.message)
                pause()
                setTimeout(() => {consumer.resume({topic : "MESSSAGES"})}, 60*1000)
            }
        }
    })

}

export default kafka