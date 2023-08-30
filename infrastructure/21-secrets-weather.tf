module "secrets_manager" {
  source = "terraform-aws-modules/secrets-manager/aws"

  # Secret
  name                = "openWeatherKey"
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
