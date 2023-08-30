const btnSubmit = document.querySelector('#btnSubmit')
const inputCity = document.querySelector('#inputCity')

const contRes = document.querySelector('#contRes')
const contResTitle = document.querySelector('#contResTitle')
const contResDate = document.querySelector('#contResDate')
const contResText = document.querySelector('#contResText')

const authForm = document.querySelector('#authForm')
const authInputLogin = document.querySelector('#authInputLogin')
const authInputPassword = document.querySelector('#authInputPassword')
const authBtnLogin = document.querySelector('#authBtnLogin')
const authStatus = document.querySelector('#authStatus')
const authStatusLogin = document.querySelector('#authStatusLogin')
const authBtnLogout = document.querySelector('#authBtnLogout')

const apiPath = '/v1/getCurrentWeather'

const resetRes = () => {
    contResTitle.innerText = contResDate.innerText = contResText.innerHTML = ''
    contRes.classList.add('d-hide')
}

const initAuth = () => {
    authForm.classList.add('d-hide')
    authStatus.classList.add('d-hide')
    const token = localStorage.getItem('auth-token')
    const login = localStorage.getItem('auth-login')
    if (token && login) {
        authStatus.classList.remove('d-hide')
        authStatusLogin.innerText = login
    } else {
        authForm.classList.remove('d-hide')
    }
}

btnSubmit.addEventListener('click', async (e) => {
    if (btnSubmit.disabled) return
    resetRes()
    btnSubmit.disabled = true
    try {
        const weatherRes = await fetch(`${apiHost}${apiPath}?city=${inputCity.value}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('auth-token')}`
            }
        })
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
            contRes.classList.remove('d-hide')
        } else {
            alert(parsedRes.message ? parsedRes.message : "Unknown error")
        }
    } catch (e) {
        console.error(e)
    }
    btnSubmit.disabled = false
})

authBtnLogin.addEventListener('click', async (e)=> {
    if (authBtnLogin.disabled) return
    authBtnLogin.disabled = true
    try {
        const authRes = await fetch(`https://${authHost}`, {
            method: 'POST',
            headers: {
                'X-Amz-Target': 'AWSCognitoIdentityProviderService.InitiateAuth',
                'Content-Type': 'application/x-amz-json-1.1'
            },
            body: `{
               "AuthParameters" : {
                  "USERNAME" : "${authInputLogin.value}",
                  "PASSWORD" : "${authInputPassword.value}"
               },
               "AuthFlow" : "USER_PASSWORD_AUTH",
               "ClientId" : "${authClientId}"
            }`
        })
        console.log(authRes)
        const parsedRes = await authRes.json()
        console.log(parsedRes)
        if (authRes.status === 200) {
            localStorage.setItem('auth-token', parsedRes.AuthenticationResult.AccessToken)
            localStorage.setItem('auth-login', authInputLogin.value)
            initAuth()
        } else {
            alert(parsedRes.message ? parsedRes.message : "Unknown error")
        }
    } catch (e) {
        console.error(e)
    }
    authBtnLogin.disabled = false
})

authBtnLogout.addEventListener('click', (e) => {
    localStorage.removeItem('auth-token')
    localStorage.removeItem('auth-login')
    initAuth()
})

resetRes()
initAuth()