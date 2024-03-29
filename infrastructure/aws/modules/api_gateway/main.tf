resource "aws_api_gateway_rest_api" "TaskTraceZAPIGatewayRestApi" {
  name        = "tasktracez-apigateway-rest-api"
  description = "This is my API for demonstration purposes"
}

resource "aws_api_gateway_resource" "TaskTraceZPrefixResource" {
  parent_id   = aws_api_gateway_rest_api.TaskTraceZAPIGatewayRestApi.root_resource_id
  path_part   = "api"
  rest_api_id = aws_api_gateway_rest_api.TaskTraceZAPIGatewayRestApi.id
}

resource "aws_api_gateway_resource" "TaskTraceZUserResource" {
  parent_id   = aws_api_gateway_resource.TaskTraceZPrefixResource.id
  path_part   = "user"
  rest_api_id = aws_api_gateway_rest_api.TaskTraceZAPIGatewayRestApi.id
}

resource "aws_api_gateway_resource" "TaskTraceZProjectsResource" {
  parent_id   = aws_api_gateway_resource.TaskTraceZUserResource.id
  path_part   = "projects"
  rest_api_id = aws_api_gateway_rest_api.TaskTraceZAPIGatewayRestApi.id
}

resource "aws_api_gateway_method" "TaskTraceZGetUserProjectsMethod" {
  rest_api_id   = aws_api_gateway_rest_api.TaskTraceZAPIGatewayRestApi.id
  resource_id   = aws_api_gateway_resource.TaskTraceZProjectsResource.id
  http_method   = "GET"
  authorization = "NONE"
}
