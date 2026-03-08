variable "sg_name" {
  description = "Nome do security group"
  type        = string
  default     = "fast-feet-sg"
}

variable "sg_description" {
  description = "Descrição do security group"
  type        = string
  default     = "Security group para o Load Balancer"
}

variable "vpc_id" {
  description = "ID da VPC"
  type        = string
}

variable "http_port" {
  description = "Porta HTTP"
  type        = number
  default     = 80
}

variable "https_port" {
  description = "Porta HTTPS"
  type        = number
  default     = 443
}

variable "app_port" {
  description = "Porta da aplicação"
  type        = number
  default     = 3000
}

variable "allowed_cidr" {
  description = "CIDR permitido"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}