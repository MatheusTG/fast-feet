output "ecs_cluster_id" {
  description = "ID do ECS Cluster"
  value       = aws_ecs_cluster.cluster.id
}

output "ecs_cluster_arn" {
  description = "ARN do ECS Cluster"
  value       = aws_ecs_cluster.cluster.arn
}

output "ecs_cluster_name" {
  description = "Nome do ECS Cluster"
  value       = aws_ecs_cluster.cluster.name
}