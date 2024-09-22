#!/bin/sh
cat package.json | jq .version | tr -d '\"' | awk '{$1=$1};1'
