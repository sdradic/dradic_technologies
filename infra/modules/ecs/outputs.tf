output "cluster_id" {
  description = "The ID of the ECS cluster"
  value       = aws_ecs_cluster.ecs_cluster.id
}

output "cluster_arn" {
  description = "The ARN of the ECS cluster"
  value       = aws_ecs_cluster.ecs_cluster.arn
}

output "service_id" {
  description = "The ID of the ECS service"
  value       = aws_ecs_service.ecs_service.id
}

output "service_name" {
  description = "The name of the ECS service"
  value       = aws_ecs_service.ecs_service.name
}

output "task_definition_arn" {
  description = "The ARN of the task definition"
  value       = aws_ecs_task_definition.ecs_task_definition.arn
}

output "log_group_name" {
  description = "The name of the CloudWatch log group"
  value       = aws_cloudwatch_log_group.main.name
}
