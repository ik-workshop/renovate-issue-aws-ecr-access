const Fs = require('fs');

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
  "hostRules": [
    {
      "hostType": "docker",
      "matchHost": "602401143452.dkr.ecr",
      "token": process.env.RENOVATE_AWS_ECR_PWD
    },
    {
      "hostType": "docker",
      "enabled": "true",
      "matchHost": "602401143452.dkr.ecr",
      "username": process.env.AWS_ACCESS_KEY_ID,
      "encrypted": {
        "password": process.env.AWS_SECRET_ACCESS_KEY
      }
    },
    {
      "hostType": "docker",
      "matchHost": "public.ecr.aws",
      "username": process.env.AWS_ACCESS_KEY_ID,
      "encrypted": {
        "password": process.env.AWS_SECRET_ACCESS_KEY
      }
    }
  ]
}