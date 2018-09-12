#!/usr/bin/env bash

# Updater API
node src/updater-api.js &

# Updater interface
cd ./updater-interface/
npm run start
