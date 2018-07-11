# Specify the provider and access details
provider "aws" {
  region = "${var.aws_region}"
}

# Our default security group to access
# the instances over SSH and HTTP
resource "aws_security_group" "instance" {
  name        = "${var.name}_instance_sg"
  description = "Used in the terraform"

  # SSH access from anywhere
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # HTTP access from anywhere
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # HTTPS access from anywhere
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Redis access
  ingress {
    from_port    = 6379
    to_port      = 6379
    protocol     = "tcp"
    cidr_blocks  = ["0.0.0.0/0"]
  }

  # outbound internet access
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "web" {
  instance_type = "t2.micro"

  # Lookup the correct AMI based on the region
  # we specified
  ami = "${lookup(var.aws_amis, var.aws_region)}"

  # The name of our SSH keypair you've created and downloaded
  # from the AWS console.
  #
  # https://console.aws.amazon.com/ec2/v2/home?region=us-west-2#KeyPairs:
  #
  key_name = "${var.key_name}"
  connection {
    user = "ubuntu"
    host = "${self.public_dns}"
  }

  # Our Security group to allow HTTP and SSH access
  vpc_security_group_ids = ["${aws_security_group.instance.id}"]
  user_data              = "${file("userdata.sh")}"

  # environment variables
  provisioner "file" {
    source      = "${var.env_file}"
    destination = "~/config-env.sh"
  }

  provisioner "remote-exec" {
    inline = [
      "sudo mv ~/config-env.sh /etc/profile.d/",
    ]
  }

  # user_data script
  provisioner "file" {
    source      = "userdata.sh"
    destination = "/tmp/script.sh"
  }

  provisioner "remote-exec" {
    inline = [
      "chmod +x /tmp/script.sh",
      "/tmp/script.sh args",
    ]
  }

  # nginx config
  provisioner "file" {
    source      = "~/dev/nginx/cjessett"
    destination = "~/cjessett"
  }

  provisioner "remote-exec" {
    inline = [
      "sudo mv ~/cjessett /etc/nginx/sites-enabled/"
    ]
  }

  # Instance tags
  tags {
    Name = "${var.name}"
  }
}
