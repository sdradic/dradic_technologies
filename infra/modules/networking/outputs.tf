output "vpc_id" {
  description = "The ID of the VPC"
  value       = var.use_default_vpc ? data.aws_vpc.default[0].id : aws_vpc.custom[0].id
}

output "subnet_ids" {
  description = "The IDs of the subnets"
  value       = var.use_default_vpc ? data.aws_subnets.default[0].ids : aws_subnet.custom[*].id
}

output "security_group_id" {
  description = "The ID of the security group"
  value       = aws_security_group.ecs_sg.id
}
