module "secrets_manager_openweather" {
  source = "terraform-aws-modules/secrets-manager/aws"

  # Secret
  name                = "openWeatherApiKey"
  description         = "Open Weather API Key"

  # Policy
  create_policy       = true
  block_public_policy = true
  policy_statements = {
    read = {
      sid = "AllowLambdaRead"
      principals = [{
        type        = "AWS"
        identifiers = [aws_iam_role.weather_lambda_exec.arn]
      }]
      actions   = ["secretsmanager:GetSecretValue"]
      resources = ["*"]
    }
  }

  # Secret
  secret_string = local.envs["OPEN_WEATHER_KEY"]
}

module "secrets_manager_visualcrossing" {
  source = "terraform-aws-modules/secrets-manager/aws"

  # Secret
  name                = "visualcrossingApiKey"
  description         = "Visualcrossing API Key"

  # Policy
  create_policy       = true
  block_public_policy = true
  policy_statements = {
    read = {
      sid = "AllowLambdaRead"
      principals = [{
        type        = "AWS"
        identifiers = [aws_iam_role.weather_lambda_exec.arn]
      }]
      actions   = ["secretsmanager:GetSecretValue"]
      resources = ["*"]
    }
  }

  # Secret
  secret_string = local.envs["VISUALCROSSING_KEY"]
}
