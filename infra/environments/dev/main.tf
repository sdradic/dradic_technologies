provider "aws" {
  region = var.aws_region
}

module "networking" {
  source          = "../../modules/networking"
  use_default_vpc = true
  project_name    = var.project_name
}

module "iam" {
  source       = "../../modules/iam"
  project_name = var.project_name
}

module "ecr" {
  source          = "../../modules/ecr"
  repository_name = var.repository_name
  project_name    = var.project_name
}

# module "ec2" {
#   source        = "../../modules/ec2"
#   key_name      = var.key_name
#   my_ip         = var.my_ip
#   project_name  = var.project_name
# }

module "ssm" {
  source       = "../../modules/ssm"
  project_name = var.project_name
  environment  = "dev"
}


module "ecs" {
  source               = "../../modules/ecs"
  cluster_name         = var.cluster_name
  aws_region           = var.aws_region
  service_name         = var.service_name
  task_definition_name = var.task_definition_name
  desired_count        = var.desired_count
  container_image      = "${module.ecr.repository_url}:latest"
  container_port       = var.container_port
  project_name         = var.project_name
  subnet_ids           = module.networking.subnet_ids
  security_group_ids   = [module.networking.security_group_id]
  execution_role_arn   = module.iam.ecs_execution_role_arn
  secrets              = var.ecs_secrets
  environment_variables = [
    {
      name  = "ENVIRONMENT"
      value = "DEV"
    }
  ]

  depends_on = [
    module.ecr,
    module.iam,
    module.networking,
    module.ssm
  ]
}
