#!/bin/sh

version="0.6.2"

docker buildx create --name mbuilder
docker buildx build --push -t wi4er/groot:$version --platform linux/arm64,linux/amd64 .
