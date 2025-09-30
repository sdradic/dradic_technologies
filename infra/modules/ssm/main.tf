resource "aws_ssm_parameter" "supabase_url" {
  name = "/${var.project_name}/SUPABASE_URL"
  type = "SecureString"
  # Create with placeholder value - will be overwritten by deployment script
  value = "placeholder-will-be-overwritten"

  lifecycle {
    ignore_changes = [value] # Ignore value changes to prevent drift
  }

  tags = {
    Resource    = "SSM Parameter"
    Environment = var.environment
    Project     = var.project_name
    ManagedBy   = "terraform"
  }
}

resource "aws_ssm_parameter" "supabase_service_role_key" {
  name  = "/${var.project_name}/SUPABASE_SERVICE_ROLE_KEY"
  type  = "SecureString"
  value = "placeholder-will-be-overwritten"

  lifecycle {
    ignore_changes = [value]
  }

  tags = {
    Resource    = "SSM Parameter"
    Environment = var.environment
    Project     = var.project_name
    ManagedBy   = "terraform"
  }
}
resource "aws_ssm_parameter" "supabase_database_url" {
  name = "/${var.project_name}/SUPABASE_DATABASE_URL"
  type = "SecureString"
  # Create with placeholder value - will be overwritten by deployment script
  value = "placeholder-will-be-overwritten"

  lifecycle {
    ignore_changes = [value] # Ignore value changes to prevent drift
  }

  tags = {
    Resource    = "SSM Parameter"
    Environment = var.environment
    Project     = var.project_name
    ManagedBy   = "terraform"
  }
}

resource "aws_ssm_parameter" "supabase_storage_access_key_id" {
  name  = "/${var.project_name}/SUPABASE_STORAGE_ACCESS_KEY_ID"
  type  = "SecureString"
  value = "placeholder-will-be-overwritten"

  lifecycle {
    ignore_changes = [value]
  }

  tags = {
    Resource    = "SSM Parameter"
    Environment = var.environment
    Project     = var.project_name
    ManagedBy   = "terraform"
  }
}

resource "aws_ssm_parameter" "supabase_storage_secret_access_key" {
  name  = "/${var.project_name}/SUPABASE_STORAGE_SECRET_ACCESS_KEY"
  type  = "SecureString"
  value = "placeholder-will-be-overwritten"

  lifecycle {
    ignore_changes = [value]
  }

  tags = {
    Resource    = "SSM Parameter"
    Environment = var.environment
    Project     = var.project_name
    ManagedBy   = "terraform"
  }
}
