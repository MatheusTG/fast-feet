variable "lb_name" {
  description = "Name of the Application Load Balancer"
  type        = string
  default     = "fast-feet-lb"
}

variable "target_group_name" {
  description = "Name of the target group used by the load balancer to route traffic to ECS tasks"
  type        = string
  default     = "app-target-group"
}

variable "target_port" {
  description = "Port on which the application container receives traffic"
  type        = number
  default     = 3333
}

variable "vpc_id" {
  description = "ID of the VPC where the load balancer and target group will be deployed"
  type        = string
}

variable "subnets" {
  description = "List of subnet IDs where the load balancer will be deployed"
  type        = list(string)
}

variable "security_group_id" {
  description = "Security group ID attached to the Application Load Balancer"
  type        = string
}