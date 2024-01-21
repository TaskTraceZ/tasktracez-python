provider "aws" {
  access_key = var.AWS_ACCESS_KEY
  secret_key = var.AWS_SECRET_KEY
  region     = var.AWS_REGION
}

resource "aws_ecr_repository" "TaskTraceZUserProjectsGetterRepository" {
  name                 = "tasktracez-user-projects-getter-repository"
  image_tag_mutability = "MUTABLE"
}

resource "null_resource" "BuildAndPushTaskTraceZUserProjectsGetterImage" {
  triggers = {
    always_run = timestamp()
  }

  provisioner "local-exec" {
    command = <<EOT
      docker build -t ${aws_ecr_repository.TaskTraceZUserProjectsGetterRepository.repository_url}:latest .
      aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin ${aws_ecr_repository.TaskTraceZUserProjectsGetterRepository.repository_url}
      docker push ${aws_ecr_repository.TaskTraceZUserProjectsGetterRepository.repository_url}:latest
    EOT
  }
}