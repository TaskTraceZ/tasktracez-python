terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.33.0"
    }
  }

  backend "remote" {
    organization = "tirthya-kamal-dasgupta"
    workspaces {
      name = "tasktracez-infrastructure"
    }
  }
}

provider "aws" {
  region     = var.AWS_REGION
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
