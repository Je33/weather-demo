# This is the Demo Project Using:

- Open Weather API
- Terraform
- AWS Lambda
- AWS S3
- AWS ElastiCache
- AWS Gateway API
- AWS Cognito

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
- yarn (https://yarnpkg.com/)
- aws cli (https://aws.amazon.com/ru/cli/)
- terraform (https://www.terraform.io/)
- make (https://www.gnu.org/software/make/)
