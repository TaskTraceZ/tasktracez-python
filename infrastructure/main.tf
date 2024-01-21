terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# module "aws_ecr" {
#   source = "./aws/modules/ecr"
# }

# module "aws_cognito" {
#   source = "./aws/modules/cognito"
# }

# module "aws_apigateway" {
#   source = "./aws/modules/api_gateway"
# }

provider "aws" {
  region = "ap-south-1"
}

resource "aws_vpc" "main" {
  cidr_block       = "10.0.0.0/16"
  instance_tenancy = "default"

  tags = {
    Name = "main"
  }
}
