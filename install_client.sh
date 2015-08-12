#!/bin/bash

echo "Stopping client..."
forever stop cq-client.js

echo "Removing public directory"
rm -r public

echo "Removing node_modules..."
rm -r node_modules

echo "Cleaning npm cache..."
npm cache clean

echo "Installing dependencies... with --production=false flag"
npm install --production=false

echo "Building client app..."
gulp build

echo "Starting client..."
forever start cq-client.js

echo "Done!"
