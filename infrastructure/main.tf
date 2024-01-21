terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
      version = "5.33.0"
    }
  }
}

provider "aws" {}

# module "aws_ecr" {
#   source = "./aws/modules/ecr"
# }

# module "aws_cognito" {
#   source = "./aws/modules/cognito"
# }

# module "aws_apigateway" {
#   source = "./aws/modules/api_gateway"
# }

resource "aws_vpc" "main" {
  cidr_block       = "10.123.0.0/16"
  instance_tenancy = "default"

  tags = {
    Name = "test_vpc"
  }
}
