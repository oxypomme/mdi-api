FROM node:lts-alpine AS builder
WORKDIR /build

COPY vue ./

# Upgrade
RUN apk update \
	&& apk upgrade -U -a \
	# Install dependecies
	&& yarn --frozen-lockfile

RUN yarn build

# -------

FROM node:lts-alpine
WORKDIR /app

COPY src ./
COPY --from=builder /build/dist ./public

# Upgrade
RUN apk update \
	&& apk upgrade -U -a \
	# Install dependecies
	&& yarn --prod --frozen-lockfile

CMD yarn start

EXPOSE 8080
