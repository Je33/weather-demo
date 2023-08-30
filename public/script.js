const btnSubmit = document.querySelector('#btnSubmit')
const inputCity = document.querySelector('#inputCity')
const contResTitle = document.querySelector('#contResTitle')
const contResDate = document.querySelector('#contResDate')
const contResText = document.querySelector('#contResText')
const apiPath = '/v1/getCurrentWeather'

function resetRes() {
    contResTitle.innerText = contResDate.innerText = contResText.innerHTML = ''
}

btnSubmit.addEventListener('click', async (e) => {
    if (btnSubmit.disabled) return
    resetRes()
    btnSubmit.disabled = true
    const weatherRes = await fetch(`${apiHost}${apiPath}?city=${inputCity.value}`)
    console.log(weatherRes)
    const parsedRes = await weatherRes.json()
    console.log(parsedRes)
    if (weatherRes.status === 200) {
        contResTitle.innerText = parsedRes.city
        contResDate.innerText = parsedRes.datetime
        contResText.innerHTML = [
            `Temperature: ${parsedRes.temperature} °C`,
            `Weather condition: ${parsedRes.weatherCondition.type}`,
            ``,
            `Wind: ${parsedRes.wind.speed} km/h`,
            `Wind direction: ${parsedRes.wind.direction}`,
            `Pressure: ${parsedRes.weatherCondition.pressure}`,
            `Humidity: ${parsedRes.weatherCondition.humidity}`
        ].join('<br>')
    } else {
        alert(parsedRes.error ? parsedRes.error : "Unknown error")
    }
    btnSubmit.disabled = false
})