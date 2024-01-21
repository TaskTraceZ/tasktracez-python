provider "aws" {
  region = var.AWS_REGION
}

resource "aws_cognito_user_pool" "TaskTraceZCognitoUserPool" {
  name = "tasktracez-cognito-user-pool"
}
