locals {
  content_type_map = {
    css:  "text/css; charset=UTF-8"
    js:   "text/js; charset=UTF-8"
    svg:  "image/svg+xml"
  }
}

resource "aws_s3_bucket" "weather_public" {
  bucket = "weather-demo-public" # give a unique bucket name
}

resource "aws_s3_bucket_website_configuration" "weather_public" {
  bucket = aws_s3_bucket.weather_public.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html"
  }
}

resource "aws_s3_bucket_versioning" "weather_public" {
  bucket = aws_s3_bucket.weather_public.id
  versioning_configuration {
    status = "Enabled"
  }
}

# S3 bucket ACL access

resource "aws_s3_bucket_ownership_controls" "weather_public" {
  bucket = aws_s3_bucket.weather_public.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_public_access_block" "weather_public" {
  bucket = aws_s3_bucket.weather_public.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_acl" "weather_public" {
  depends_on = [
    aws_s3_bucket_ownership_controls.weather_public,
    aws_s3_bucket_public_access_block.weather_public,
  ]

  bucket = aws_s3_bucket.weather_public.id
  acl    = "public-read"
}

resource aws_s3_object assets {
  for_each = fileset("${path.module}/../public", "**")

  bucket = aws_s3_bucket.weather_public.id
  key    = each.value
  source = "${path.module}/../public/${each.value}"
  etag   = filemd5("${path.module}/../public/${each.value}")

  // simplification of the content type serving
  content_type = lookup(
    local.content_type_map,
    split(".", basename(each.value))[length(split(".", basename(each.value))) - 1],
    "text/html; charset=UTF-8",
  )
}

resource "aws_s3_bucket_policy" "weather_public" {
  bucket = aws_s3_bucket.weather_public.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid = "PublicReadGetObject"
        Effect = "Allow"
        Principal = "*"
        Action = [
          "s3:GetObject",
          "s3:ListBucket",
        ]
        Resource = [
          "${aws_s3_bucket.weather_public.arn}",
          "${aws_s3_bucket.weather_public.arn}/*"
        ]
      }
    ]
  })
}

# s3 static website url
output "website_url" {
  value = "http://${aws_s3_bucket.weather_public.bucket}.s3-website.eu-central-1.amazonaws.com"
}