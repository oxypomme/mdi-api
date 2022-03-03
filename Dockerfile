FROM node:lts-alpine

COPY . ./

# Upgrade
RUN apk update \
	&& apk upgrade -U -a \
	# Install dependecies
	&& yarn --prod

CMD yarn start

EXPOSE 8080
