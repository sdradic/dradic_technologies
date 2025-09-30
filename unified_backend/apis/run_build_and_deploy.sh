#!/bin/bash
set -e

# Minimal script to build Docker image and push to ECR
# Usage: ./run_build_and_deploy.sh <commit_sha> <environment>

COMMIT_SHA=$1
ENVIRONMENT=$2
echo "COMMIT_SHA: $COMMIT_SHA"
echo "ENVIRONMENT: $ENVIRONMENT"

if [ -z "$COMMIT_SHA" ] || [ -z "$ENVIRONMENT" ]; then
    echo "Usage: $0 <commit_sha> <environment>"
    echo "Environment should be DEV or PROD"
    exit 1
fi

# Set image tag
if [ "$ENVIRONMENT" = "PROD" ]; then
    IMAGE_TAG="prod-${COMMIT_SHA:0:8}"
else
    IMAGE_TAG="dev-${COMMIT_SHA:0:8}"
fi

echo "🚀 Building and pushing image for $ENVIRONMENT environment"
echo "📦 Image tag: $IMAGE_TAG"

# Check if Terraform is initialized and get ECR repository URL
echo "🏗️  Getting ECR repository from Terraform..."
lowercase_environment=$(echo $ENVIRONMENT | tr '[:upper:]' '[:lower:]')
cd ../../infra/environments/$lowercase_environment
terraform init
# Check if ECR repository already exists and get URL
if ECR_REPO_URL=$(terraform output -raw ecr_repository_url 2>/dev/null); then
    echo "✅ ECR Repository exists: $ECR_REPO_URL"

    # Optional: Check for infrastructure drift
    if terraform plan -detailed-exitcode >/dev/null 2>&1; then
        echo "✅ Infrastructure is up to date"
    else
        echo "⚠️  Infrastructure changes detected, applying..."
        terraform apply -auto-approve
        ECR_REPO_URL=$(terraform output -raw ecr_repository_url)
    fi
else
    echo "🚀 Creating infrastructure..."
    terraform apply -auto-approve
fi

# Get all required outputs
AWS_REGION=$(terraform output -raw aws_region)
ECR_REPO_URL=$(terraform output -raw ecr_repository_url)
PROJECT_NAME=$(terraform output -raw project_name)
# EC2_PUBLIC_IP=$(terraform output -raw ec2_public_ip 2>/dev/null || echo "")
# SSH_USER=$(terraform output -raw ssh_user 2>/dev/null || echo "ubuntu")

# Export outputs for GitHub Actions
if [ -n "$GITHUB_OUTPUT" ]; then
    echo "ecr_repository_url=$ECR_REPO_URL" >> $GITHUB_OUTPUT
    echo "project_name=$PROJECT_NAME" >> $GITHUB_OUTPUT
    # echo "ec2_public_ip=$EC2_PUBLIC_IP" >> $GITHUB_OUTPUT
    # echo "ssh_user=$SSH_USER" >> $GITHUB_OUTPUT
    echo "aws_region=$AWS_REGION" >> $GITHUB_OUTPUT
fi

# Inject secrets into SSM
echo "SUPABASE_URL=$SUPABASE_URL"
echo "SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE_ROLE_KEY"
echo "SUPABASE_DATABASE_URL=$SUPABASE_DATABASE_URL"
echo "SUPABASE_STORAGE_ACCESS_KEY_ID=$SUPABASE_STORAGE_ACCESS_KEY_ID"
echo "SUPABASE_STORAGE_SECRET_ACCESS_KEY=$SUPABASE_STORAGE_SECRET_ACCESS_KEY"
echo "🔑 Injecting secrets into SSM..."
aws ssm put-parameter --name "/${PROJECT_NAME}/${lowercase_environment}/SUPABASE_URL" --value $SUPABASE_URL --type String --overwrite
aws ssm put-parameter --name "/${PROJECT_NAME}/${lowercase_environment}/SUPABASE_SERVICE_ROLE_KEY" --value $SUPABASE_SERVICE_ROLE_KEY --type String --overwrite
aws ssm put-parameter --name "/${PROJECT_NAME}/${lowercase_environment}/SUPABASE_DATABASE_URL" --value $SUPABASE_DATABASE_URL --type String --overwrite
aws ssm put-parameter --name "/${PROJECT_NAME}/${lowercase_environment}/SUPABASE_STORAGE_ACCESS_KEY_ID" --value $SUPABASE_STORAGE_ACCESS_KEY_ID --type String --overwrite
aws ssm put-parameter --name "/${PROJECT_NAME}/${lowercase_environment}/SUPABASE_STORAGE_SECRET_ACCESS_KEY" --value $SUPABASE_STORAGE_SECRET_ACCESS_KEY --type String --overwrite

# Go back to APIs directory
cd ../../../unified_backend/apis

# Login to ECR
echo "🔐 Logging into ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REPO_URL

# Build the Docker image
echo "🔨 Building image: $ECR_REPO_URL:$IMAGE_TAG"
docker build -t $ECR_REPO_URL:$IMAGE_TAG .

# Also tag as latest for the environment
echo "🔖 Tagging image: $ECR_REPO_URL:$IMAGE_TAG as $ECR_REPO_URL:latest"
docker tag $ECR_REPO_URL:$IMAGE_TAG $ECR_REPO_URL:latest

# Push both tags
echo "📤 Pushing image to ECR..."
docker push $ECR_REPO_URL:latest
docker push $ECR_REPO_URL:$IMAGE_TAG

echo "✅ Image pushed successfully to ECR!"
echo "🏷️  Image: $ECR_REPO_URL:$IMAGE_TAG"
