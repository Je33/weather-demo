import { getSecret } from "./secret"
import { getCache, setCache } from "./cache"

export type OpenWeatherResStation = {
    contribution: number
    distance: number
    id: string
    latitude: number
    longitude: number
    name: string
    quality: number
    useCount: number
}

export type OpenWeatherResCondition = {
    cloudcover: number
    conditions: string
    datetime: string
    datetimeEpoch: number
    dew: number
    feelslike: number
    humidity: number
    icon: string
    moonphase: number
    precip: number
    precipprob: number
    preciptype: number
    pressure: number
    snow: number
    snowdepth: number
    solarenergy: number
    solarradiation: number
    source: string
    stations: string[]
    sunrise: string
    sunriseEpoch: number
    sunset: string
    sunsetEpoch: number
    temp: number
    uvindex: number
    visibility: number
    winddir: number
    windgust: number
    windspeed: number
}

export type OpenWeatherRes = {
    address: string
    alerts: string[]
    currentConditions: OpenWeatherResCondition
    days: OpenWeatherResCondition[]
    description: string
    latitude: number
    longitude: number
    queryCost: number
    resolvedAddress: string
    stations: {[key: string]: OpenWeatherResStation}
    timezone: string
    tzoffset: number
}

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

export const getWindDir = (dir: number): string => {
    const directions = ['↑ N', '↗ NE', '→ E', '↘ SE', '↓ S', '↙ SW', '← W', '↖ NW']
    return directions[Math.round(dir / 45) % 8]
}

export const serializeRes = (res: OpenWeatherRes): WeatherOut => {
    return {
        city: res.resolvedAddress,
        datetime: res.currentConditions.datetime,
        temperature: res.currentConditions.temp,
        weatherCondition: {
            type: res.currentConditions.conditions,
            pressure: res.currentConditions.pressure,
            humidity: res.currentConditions.humidity
        },
        wind: {
            speed: res.currentConditions.windspeed,
            direction: getWindDir(res.currentConditions.winddir)
        }
    }
}

export const getWeather = async (city: string): Promise<string> => {
    const cachedWeather = await getCache(city)
    if (cachedWeather) {
        return cachedWeather
    } else {
        const openWeatherKey = await getSecret("openWeatherKey")
        const openWeatherRes = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}/today?unitGroup=metric&key=${openWeatherKey}`)
        const openWeatherResText = await openWeatherRes.json() as OpenWeatherRes
        const serializedRes = JSON.stringify(serializeRes(openWeatherResText))
        await setCache(city, serializedRes)
        return serializedRes
    }
}
