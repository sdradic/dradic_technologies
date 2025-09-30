output "ecr_repository_url" {
  description = "The URL of the ECR repository"
  value       = module.ecr.repository_url
}

output "ecr_repository_name" {
  description = "The name of the ECR repository"
  value       = module.ecr.repository_name
}
output "aws_region" {
  description = "The AWS region"
  value       = var.aws_region
}
output "project_name" {
  description = "The name of the project"
  value       = var.project_name
}
