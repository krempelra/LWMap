#!/bin/bash
DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
cd $DIR
wget nodejs.org/dist/v0.10.36/node-v0.10.36-linux-x64.tar.gz
tar -C /usr/local --strip-components 1 -xzf node-v0.10.36-linux-x64.tar.gz
rm node-v0.10.36-linux-x64.tar.gz
node -v
npm -v
cd $DIR
cd run
npm install mysql .
npm install sparql .
