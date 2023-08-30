import { Redis } from "ioredis"

const redisPort = Number(process.env.REDIS_PORT ?? 0)
const redisHost = process.env.REDIS_HOST ?? ""
const redisTtl = 60
const redisClient = new Redis(redisPort, redisHost, {
    connectTimeout: 30000,
    commandTimeout: 30000,
})

export const getCache = async (key: string): Promise<string | null> => {
    return redisClient.get(key)
}

export const setCache = async (key: string, data: string): Promise<void> => {
    await redisClient.setex(key, redisTtl, data)
}
