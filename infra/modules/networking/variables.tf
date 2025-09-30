variable "use_default_vpc" {
  type        = bool
  description = "Whether to use the default VPC"
  default     = true
}

variable "vpc_cidr" {
  type        = string
  description = "The CIDR block for the VPC"
  default     = "10.0.0.0/16"
}

variable "project_name" {
  type        = string
  description = "The name of the project"
}
