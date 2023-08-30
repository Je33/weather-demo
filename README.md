# This is the Demo Project Using:

- Open Weather API
- Terraform
- AWS Lambda
- AWS ElastiCache

# Build and deploy project

- copy `terraform/.env.example` -> `terraform/.env` and paste your OpenWeather API Key
```
OPEN_WEATHER_KEY=<YOUR_API_KEY>
```
- and
```
make deploy
```

# Dependencies

- nodejs 18.x (https://nodejs.org/en)
- aws cli (https://aws.amazon.com/ru/cli/)
- yarn (https://yarnpkg.com/)
- terraform (https://www.terraform.io/)
- make (https://www.gnu.org/software/make/)
