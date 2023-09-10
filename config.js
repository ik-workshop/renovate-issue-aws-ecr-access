const Fs = require('fs');

const k8sVersion = "< 1.25";
const k8sMinorVersion = "24"
const k8sProxyMinorVersion = "9"

module.exports = {
  "platform": "github",
  "token": process.env.RENOVATE_TOKEN,
  "repositories": JSON.parse(Fs.readFileSync('repos.json', 'utf8')),
  "logLevel": process.env.LOG_LEVEL,
  "gitAuthor": "Renovate Bot <bot@renovateapp.com>",
  "prConcurrentLimit": 0,
  "prHourlyLimit": 0,
  "pruneStaleBranches": true,
  "recreateWhen": "always",
  "onboarding": false,
  "requireConfig": "optional",
  "baseBranches": ["master", "main"],
  // "enabledManagers": ["helmv3", "helm-values"],
  "enabledManagers": ["kubernetes"],
  "kubernetes": {
    "fileMatch": ["\\.ya?ml$"]
  },
  "packageRules": [
    {
      "matchDatasources": ["docker"],
      "matchPackagePatterns": ['^602401143452\\..*/eks/coredns$'],
      "versioning": "regex:^v?(?<major>\\d+)\.(?<minor>\\d+)\.(?<patch>\\d+)(-eksbuild\\.\\d+)?$",
      "allowedVersions": `/1\\.${k8sProxyMinorVersion}\\.\\d+-eksbuild\\.\\d+$/`,
      "prBodyDefinitions": {
        "Compatibility": "[▶️](https://docs.aws.amazon.com/eks/latest/userguide/managing-coredns.html)",
        "Sources": "[▶️](https://github.com/coredns/coredns)",
        "Image Hub": "[▶️](https://gallery.ecr.aws/eks-distro/coredns/coredns)",
        "Tests": "[▶️](https://hbidigital.atlassian.net/wiki/spaces/PAAS/pages/5860884793/Core+DNS)"
      },
      "prBodyColumns": [
        "Current Value",
        "Package",
        "Update",
        "Change",
        "Tests",
        "Compatibility",
        "Sources",
        "Image Hub"
      ],
      "prBodyNotes": [":warning:\n 1. Validate image exists\n ```\n aws ecr get-login-password --region eu-west-1 | docker login --username AWS --password-stdin 602401143452.dkr.ecr.eu-west-1.amazonaws.com\n docker pull ...\n```\n \n2. **Test** after apply.\n"]
    },
    {
      "matchDatasources": ["docker"],
      "matchPackagePatterns": [ '^602401143452\\..*/eks/kube-proxy$'],
      "versioning": "regex:^v?(?<major>\\d+)\.(?<minor>\\d+)\.(?<patch>\\d+)(-minimal)?-eksbuild\\.\\d+$",
      "allowedVersions": `/1\\.${k8sMinorVersion}\\.[0-9]+-minimal-eksbuild.*/`,
      "prBodyDefinitions": {
        "Compatibility": "[▶️](https://docs.aws.amazon.com/eks/latest/userguide/managing-kube-proxy.html)",
        "Sources": "[▶️](https://github.com/kubernetes/kube-proxy)",
        "Image Hub": "[▶️](https://gallery.ecr.aws/eks-distro/kubernetes/kube-proxy)",
        "Tests": "[▶️](https://hbidigital.atlassian.net/wiki/spaces/PAAS/pages/5860884803/Kube+Proxy)"
      },
      "prBodyColumns": [
        "Package",
        "Update",
        "Change",
        "Tests",
        "Compatibility",
        "Sources",
        "Image Hub"
      ],
      "prBodyNotes": [":warning:\n 1. Validate image exists\n ```\n aws ecr get-login-password --region eu-west-1 | docker login --username AWS --password-stdin 602401143452.dkr.ecr.eu-west-1.amazonaws.com\n docker pull ...\n```\n \n2. **Test** after apply.\n"]
    }
  ],
  "hostRules": [
  // with amazonaws.com
    {
      "hostType": "docker",
      "matchHost": "602401143452.dkr.ecr.eu-west-1.amazonaws.com"
      // "username": process.env.AWS_ACCESS_KEY_ID,
      // "password": process.env.AWS_SECRET_ACCESS_KEY
    },
    // not required
    // {
    //   "hostType": "docker",
    //   "matchHost": "602401143452.dkr.ecr.eu-west-1.amazonaws.com",
    //   "username": "AWS",
    //   // "password": process.env.RENOVATE_AWS_ECR_PWD
    //   "encrypted": {
    //     "password": process.env.RENOVATE_AWS_ECR_PWD
    //   }
    // },
    // without amazonaws.com
    // {
    //   "hostType": "docker",
    //   "matchHost": "602401143452.dkr.ecreu-west-1",
    //   "username": "AWS",
    //   "encrypted": {
    //     "password": process.env.RENOVATE_AWS_ECR_PWD
    //   }
    // },
    // {
    //   "hostType": "docker",
    //   "matchHost": "602401143452.dkr.ecr",
    //   "username": process.env.AWS_ACCESS_KEY_ID,
    //   "encrypted": {
    //     "password": process.env.AWS_SECRET_ACCESS_KEY
    //   }
    // }
  ]
}