resource "aws_iam_role" "weather_lambda_exec" {
  name = "weather-lambda"

  assume_role_policy = <<POLICY
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
POLICY
}

resource "aws_iam_role_policy_attachment" "weather_lambda_policy" {
  role       = aws_iam_role.weather_lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy_attachment" "iam_role_policy_attachment_lambda_vpc_access_execution" {
  role       = aws_iam_role.weather_lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole"
}

resource "null_resource" "lambda_function" {
  provisioner "local-exec" {
    command = "pwd"
  }
}

resource "aws_lambda_function" "getCurrentWeather" {
  depends_on       = [ null_resource.lambda_function ]
  function_name    = "getCurrentWeather"
  handler          = "index.handler"
  runtime          = "nodejs18.x"
  source_code_hash = data.archive_file.lambda_weather.output_base64sha256
  role             = aws_iam_role.weather_lambda_exec.arn
  timeout          = 60

  s3_bucket = aws_s3_bucket.lambda_bucket.id
  s3_key    = aws_s3_object.lambda_weather.key

  vpc_config {
    security_group_ids = [aws_security_group.lambda_security_group.id]
    subnet_ids         = [aws_subnet.private.id]
  }
  environment {
    variables = {
      REDIS_HOST = aws_elasticache_cluster.weather_cache.cache_nodes.0.address
      REDIS_PORT = aws_elasticache_cluster.weather_cache.cache_nodes.0.port
      PUBLIC_URL = "https://${aws_s3_bucket.weather_public.bucket}.s3-website.eu-central-1.amazonaws.com"
    }
  }
}

resource "aws_cloudwatch_log_group" "getCurrentWeather" {
  name = "/aws/lambda/${aws_lambda_function.getCurrentWeather.function_name}"

  retention_in_days = 1
}

data "archive_file" "lambda_weather" {
  type = "zip"

  source_dir  = "${path.module}/../dist"
  output_path = "${path.module}/../dist.zip"
}

resource "aws_s3_object" "lambda_weather" {
  bucket = aws_s3_bucket.lambda_bucket.id

  key    = "dist.zip"
  source = data.archive_file.lambda_weather.output_path

  etag = filemd5(data.archive_file.lambda_weather.output_path)
}