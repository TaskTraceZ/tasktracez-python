terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

module "aws_ecr" {
  source = "./aws/modules/ecr"
}

module "aws_cognito" {
  source = "./aws/modules/cognito"
}

module "aws_apigateway" {
  source = "./aws/modules/api_gateway"
}

module "aws_vpc" {
  source = "./aws/modules/vpc"
}
