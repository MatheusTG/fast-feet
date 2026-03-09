variable "family" {
  description = "Name of the ECS task definition family"
  type        = string
  default     = "fast-feet-task-definition"
}

variable "execution_role_arn" {
  description = "IAM role ARN used by ECS tasks to pull images and write logs"
  type        = string
}

variable "cpu" {
  description = "CPU units used by the ECS task"
  type        = string
  default     = "256"
}

variable "memory" {
  description = "Amount of memory (in MiB) used by the ECS task"
  type        = string
  default     = "512"
}

variable "container_name" {
  description = "Name of the container running inside the ECS task"
  type        = string
  default     = "fast-feet-container"
}

variable "container_image" {
  description = "Docker image used by the ECS container"
  type        = string
}

variable "container_port" {
  description = "Port exposed by the container"
  type        = number
  default     = 3000
}

variable "container_memory" {
  description = "Memory allocated to the container in MiB"
  type        = number
  default     = 512
}