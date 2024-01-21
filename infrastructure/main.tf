terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

module "aws_apigateway" {
    source = "./aws/modules/api_gateway"
}

module "aws_ecr" {
    source = "./aws/modules/ecr"
}