resource "aws_cognito_user_pool" "TaskTraceZCognitoUserPool" {
  name             = "tasktracez-cognito-user-pool"
  alias_attributes = ["preferred_username"]
  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
  }
  email_configuration {
    email_sending_account = "COGNITO_DEFAULT"
  }
}

resource "aws_cognito_user_pool_client" "TaskTraceZCognitoUserPoolClient" {
  name = "tasktracez-cognito-user-pool-client"

  user_pool_id = aws_cognito_user_pool.TaskTraceZCognitoUserPool.id
}
