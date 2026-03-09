variable "lb_name" {
  type = string
}

variable "target_group_name" {
  type = string
}

variable "target_port" {
  type = number
}

variable "vpc_id" {
  type = string
}

variable "subnets" {
  type = list(string)
}

variable "security_group_id" {
  type = string
}