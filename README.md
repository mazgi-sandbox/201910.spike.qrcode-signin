_This document still works in progress._

## Before you begin

### Required

- [docker & docker-compose](https://www.docker.com)
- [mkcert](https://github.com/FiloSottile/mkcert)
- [direnv](https://github.com/direnv/direnv)
- [gcloud](https://cloud.google.com/sdk/gcloud/)

## Before development

### (optional) Create the ENV file for Docker

Create the `.env` file like bellow.

on macOS

```
BIND_IP_ADDR=192.168.65.1
```

on Linux

```
BIND_IP_ADDR=192.168.65.1
UID=1000
GID=100
```

### Setup direnv

Edit the `.envrc` file with `direnv edit .` command.

### Generate the key pair

Generate the key pair via openssl command like bellow.

```shellsession
openssl genrsa -out ${DEV_CREDENTIALS_DIR}/key.pem 4096
openssl rsa -in ${DEV_CREDENTIALS_DIR}/key.pem -pubout -out ${DEV_CREDENTIALS_DIR}/pubkey.pem
```

### Setup your GCP project

Should enable those APIs.

- Compute Engine API
  - https://console.cloud.google.com/apis/library/compute.googleapis.com
- Kubernetes Engine API
  - https://console.cloud.google.com/apis/library/container.googleapis.com
- Cloud SQL Admin API
  - https://console.cloud.google.com/apis/library/sqladmin.googleapis.com

#### Create a service account on your GCP project

https://cloud.google.com/sdk/gcloud/reference/auth/activate-service-account

And generate private key for your service account.

### (optional) Create a Cloud Storage bucket for development.

see https://cloud.google.com/storage/docs/gsutil

```shellsession
docker-compose run provisioning bash -l
gsutil mb gs://${DEV_GOOGLE_CLOUD_STORAGE_BUCKET_DEFAULT}/
gsutil acl set private gs://${DEV_GOOGLE_CLOUD_STORAGE_BUCKET_DEFAULT}/
gsutil versioning set on gs://${DEV_GOOGLE_CLOUD_STORAGE_BUCKET_DEFAULT}/
```

Upload development config file to Cloud Storage.

```shellsession
docker-compose run provisioning bash -c 'source .envrc && gsutil cp ${DEV_CONFIG_DIR}/bff/config.gcs.json gs://${DEV_GOOGLE_CLOUD_STORAGE_BUCKET_DEFAULT}/${BFF_CONFIG_SOURCE_GOOGLE_CLOUD_STORAGE_FILENAME}'
```

### (optional) Create a Amazon S3 bucket for development.

see https://docs.aws.amazon.com/cli/latest/reference/s3api

```shellsession
docker-compose run provisioning bash -l
aws s3api create-bucket --bucket ${DEV_AMAZON_S3_BUCKET_DEFAULT}
aws s3api put-bucket-versioning --bucket ${DEV_AMAZON_S3_BUCKET_DEFAULT} --versioning-configuration Status=Enabled
```

Upload development config file to S3.

```shellsession
docker-compose run provisioning bash -c 'source .envrc && aws s3 cp ${DEV_CONFIG_DIR}/bff/config.s3.json s3://${DEV_AMAZON_S3_BUCKET_DEFAULT}/${BFF_CONFIG_SOURCE_AMAZON_S3_FILENAME}'
```
