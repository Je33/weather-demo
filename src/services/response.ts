type Response = {
    statusCode: number
    headers: {[key: string]: string}
    body: string
}

export const getResponse = (status: number, data: string): Response => {
    return {
        statusCode: status,
        headers: {
            'Content-Type': 'application/json'
        },
        body: data
    }
}