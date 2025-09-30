variable "aws_region" {
  type        = string
  description = "The AWS region to deploy the EC2 instance"
  default     = "us-east-1"
}
variable "instance_name" {
  type        = string
  description = "The name of the EC2 instance"
}

variable "key_name" {
  type        = string
  description = "The name of the key pair"
}

variable "my_ip" {
  type        = string
  description = "The IP address of the user"
}

variable "cluster_name" {
  type        = string
  description = "The name of the ECS cluster"
}

variable "service_name" {
  type        = string
  description = "The name of the ECS service"
}

variable "task_definition_name" {
  type        = string
  description = "The name of the ECS task definition"
}

variable "desired_count" {
  type        = number
  description = "The desired count of the ECS service"
}

variable "container_image" {
  type        = string
  description = "The container image URI"
}

variable "container_port" {
  type        = number
  description = "The port the container listens on"
}

variable "project_name" {
  type        = string
  description = "The name of the project"
}

variable "repository_name" {
  type        = string
  description = "The name of the ECR repository"
}

variable "ecs_secrets" {
  type = list(object({
    name      = string
    valueFrom = string
  }))
  description = "The secrets for the ECS service"
  default     = []
}
