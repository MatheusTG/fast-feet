resource "aws_secretsmanager_secret" "secret" {
  name        = var.secret_name
  description = var.secret_description

  tags = {
    Name = var.secret_name
  }
}

resource "aws_secretsmanager_secret_version" "secret_value" {
  secret_id = aws_secretsmanager_secret.secret.id

  secret_string = jsonencode(var.secret_values)
}