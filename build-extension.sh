#!/bin/bash

zip -r extension.zip ./ \
  -x \
  ".git/*" \
  ".idea/*" \
  ".github/*" \
  ".DS_Store" \
  ".gitignore" \
  "extension/*" \
  "extension.zip" \
  "build-extension.sh"
