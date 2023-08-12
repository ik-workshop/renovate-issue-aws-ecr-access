# Renovate is not able to access Amazon EKS ECR private repositories

- [Amazon container image registries](https://docs.aws.amazon.com/eks/latest/userguide/add-ons-images.html)

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

### Expected result

## Resources

### Commands

```sh
$ skopeo list-tags docker://602401143452.dkr.ecr.eu-west-1.amazonaws.com/eks/coredns
> FATA[0000] Error listing repository tags: fetching tags list: authentication required
$ aws ecr get-login-password --region eu-west-1 | docker login --username AWS --password-stdin 602401143452.dkr.ecr.eu-west-1.amazonaws.com
> Login Succeeded

$ aws ecr get-authorization-token --region eu-west-1
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

---

<!-- resources -->
[template.generate]: https://github.com/ik-workshop/renovate-issue-aws-ecr-access/generate
[code-style.badge]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
