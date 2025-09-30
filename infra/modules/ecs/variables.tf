variable "project_name" {
  type        = string
  description = "The name of the project"
}

variable "aws_region" {
  type        = string
  description = "The AWS region to deploy the ECS cluster"
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
  default     = 1
}

variable "container_image" {
  type        = string
  description = "The container image URI"
}

variable "container_port" {
  type        = number
  description = "The port the container listens on"
  default     = 8000
}

variable "cpu" {
  type        = number
  description = "The amount of CPU to allocate to the task"
  default     = 256
}

variable "memory" {
  type        = number
  description = "The amount of memory to allocate to the task"
  default     = 512
}

variable "subnet_ids" {
  type        = list(string)
  description = "List of subnet IDs for the ECS service"
}

variable "security_group_ids" {
  type        = list(string)
  description = "List of security group IDs for the ECS service"
}

variable "execution_role_arn" {
  type        = string
  description = "The ARN of the task execution role"
}

variable "task_role_arn" {
  type        = string
  description = "The ARN of the task role"
  default     = ""
}

variable "environment_variables" {
  type = list(object({
    name  = string
    value = string
  }))
  description = "Environment variables for the container"
  default     = []
}

variable "secrets" {
  type = list(object({
    name      = string
    valueFrom = string
  }))
  description = "Secrets for the container"
  default     = []
}
