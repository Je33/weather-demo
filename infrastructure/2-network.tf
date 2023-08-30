resource "aws_vpc" "default" {
  cidr_block = "10.0.0.0/16"
}

resource "aws_internet_gateway" "default" {
  vpc_id = aws_vpc.default.id
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.default.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.default.id
  }
}

resource "aws_route_table" "private" {
  vpc_id = aws_vpc.default.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.default.id
  }
}

resource "aws_route_table_association" "public" {
  route_table_id = aws_route_table.public.id
  subnet_id      = aws_subnet.public.id
}

resource "aws_route_table_association" "private" {
  route_table_id = aws_route_table.private.id
  subnet_id      = aws_subnet.private.id
}

resource "aws_subnet" "public" {
  vpc_id     = aws_vpc.default.id
  cidr_block = "10.0.0.0/17"
}

resource "aws_subnet" "private" {
  vpc_id     = aws_vpc.default.id
  cidr_block = "10.0.128.0/17"
}

resource "aws_nat_gateway" "default" {
  allocation_id = aws_eip.default.id
  subnet_id     = aws_subnet.public.id
}

resource "aws_eip" "default" {
  domain = "vpc"
}

resource "aws_security_group" "lambda_security_group" {
  vpc_id = aws_vpc.default.id
  name   = "lambda-security-group"
}

resource "aws_security_group_rule" "lambda_cache_egress_rule" {
  type                     = "egress"
  protocol                 = "tcp"
  from_port                = aws_elasticache_cluster.weather_cache.port
  to_port                  = aws_elasticache_cluster.weather_cache.port
  security_group_id        = aws_security_group.lambda_security_group.id
  source_security_group_id = aws_security_group.cache_security_group.id
}

resource "aws_security_group_rule" "lambda_public_internet_egress_rule" {
  type              = "egress"
  protocol          = "tcp"
  from_port         = 443
  to_port           = 443
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.lambda_security_group.id
}

resource "aws_security_group" "cache_security_group" {
  vpc_id = aws_vpc.default.id
  name   = "cache-security-group"
}

resource "aws_security_group_rule" "cache_ingress_rule" {
  type                     = "ingress"
  protocol                 = "tcp"
  from_port                = aws_elasticache_cluster.weather_cache.port
  to_port                  = aws_elasticache_cluster.weather_cache.port
  security_group_id        = aws_security_group.cache_security_group.id
  source_security_group_id = aws_security_group.lambda_security_group.id
}