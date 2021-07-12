#!/usr/bin/env bash

cd "`dirname "$0"`"
git pull
bundle
bundle exec middleman build
