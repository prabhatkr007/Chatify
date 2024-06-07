import {REDIS_HOST, REDIS_PASSWORD, REDIS_USERNAME, REDIS_PORT} from '../env.js'
import Redis  from "ioredis"

const pub = new Redis({
    host :REDIS_HOST,
    port : REDIS_PORT,
    username : REDIS_USERNAME,
    password :REDIS_PASSWORD
})

const sub = new Redis({
    host :REDIS_HOST,
    port : REDIS_PORT,
    username : REDIS_USERNAME,
    password :REDIS_PASSWORD
})

export {pub, sub}