resource "aws_apigatewayv2_integration" "lambda_weather" {
  api_id = aws_apigatewayv2_api.main.id

  integration_uri    = aws_lambda_function.getCurrentWeather.invoke_arn
  integration_type   = "AWS_PROXY"
  integration_method = "POST"
}

resource "aws_apigatewayv2_route" "get_weather" {
  api_id = aws_apigatewayv2_api.main.id

  route_key = "GET /v1/getCurrentWeather"
  target    = "integrations/${aws_apigatewayv2_integration.lambda_weather.id}"
}

resource "aws_lambda_permission" "api_gw" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.getCurrentWeather.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.main.execution_arn}/*/*"
}

output "weather_base_url" {
  value = aws_apigatewayv2_stage.dev.invoke_url
}

resource "local_file" "private_key" {
  content  = "window.apiHost='${aws_apigatewayv2_stage.dev.invoke_url}'"
  filename = "${path.module}/../public/api.js"
}

resource "aws_s3_object" "api_host" {
  key    = "api.js"
  bucket = aws_s3_bucket.weather_public.id
  source = "${path.module}/../public/api.js"
}