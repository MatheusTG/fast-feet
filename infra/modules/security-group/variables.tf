variable "sg_name" {
  description = "Name of the security group used by the load balancer"
  type        = string
  default     = "fast-feet-sg"
}

variable "sg_description" {
  description = "Description of the security group attached to the load balancer"
  type        = string
  default     = "Security group for the application load balancer"
}

variable "vpc_id" {
  description = "ID of the VPC where the security group will be created"
  type        = string
}

variable "http_port" {
  description = "HTTP port exposed by the load balancer"
  type        = number
  default     = 80
}

variable "https_port" {
  description = "HTTPS port exposed by the load balancer"
  type        = number
  default     = 443
}

variable "app_port" {
  description = "Application port used by containers running in ECS"
  type        = number
  default     = 3333
}

variable "allowed_cidrs" {
  description = "List of CIDR blocks allowed to access the load balancer"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}