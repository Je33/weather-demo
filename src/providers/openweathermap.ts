import { getSecret } from "../services/secret"
import { WeatherOut } from "../services/weather"

type OpenWeatherResCondition = {
    id: number
    main: string
    description: string
    icon: string
}

type OpenWeatherRes = {
    coord: {
        lon: number
        lat: number
    }
    weather: OpenWeatherResCondition[]
    base: string
    main: {
        temp: number
        feels_like: number
        temp_min: number
        temp_max: number
        pressure: number
        humidity: number
        sea_level: number
        grnd_level: number
    }
    visibility: number
    wind: {
        speed: number
        deg: number
        gust: number
    }
    rain: {
        "1h": number
    }
    clouds: {
        all: number
    }
    dt: number
    sys: {
        type: number
        id: number
        country: string
        sunrise: number
        sunset: number
    }
    timezone: number
    id: number
    name: string
    cod: number
}

export const getWeatherProvider = async (city: string): Promise<string> => {
    const openWeatherKey = await getSecret("openWeatherApiKey")
    const openWeatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${openWeatherKey}`)
    if (openWeatherRes.status === 200) {
        const openWeatherResText = await openWeatherRes.json() as OpenWeatherRes
        return JSON.stringify(serializeRes(openWeatherResText))
    } else {
        throw await openWeatherRes.json()
    }
}

const formatDate = (date: number): string => {
    return `${new Date(date).getHours()}:${new Date(date).getMinutes()}:${new Date(date).getSeconds()}`
}

const getConditions = (conditions: OpenWeatherResCondition[]): string => {
    return conditions.length ? conditions[0].description : ""
}

const getWindDir = (dir: number): string => {
    const directions = ['N ↑', 'NE ↗', 'E →', 'SE ↘', 'S ↓', 'SW ↙', 'W ←', 'NW ↖']
    return directions[Math.round(dir / 45) % 8]
}

const serializeRes = (res: OpenWeatherRes): WeatherOut => {
    return {
        city: res.name,
        datetime: formatDate(res.dt),
        temperature: res.main.temp,
        weatherCondition: {
            type: getConditions(res.weather),
            pressure: res.main.pressure,
            humidity: res.main.humidity
        },
        wind: {
            speed: res.wind.speed,
            direction: getWindDir(res.wind.deg)
        }
    }
}

