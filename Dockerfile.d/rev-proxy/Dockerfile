FROM nginx:1.17.4

# Set in non-interactive mode.
ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update \
  && apt-get install --assume-yes --no-install-recommends locales procps dialog \
  && echo 'en_US.UTF-8 UTF-8' > /etc/locale.gen \
  && locale-gen \
  && apt-get install --assume-yes --no-install-recommends git tmux zsh jq

# Reset DEBIAN_FRONTEND to default(`dialog`).
# If you no need `dialog`, you can set `DEBIAN_FRONTEND=readline`.
# see also: man 7 debconf
ENV DEBIAN_FRONTEND=
