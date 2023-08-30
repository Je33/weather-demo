import { getSecret } from "../services/secret"
import { WeatherOut } from "../services/weather"

type VisualcrossingResStation = {
    contribution: number
    distance: number
    id: string
    latitude: number
    longitude: number
    name: string
    quality: number
    useCount: number
}

type VisualcrossingResCondition = {
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

type VisualcrossingRes = {
    address: string
    alerts: string[]
    currentConditions: VisualcrossingResCondition
    days: VisualcrossingResCondition[]
    description: string
    latitude: number
    longitude: number
    queryCost: number
    resolvedAddress: string
    stations: {[key: string]: VisualcrossingResStation}
    timezone: string
    tzoffset: number
}

export const getWeatherProvider = async (city: string): Promise<string> => {
    const visualcrossingKey = await getSecret("visualcrossingApiKey")
    const visualcrossingRes = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}/today?unitGroup=metric&key=${visualcrossingKey}`)
    if (visualcrossingRes.status === 200) {
        const visualcrossingResText = await visualcrossingRes.json() as VisualcrossingRes
        return JSON.stringify(serializeRes(visualcrossingResText))
    } else {
        throw await visualcrossingRes.json()
    }
}

const getWindDir = (dir: number): string => {
    const directions = ['N ↑', 'NE ↗', 'E →', 'SE ↘', 'S ↓', 'SW ↙', 'W ←', 'NW ↖']
    return directions[Math.round(dir / 45) % 8]
}

const serializeRes = (res: VisualcrossingRes): WeatherOut => {
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

