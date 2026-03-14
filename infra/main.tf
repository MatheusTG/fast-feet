module "ecs_cluster" {
  source = "./modules/ecs-cluster"

  cluster_name = "fast-feet-cluster"
}

module "security_group" {
  source = "./modules/security-group"

  vpc_id = var.vpc_id
}

module "load_balancer" {
  source = "./modules/load-balancer"

  vpc_id = var.vpc_id

  subnets = var.public_subnets

  security_group_id = module.security_group.security_group_id
}

module "ecs_task_definition" {
  source = "./modules/ecs-task-definition"

  execution_role_arn = var.execution_role_arn

  container_image = var.container_image
}

module "ecs_service" {
  source = "./modules/ecs-service"

  cluster_id          = module.ecs_cluster.ecs_cluster_id
  task_definition_arn = module.ecs_task_definition.task_definition_arn

  subnets = var.public_subnets

  security_group_id = module.security_group.security_group_id
  target_group_arn  = module.load_balancer.target_group_arn
  listener_arn      = module.load_balancer.lb_arn
}

module "api_secrets" {
  source = "./modules/secrets-manager"

  secret_name = "fast-feet-api-secrets"

  secret_values = var.secret_values
}
