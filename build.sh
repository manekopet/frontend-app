#!/usr/bin/env sh

set -e

echo "current branch: $CF_PAGES_BRANCH"
echo "base api: $REACT_APP_BASE_API"

export BUILD_PATH='./out'

npm install --force

if [ "$CF_PAGES_BRANCH" = "main" ]; then
  npx dotenv -e ./envs/.env.production -- react-app-rewired build
elif [ "$CF_PAGES_BRANCH" = "pages/landing" ]; then
  npx dotenv -e ./envs/.env.production -- react-app-rewired build
else
  npx dotenv -e ./envs/.env.develop -- react-app-rewired build
fi