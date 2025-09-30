# Use default VPC
data "aws_vpc" "default" {
  count   = var.use_default_vpc ? 1 : 0
  default = true
}

### Or create a new one
# Create a new VPC
resource "aws_vpc" "custom" {
  count                = var.use_default_vpc ? 0 : 1
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true
  tags = {
    Service  = "VPC"
    Resource = "${var.project_name}-vpc"
  }
}

# Get available AZs
data "aws_availability_zones" "available" {
  state = "available"
}

# Get subnets for default VPC or create new ones
data "aws_subnets" "default" {
  count = var.use_default_vpc ? 1 : 0
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default[0].id]
  }
}

# Create subnets for custom VPC
resource "aws_subnet" "custom" {
  count                   = var.use_default_vpc ? 0 : 1
  vpc_id                  = aws_vpc.custom[0].id
  cidr_block              = cidrsubnet(var.vpc_cidr, 8, count.index)
  availability_zone       = data.aws_availability_zones.available.names[count.index]
  map_public_ip_on_launch = true
  tags = {
    Service  = "Subnet"
    Resource = "${var.project_name}-subnet"
  }
}

# Internet Gateway for Custom VPC
resource "aws_internet_gateway" "custom" {
  count  = var.use_default_vpc ? 0 : 1
  vpc_id = aws_vpc.custom[0].id
  tags = {
    Service  = "Internet Gateway"
    Resource = "${var.project_name}-internet-gateway"
  }
}

# Route table for Custom VPC
resource "aws_route_table" "custom" {
  count  = var.use_default_vpc ? 0 : 1
  vpc_id = aws_vpc.custom[0].id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.custom[0].id
  }

  tags = {
    Service  = "Route Table"
    Resource = "${var.project_name}-route-table"
  }
}

# Route table association for Custom VPC
resource "aws_route_table_association" "custom" {
  count          = var.use_default_vpc ? 0 : 1
  subnet_id      = aws_subnet.custom[count.index].id
  route_table_id = aws_route_table.custom[count.index].id
}

# Security group for ECS
resource "aws_security_group" "ecs_sg" {
  name_prefix = "${var.project_name}-ecs-sg"
  vpc_id      = var.use_default_vpc ? data.aws_vpc.default[0].id : aws_vpc.custom[0].id
  ingress {
    from_port   = 8000
    to_port     = 8000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  tags = {
    Service  = "Security Group"
    Resource = "${var.project_name}-ecs-sg"
  }
}
