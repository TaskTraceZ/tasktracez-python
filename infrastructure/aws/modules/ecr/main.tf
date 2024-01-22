provider "aws" {
  region     = var.AWS_REGION
}

resource "aws_ecr_repository" "TaskTraceZCognitoPostAuthenticationRepository" {
  name                 = "tasktracez-cognito-post-authentication-repository"
  image_tag_mutability = "MUTABLE"
}

resource "aws_ecr_repository" "TaskTraceZUserProjectsGetterRepository" {
  name                 = "tasktracez-user-projects-getter-repository"
  image_tag_mutability = "MUTABLE"
}

# resource "aws_ecr_repository" "TaskTraceZUserProjectCreatorRepository" {
#   name                 = "tasktracez-user-project-creator-repository"
#   image_tag_mutability = "MUTABLE"
# }

# resource "aws_ecr_repository" "TaskTraceZProjectGetterRepository" {
#   name                 = "tasktracez-project-getter-repository"
#   image_tag_mutability = "MUTABLE"
# }

# resource "aws_ecr_repository" "TaskTraceZProjectUpdatorRepository" {
#   name                 = "tasktracez-project-getter-repository"
#   image_tag_mutability = "MUTABLE"
# }

# resource "aws_ecr_repository" "TaskTraceZProjectDeletorRepository" {
#   name                 = "tasktracez-project-getter-repository"
#   image_tag_mutability = "MUTABLE"
# }

# resource "aws_ecr_repository" "TaskTraceZProjectTasksGetterRepository" {
#   name                 = "tasktracez-project-tasks-getter-repository"
#   image_tag_mutability = "MUTABLE"
# }

# resource "aws_ecr_repository" "TaskTraceZProjectTaskCreatorRepository" {
#   name                 = "tasktracez-project-task-creator-repository"
#   image_tag_mutability = "MUTABLE"
# }

# resource "aws_ecr_repository" "TaskTraceZProjectTaskGetterRepository" {
#   name                 = "tasktracez-project-task-getter-repository"
#   image_tag_mutability = "MUTABLE"
# }

# resource "aws_ecr_repository" "TaskTraceZProjectTaskUpdatorRepository" {
#   name                 = "tasktracez-project-task-getter-repository"
#   image_tag_mutability = "MUTABLE"
# }

# resource "aws_ecr_repository" "TaskTraceZProjectTaskDeletorRepository" {
#   name                 = "tasktracez-project-task-getter-repository"
#   image_tag_mutability = "MUTABLE"
# }