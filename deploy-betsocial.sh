#!/bin/bash
# Copy the files to AWS S3 Bucket

AWS_S3_BUCKET_NAME="betsocial.wee.bet"
AWS_CLOUDFRONT_ID="E3OFUSNR4BUSMW"
AWS_PROFILE="default"

# Build the project

npm install
npm run build

# Sync the files to the S3 bucket
aws s3 sync ./dist/ s3://$AWS_S3_BUCKET_NAME --acl public-read --delete --profile $AWS_PROFILE

# Invalidate the CloudFront cache
aws cloudfront create-invalidation --distribution-id $AWS_CLOUDFRONT_ID --paths "/*" --profile $AWS_PROFILE
