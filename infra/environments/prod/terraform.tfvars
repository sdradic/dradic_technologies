instance_name        = "dradic-tech-ec2-prod"
key_name             = "dradic-tech-key"
my_ip                = "181.226.177.231/32"
aws_region           = "us-east-1"
cluster_name         = "dradic-tech-cluster-prod"
service_name         = "dradic-tech-service"
task_definition_name = "dradic-tech-task-definition-prod"
container_image      = "dradic-tech-backend:latest"
container_port       = 8000
desired_count        = 1
project_name         = "dradic-tech-prod"
repository_name      = "dradic-tech-backend-prod"
ecs_secrets = [
  {
    name      = "SUPABASE_URL"
    valueFrom = "/dradic-tech-prod/SUPABASE_URL"
  },
  {
    name      = "SUPABASE_SERVICE_ROLE_KEY"
    valueFrom = "/dradic-tech-prod/SUPABASE_SERVICE_ROLE_KEY"
  },
  {
    name      = "SUPABASE_DATABASE_URL"
    valueFrom = "/dradic-tech-prod/SUPABASE_DATABASE_URL"
  },
  {
    name      = "SUPABASE_STORAGE_ACCESS_KEY_ID"
    valueFrom = "/dradic-tech-prod/SUPABASE_STORAGE_ACCESS_KEY_ID"
  },
  {
    name      = "SUPABASE_STORAGE_SECRET_ACCESS_KEY"
    valueFrom = "/dradic-tech-prod/SUPABASE_STORAGE_SECRET_ACCESS_KEY"
  }
]
