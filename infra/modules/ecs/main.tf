# ECS Cluster
resource "aws_ecs_cluster" "ecs_cluster" {
  name = var.cluster_name
  tags = {
    Service  = "ECS Cluster"
    Resource = "${var.project_name}-ecs-cluster"
  }
  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

# ECS Task Definition
resource "aws_ecs_task_definition" "ecs_task_definition" {
  family                   = var.task_definition_name
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.cpu
  memory                   = var.memory
  execution_role_arn       = var.execution_role_arn
  task_role_arn            = var.task_role_arn
  volume {
    name = "${var.project_name}-volume"
  }
  container_definitions = jsonencode([
    {
      name  = "${var.project_name}-container"
      image = var.container_image
      portMappings = [
        {
          containerPort = var.container_port
          hostPort      = var.container_port
          protocol      = "tcp"
        }
      ]
      environment = var.environment_variables
      secrets     = var.secrets

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.main.name
          "awslogs-region"        = data.aws_region.current.region
          "awslogs-stream-prefix" = "ecs"
        }
      }
      healthCheck = {
        command     = ["CMD-SHELL", "curl -f http://localhost:${var.container_port}/health || exit 1"]
        interval    = 30
        timeout     = 5
        retries     = 3
        startPeriod = 60
      }
      essential = true
    }
  ])
  tags = {
    Service  = "ECS Task Definition"
    Resource = "${var.project_name}-ecs-task-definition"
  }
}

# CloudWatch Log Group
resource "aws_cloudwatch_log_group" "main" {
  name              = "/ecs/${var.project_name}-${var.task_definition_name}"
  retention_in_days = 7

  tags = {
    Name    = "/ecs/${var.project_name}-${var.task_definition_name}"
    Service = "CloudWatch"
  }
}

# ECS Service
resource "aws_ecs_service" "ecs_service" {
  name            = var.service_name
  cluster         = aws_ecs_cluster.ecs_cluster.id
  task_definition = aws_ecs_task_definition.ecs_task_definition.arn
  desired_count   = var.desired_count
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = var.subnet_ids
    security_groups  = var.security_group_ids
    assign_public_ip = true
  }

  deployment_maximum_percent         = 200
  deployment_minimum_healthy_percent = 100

  tags = {
    Service  = "ECS Service"
    Resource = "${var.project_name}-ecs-service"
  }

  lifecycle {
    ignore_changes = [
      task_definition
    ]
  }
}

# Data for the current region
data "aws_region" "current" {
  region = var.aws_region
}
