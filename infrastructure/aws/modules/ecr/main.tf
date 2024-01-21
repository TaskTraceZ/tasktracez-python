provider "aws" {
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
      aws ecr get-login-password --region ${var.AWS_REGION} | docker login --username AWS --password-stdin ${aws_ecr_repository.TaskTraceZUserProjectsGetterRepository.repository_url}
      docker push ${aws_ecr_repository.TaskTraceZUserProjectsGetterRepository.repository_url}:latest
    EOT
  }
}
