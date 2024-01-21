provider "aws" {
  region     = var.AWS_REGION
}

resource "aws_ecr_repository" "TaskTraceZUserProjectsGetterRepository" {
  name                 = "tasktracez-user-projects-getter-repository"
  image_tag_mutability = "MUTABLE"
}
