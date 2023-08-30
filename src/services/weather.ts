import { getSecret } from "./secret"
import { getCache, setCache } from "./cache"
import { getWeatherProvider } from "../providers/visualcrossing"

export type WeatherOut = {
    city: string
    datetime: string
    temperature: number
    weatherCondition: {
        type: string
        pressure: number
        humidity: number
    },
    wind: {
        speed: number,
        direction: string
    }
}

export const getWeather = async (city: string): Promise<string> => {
    const cachedWeather = await getCache(city)
    if (cachedWeather) {
        return cachedWeather
    } else {
        const weatherRes = await getWeatherProvider(city)
        await setCache(city, weatherRes)
        return weatherRes
    }
}






