import { APIGatewayEvent, Handler } from "aws-lambda"
import { getQueryParam } from "./services/param"
import { getWeather } from "./services/weather"
import { getResponse } from "./services/response"

export const handler: Handler = async (event: APIGatewayEvent) => {
    try {
        const city = getQueryParam(event, "city")
        const weather = await getWeather(city)

        return getResponse(200, weather)
    } catch (e) {
        return getResponse(500, JSON.stringify({message: e}))
    }
}
