variable "aws_region" {
  description = "AWS region where infrastructure resources will be deployed"
  type        = string
  default     = "us-east-1"
}

variable "vpc_id" {
  description = "VPC where resources will be deployed"
  type        = string
}

variable "public_subnets" {
  description = "List of public subnets used by ECS and ALB"
  type        = list(string)
}

variable "execution_role_arn" {
  description = "IAM role used by ECS tasks"
  type        = string
}

variable "container_image" {
  description = "Docker image used by the application"
  type        = string
}