terraform {
  backend "s3" {
    bucket         = "dradic-tech-terraform-state-prod"
    key            = "terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform-locks-prod"
    encrypt        = true
  }
}
