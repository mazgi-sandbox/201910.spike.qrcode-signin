FROM google/cloud-sdk:263.0.0

# Set in non-interactive mode.
ENV DEBIAN_FRONTEND=noninteractive
# ENV CLOUDSDK_CONFIG=/.config/gcloud

ENV DIRENV_VERSION=2.20.0
ENV TERRAFORM_VERSION=0.12.9
ENV HELM_VERSION=2.14.3

RUN apt-get update \
  && apt-get install --assume-yes --no-install-recommends locales procps dialog \
  # Set locale
  && echo 'en_US.UTF-8 UTF-8' > /etc/locale.gen \
  && locale-gen \
  && apt-get install --assume-yes --no-install-recommends git tmux zsh jq unzip \
  # Install direnv
  && curl -L -o /usr/local/bin/direnv https://github.com/direnv/direnv/releases/download/v${DIRENV_VERSION}/direnv.linux-amd64 \
  && chmod a+rwx /usr/local/bin/direnv \
  && echo 'eval "$(direnv hook bash)"' > /etc/profile.d/direnv.sh \
  && echo 'direnv allow' >> /etc/profile.d/direnv.sh \
  # Install AWS CLI
  && pip install awscli \
  # Install Terraform
  && curl -L -o /tmp/terraform.zip https://releases.hashicorp.com/terraform/${TERRAFORM_VERSION}/terraform_${TERRAFORM_VERSION}_linux_amd64.zip \
  && unzip -d /usr/local/bin/ /tmp/terraform.zip \
  # Install Helm
  && curl -L -o /tmp/helm.tar.gz https://get.helm.sh/helm-v${HELM_VERSION}-linux-amd64.tar.gz \
  && tar --no-same-owner -C /tmp/ -xf /tmp/helm.tar.gz \
  && mv /tmp/linux-amd64/helm /usr/local/bin

# Reset DEBIAN_FRONTEND to default(`dialog`).
# If you no need `dialog`, you can set `DEBIAN_FRONTEND=readline`.
# see also: man 7 debconf
ENV DEBIAN_FRONTEND=
