terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
      version = "5.33.0"
    }
  }
}

provider "aws" {}

# Creating a test VPC with Terraform Cloud
resource "aws_vpc" "main" {
  cidr_block       = "10.123.0.0/16"
  instance_tenancy = "default"

  tags = {
    Name = "test_vpc"
  }
}
