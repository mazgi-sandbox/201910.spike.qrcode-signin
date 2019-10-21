FROM node:12 as base

# Set in non-interactive mode.
ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update \
  && apt-get install --assume-yes --no-install-recommends locales procps dialog \
  && echo 'en_US.UTF-8 UTF-8' > /etc/locale.gen \
  && locale-gen

# Reset DEBIAN_FRONTEND to default(`dialog`).
# If you no need `dialog`, you can set `DEBIAN_FRONTEND=readline`.
# see also: man 7 debconf
ENV DEBIAN_FRONTEND=


# ================================
# Begin development stage
FROM base as development
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update \
  && apt-get install --assume-yes --no-install-recommends git tmux zsh jq
ENV DEBIAN_FRONTEND=
# End development stage
# ================================


# ================================
# Begin production stage
FROM base as production
ENV DEBIAN_FRONTEND=noninteractive
COPY source /workspace/
WORKDIR /workspace
RUN npm install
# RUN npm install \
#   && npm run build
CMD ["npm", "run", "dev"]
# CMD ["npm", "run", "start"]
# End production stage
# ================================
