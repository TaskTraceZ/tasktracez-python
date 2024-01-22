provider "aws" {
  region     = var.AWS_REGION
}

resource "aws_cognito_user_pool" "TaskTraceZCognitoUserPool" {
  name             = "tasktracez-cognito-user-pool"
  alias_attributes = ["preferred_username"]
  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
  }
}
