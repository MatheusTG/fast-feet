variable "secret_name" {
  description = "Name of the secret stored in AWS Secrets Manager"
  type        = string
}

variable "secret_description" {
  description = "Description of the secret"
  type        = string
  default     = "Application secrets"
}

variable "secret_values" {
  description = "Key-value map containing secret data"
  type        = map(string)
}