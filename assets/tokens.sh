#!/bin/bash

USERNAME="AWS"
PASSWORD="${AWS_PWD}"
DOCKER_REGISTRY="602401143452.dkr.ecr.eu-west-1.amazonaws.com"

curl -X POST -H "Content-Type: application/json" \
                -d '{"username": "'"${USERNAME}"'", "password": "'"${AWS_PWD}"'"}' \
                "${DOCKER_REGISTRY}/v2/users/login"

# ACCESS_TOKEN=$(curl -X POST -H "Content-Type: application/json" \
#                 -d '{"username": "'"${USERNAME}"'", "password": "'"${PASSWORD}"'"}' \
#                 "${DOCKER_REGISTRY}/v2/users/login" | jq -r '.token')

# curl -H "Authorization: Bearer ${ACCESS_TOKEN}" "${DOCKER_REGISTRY}/v2/<repository-name>/manifests/<tag>"
