variable "key_name" {
  description = "Name of the SSH keypair to use in AWS."
}

variable "name" {
  description = "Name of instance"
}

variable "aws_region" {
  description = "AWS region to launch servers."
  default     = "us-east-2"
}

variable "env_file" {
  description = "environment variables"
  default     = ".env.production"
}

# ubuntu-trusty-14.04 (x64)
variable "aws_amis" {
  default = {
    "us-east-2" = "ami-6a003c0f"
    "us-west-2" = "ami-7f675e4f"
  }
}
