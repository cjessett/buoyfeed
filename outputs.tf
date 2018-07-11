output "public dns" {
  value = "${aws_instance.web.public_dns}"
}

output "public ip" {
  value = "${aws_instance.web.public_ip}"
}

output "alias" {
  value = "ssh -i ~/.ssh/${var.key_name}.pem ubuntu@${aws_instance.web.public_dns}"
}
