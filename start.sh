#!/bin/bash

if [ -z "$VAR_ADRESS" ]; then
  echo 1>&2 error: missing VAR_ADRESS environment variable
  exit 1
fi

if [ -z "$VAR_GITHUB_KEY" ]; then
  echo 1>&2 error: missing VAR_GITHUB_KEY environment variable
  exit 1
fi

if [ -z "$VAR_GITHUB_KEY" ]; then
  echo 1>&2 error: missing VAR_GITHUB_KEY environment variable
  exit 1
fi


sed -i -e "s/VAR_ADRESS/$VAR_ADRESS/g" .env.example
sed -i -e "s/VAR_GITHUB_KEY/$VAR_GITHUB_KEY/g" .env.example
sed -i -e "s/VAR_GITHUB_SECRET/$VAR_GITHUB_SECRET/g" .env.example

mv -f .env.example .env

exit