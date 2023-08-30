resource "aws_cognito_user_pool" "weather_pool" {
  name = "weather_user_pool"
}

resource "aws_cognito_user_pool_client" "weather_client" {
  name = "weather_external_api"
  user_pool_id = aws_cognito_user_pool.weather_pool.id
  explicit_auth_flows = [
    "ALLOW_USER_PASSWORD_AUTH",
    "ALLOW_USER_SRP_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH"
  ]
}

output "auth_url" {
  value = aws_cognito_user_pool.weather_pool.endpoint
}

output "auth_client_id" {
  value = aws_cognito_user_pool_client.weather_client.id
}