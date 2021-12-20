#!/bin/sh

version="0.8.1"

docker buildx create --name mbuilder
docker buildx build --push -t wi4er/groot:$version --platform linux/arm64,linux/amd64 .
