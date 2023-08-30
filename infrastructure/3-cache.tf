resource "aws_elasticache_cluster" "weather_cache" {
  cluster_id           = "weather-cache"
  engine               = "redis"
  engine_version       = "7.0"
  node_type            = "cache.t2.micro"
  num_cache_nodes      = 1
  parameter_group_name = "default.redis7"
  port                 = 6379
  subnet_group_name    = aws_elasticache_subnet_group.default.name
  security_group_ids   = [aws_security_group.cache_security_group.id]
}

resource "aws_elasticache_subnet_group" "default" {
  name       = "cache-subnet-group"
  subnet_ids = [aws_subnet.private.id]
}

output "cache_url" {
  value = aws_elasticache_cluster.weather_cache.cache_nodes.0.address
}