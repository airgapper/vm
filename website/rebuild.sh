#!/usr/bin/env bash

cd "`dirname "$0"`"
git pull
bundle install
echo "Running middleman"
bundle exec middleman build
