import { APIGatewayEvent } from "aws-lambda"

export const getQueryParam = (event: APIGatewayEvent, name: string): string => {
    const value = event.queryStringParameters?.city
    if (!value) {
        throw `Parameter "${name}" not specified.`
    }
    return value
}
