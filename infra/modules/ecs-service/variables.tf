variable "service_name" {
  description = "Name of the ECS service responsible for running the application tasks"
  type        = string
  default     = "fast-feet-service"
}

variable "cluster_id" {
  description = "ID of the ECS cluster where the service will be deployed"
  type        = string
}

variable "task_definition_arn" {
  description = "ARN of the ECS task definition used by the service"
  type        = string
}

variable "desired_count" {
  description = "Number of tasks that should run simultaneously in the ECS service"
  type        = number
  default     = 1
}

variable "subnets" {
  description = "List of subnet IDs where the ECS tasks will be deployed"
  type        = list(string)
}

variable "security_group_id" {
  description = "Security group attached to the ECS service tasks"
  type        = string
}

variable "target_group_arn" {
  description = "ARN of the load balancer target group used to route traffic to the service"
  type        = string
}

variable "container_name" {
  description = "Name of the container defined in the task definition"
  type        = string
  default     = "fast-feet-container"
}

variable "container_port" {
  description = "Port exposed by the container that receives traffic from the load balancer"
  type        = number
  default     = 3333
}

variable "listener_arn" {
  description = "ARN of the load balancer listener that forwards traffic to the target group"
  type        = string
}