# Renovate is not able to access Amazon EKS ECR private repositories

- [Issue/Question](https://github.com/renovatebot/renovate/discussions/23837)
- [Amazon container image registries](https://docs.aws.amazon.com/eks/latest/userguide/add-ons-images.html)

![not authorized can't list images](assets/cannot-list-tags.png "not authorized can't list images")
![authorized](assets/can-list-tags.png "authorized and can list tags")


---

![](https://img.shields.io/github/commit-activity/m/ik-workshop/renovate-issue-aws-ecr-access/)
![](https://img.shields.io/github/last-commit/ik-workshop/renovate-issue-aws-ecr-access/)
[![](https://img.shields.io/github/license/ivankatliarchuk/.github)](https://github.com/ivankatliarchuk/.github/LICENCE)
[![](https://img.shields.io/github/languages/code-size/ik-workshop/renovate-issue-aws-ecr-access/)](https://github.com/ik-workshop/renovate-issue-aws-ecr-access/)
[![](https://img.shields.io/github/repo-size/ik-workshop/renovate-issue-aws-ecr-access/)](https://github.com/ik-workshop/renovate-issue-aws-ecr-access/)
![](https://img.shields.io/github/languages/top/ik-workshop/renovate-issue-aws-ecr-access/?color=green&logo=markdown&logoColor=blue)

---

## Issue

### Current result

[logs](output.log)

```json
       "config": {
         "helm-values": [
           {
             "deps": [
               {
                 "depName": "602401143452.dkr.ecr.eu-west-1.amazonaws.com/eks/coredns",
                 "currentValue": "v1.8.7",
                 "datasource": "docker",
                 "replaceString": "v1.8.7",
                 "versioning": "docker",
                 "autoReplaceStringTemplate": "{{newValue}}{{#if newDigest}}@{{newDigest}}{{/if}}",
                 "updates": [],
                 "packageName": "602401143452.dkr.ecr.eu-west-1.amazonaws.com/eks/coredns",
                 "warnings": [
                   {
                     "topic": "602401143452.dkr.ecr.eu-west-1.amazonaws.com/eks/coredns",
                     "message": "Failed to look up docker package 602401143452.dkr.ecr.eu-west-1.amazonaws.com/eks/coredns"
                   }
                 ]
               }
             ],
             "packageFile": "examples/values.yaml"
           }
         ]
       }
```

### Expected result

At least one of the host rules is working

```json
    {
      "hostType": "docker",
      "matchHost": "602401143452.dkr.ecr",
      "username": "AWS",
      "password": process.env.RENOVATE_AWS_ECR_PWD
    },
    {
      "hostType": "docker",
      "matchHost": "602401143452.dkr.ecr",
      "username": "AWS",
      "encrypted": {
        "password": process.env.RENOVATE_AWS_ECR_PWD
      }
    },
    {
      "hostType": "docker",
      "matchHost": "602401143452.dkr.ecr",
      "username": process.env.AWS_ACCESS_KEY_ID,
      "encrypted": {
        "password": process.env.AWS_SECRET_ACCESS_KEY
      }
    }
```

## Resources

### Commands

```sh
$ skopeo list-tags docker://602401143452.dkr.ecr.eu-west-1.amazonaws.com/eks/coredns
> FATA[0000] Error listing repository tags: fetching tags list: authentication required
$ aws ecr get-login-password --region eu-west-1 | docker login --username AWS --password-stdin 602401143452.dkr.ecr.eu-west-1.amazonaws.com
> Login Succeeded
$ ECR_PWD=$(aws ecr get-login-password --region eu-west-1)
$ skopeo list-tags --creds AWS:$ECR_PWD docker://602401143452.dkr.ecr.eu-west-1.amazonaws.com/eks/coredns
> {
    "Repository": "602401143452.dkr.ecr.eu-west-1.amazonaws.com/eks/coredns",
    "Tags": [
        "v1.8.3",
        "v1.8.3-eksbuild.1",
        "v1.8.7-eksbuild.7-linux_amd64",
        "v1.6.9-eksbuild.1",
        "v1.7.0-eksbuild.1-linux_amd64",
        "v1.7.0-eksbuild.1",
        "v1.8.3-eksbuild.1-linux_amd64",
}
# trying to access Amazon specific AWS repository with personal credentials
$ aws ecr list-images --repository-name 602401143452.dkr.ecr.eu-west-1.amazonaws.com/eks/coredns --region eu-west-1

$ export AWS_ECR_PWD=$(aws ecr get-login-password --region eu-west-1)
$ curl -u AWS:$AWS_ECR_PWD https://602401143452.dkr.ecr.eu-west-1.amazonaws.com/v2/library/eks/coredns/tags/list

$ skopeo list-tags --debug --creds AWS:$ECR_PWD docker://602401143452.dkr.ecr.eu-west-1.amazonaws.com/eks/coredns

curl -vks https://602401143452.dkr.ecr.us-west-2.amazonaws.com/amazon-k8s-cni:v1.3.2
aws ecr get-login-password --region eu-west-1

To use with the Docker CLI, pipe the output of the get-login-password command to the docker login command. When retrieving the password, ensure that you specify the same Region that your Amazon ECR registry exists in.

$ aws ecr get-login-password \
    --region eu-west-1 \
| docker login \
    --username AWS \
    --password-stdin 602401143452.dkr.ecr.eu-west-1.amazonaws.com

AWS_PWD=$(aws ecr get-login-password --region eu-west-1)
AWS_PWD_BASE64=$(echo "AWS:$AWS_PWD" | base64)
AWS_PWD_BASE64=$(echo "$AWS_ACCESS_KEY_ID:$AWS_SECRET_ACCESS_KEY" | base64)
curl https://602401143452.dkr.ecr.eu-west-1.amazonaws.com/v2/library/eks/coredns/tags/list -H "Authorization: Basic $AWS_PWD_BASE64"

curl https://602401143452.dkr.ecr.eu-west-1.amazonaws.com/v2/library/eks/coredns/tags/list -H "Authorization: Bearer $AWS_DOCKER_TOKEN"

aws ecr get-authorization-token --region us-east-1 --output text --query authorizationData[].authorizationToken | base64 -d | cut -d: -f2
# not working
curl https://AWS:$AWS_DOCKER_TOKEN@602401143452.dkr.ecr.eu-west-1.amazonaws.com/v2/library/eks/coredns/tags/list
curl https://AWS:$AWS_PWD@602401143452.dkr.ecr.eu-west-1.amazonaws.com/v2/library/eks/coredns/tags/list
curl https://$AWS_ACCESS_KEY_ID:$AWS_SECRET_ACCESS_KEY@602401143452.dkr.ecr.eu-west-1.amazonaws.com/v2/library/eks/coredns/tags/list
TOKEN=$(aws ecr get-authorization-token --output text --query 'authorizationData[].authorizationToken' --region eu-west-1)
curl -i -H "Authorization: Basic $TOKEN" https://602401143452.dkr.ecr.eu-west-1.amazonaws.com/v2/amazonlinux/tags/list
curl -i -H "Authorization: Bearer $TOKEN" https://602401143452.dkr.ecr.eu-west-1.amazonaws.com/v2/amazonlinux/tags/list
curl -i -H "Authorization: Basic $TOKEN" https://602401143452.dkr.ecr.eu-west-1.amazonaws.com/v2/library/eks/coredns/tags/list
curl -i -H "Authorization: Basic $TOKEN" 'https://602401143452.dkr.ecr.eu-west-1.amazonaws.com/token'

curl --url 'https://api.ecr.eu-west-1.amazonaws.com' --aws-sigv4 "aws:amz:eu-west-1:ecr" --user "AWS:$AWS_PWD"

$ aws ecr-public get-login-password \
     --region eu-west-1 | helm registry login \
     --username AWS \
     --password-stdin public.ecr.aws
$ curl -k https://public.ecr.aws/token/ | jq -r '.token'
$ curl -k https://602401143452.dkr.ecr.eu-west-1.amazonaws.com/token/ | jq -r '.token'

aws ecr describe-images --repository-name eks/coredns --registry-id 602401143452 --region eu-west-1

curl -v -k -u AWS:$AWS_PWD https://602401143452.dkr.ecr.eu-west-1.amazonaws.com/v2/token
curl -v -k -u AWS:$AWS_PWD https://602401143452.dkr.ecr.eu-west-1.amazonaws.com/v2/users/login?refresh_token=true

curl -v -k -u AWS:$AWS_PWS https:// ... /v2/token
curl -H "Authorization: Bearer $AWS_PWD" https://602401143452.dkr.ecr.eu-west-1.amazonaws.com/v2/eks/coredns/manifests/latest

USERNAME="AWS"
REGISTRY_URL="602401143452.dkr.ecr.eu-west-1.amazonaws.com"
AWS_DOCKER_LOGIN_TOKEN=$(security find-internet-password -w -s "$REGISTRY_URL" -a "AWS")
curl -u "${USERNAME}:${AWS_DOCKER_LOGIN_TOKEN}" "https://602401143452.dkr.ecr.eu-west-1.amazonaws.com/v2/eks/coredns/tags/list"
curl -v -H "Authorization: Bearer $AWS_DOCKER_LOGIN_TOKEN" https://602401143452.dkr.ecr.eu-west-1.amazonaws.com/v2/eks/coredns/manifests/latest
curl -v -H "Authorization: Bearer $AWS_DOCKER_LOGIN_TOKEN" https://602401143452.dkr.ecr.eu-west-1.amazonaws.com/v2/eks/coredns/tags/list
curl -v -H "Authorization: Bearer $AWS_DOCKER_LOGIN_TOKEN" https://602401143452.dkr.ecr.eu-west-1.amazonaws.com/eks/coredns/tags/list

AUTH=$(echo "AWS:$AWS_PWD" | base64 | tr -d "\n")

# only for username AWS
USER="AWS"
AWS_PWD=$(aws ecr get-login-password --region eu-west-1)
BASIC_AUTH=$(echo "$USER:$AWS_PWD" | base64 | tr -d "\n")
curl -H "Authorization: Basic $BASIC_AUTH" https://602401143452.dkr.ecr.eu-west-1.amazonaws.com/v2/eks/coredns/tags/list | jq
curl -H "Authorization: Basic $BASIC_AUTH" https://602401143452.dkr.ecr.eu-west-1.amazonaws.com/v2/eks/kube-proxy/tags/list | jq
```

### Renovate Docs

- [Example Exercises](./examples)
- [Useful info](./docs/Notes.md)
- [Configuration Options](https://docs.renovatebot.com/configuration-options/)

### Renovate somewhere similar Issues

- [Issue-19241](https://github.com/renovatebot/renovate/issues/19241)
- [Issue-16912](https://github.com/renovatebot/renovate/issues/16912)
- [Issue-11000](https://github.com/helm/helm/issues/11000)
- [Issue-11322 use instance profile](https://github.com/renovatebot/renovate/issues/11322)
- [issue-3800 Renovate fails to get Docker tags from AWS ECR](https://github.com/renovatebot/renovate/issues/3800)
- [issue-6885 ECR repository behind friendly URL throws errors](https://github.com/renovatebot/renovate/issues/6885)

### Supporting Docs

- [Renovate manager](https://docs.renovatebot.com/modules/manager/)
- [Renovate home sources](https://github.com/renovatebot/renovate/blob/main/lib/modules/manager/helmv3/artifacts.ts#L36)
- [ECR content discovery](https://github.com/opencontainers/distribution-spec/blob/main/spec.md#content-discovery)
- [Public ECR gallery](https://gallery.ecr.aws/)
- [Renovate connect to AWS ECR registry](https://docs.renovatebot.com/docker/#aws-ecr-amazon-web-services-elastic-container-registry)
- [Authenticate to AWS REgistry](https://docs.aws.amazon.com/eks/latest/userguide/copy-image-to-repository.html)
- [Amazon Container Image Registries](https://docs.aws.amazon.com/eks/latest/userguide/add-ons-images.html)
- [AWS CLI public registries](https://docs.aws.amazon.com/cli/latest/reference/ecr-public/index.html)
- [Docker API](https://docs.docker.com/registry/spec/api/)
- [AWS ECR public registries](https://docs.aws.amazon.com/AmazonECR/latest/public/public-registries.html)
- [AWS Endpoints](https://docs.aws.amazon.com/general/latest/gr/ecr.html)
- [AWS get login password](https://docs.aws.amazon.com/cli/latest/reference/ecr/get-login-password.html)

---

<!-- resources -->
[template.generate]: https://github.com/ik-workshop/renovate-issue-aws-ecr-access/generate
[code-style.badge]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
