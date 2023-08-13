#!/bin/bash

# Trying to generate credentials with signature and login

AWS_ACCOUNT="602401143452"
AWS_REGION="eu-west-1"
REPO_NAME="eks/coredns"
AWS_SERVICE="ecr"

# Request Information
REQUEST_URL="https://${AWS_ACCOUNT}.dkr.ecr.${AWS_REGION}.amazonaws.com/v2/${REPO_NAME}/manifests/latest"

# Generate the signature
DATE=$(date -u +"%Y%m%dT%H%M%SZ")
SIGNATURE=$(echo -n "GET
${REQUEST_URL}
host:${AWS_ACCOUNT}.dkr.ecr.${AWS_REGION}.amazonaws.com
x-amz-date:${DATE}
" | openssl sha256 -hmac "${AWS_SECRET_KEY}" -binary | openssl base64 -A)

# Make the curl request
curl -v "${REQUEST_URL}" \
  -H "Authorization: AWS4-HMAC-SHA256 Credential=${AWS_ACCESS_KEY}/${DATE}/${AWS_REGION}/${AWS_SERVICE}/aws4_request, SignedHeaders=host;x-amz-date, Signature=${SIGNATURE}" \
  -H "Host: ${AWS_ACCOUNT}.dkr.ecr.${AWS_REGION}.amazonaws.com" \
  -H "x-amz-date: ${DATE}"

