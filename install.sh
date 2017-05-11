#!/bin/bash
DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
cd $DIR
echo $(ls)
mkdir fuseki
cd fuseki
echo $(pwd)
wget https://archive.apache.org/dist/jena/binaries/jena-fuseki1-1.1.2-distribution.tar.gz
tar -zxvf jena-fuseki1-1.1.2-distribution.tar.gz
rm jena-fuseki1-1.1.2-distribution.tar.gz
mv jena-fuseki1-1.1.2/* .
rm -rf jena-fuseki1-1.1.2
cd $DIR

if [ ! $(cd www_content/sigmajs/) ]
then
  mkdir www_content/sigmajs/
  cd www_content/sigmajs/
fi
echo $(pwd)
wget https://github.com/jacomyal/sigma.js/releases/download/v1.0.0/release-v1.0.0.zip .
unzip release-v1.0.0.zip -d .
rm release-v1.0.0.zip
cd $DIR
echo $(pwd)
if [ ! $(cd www_content/bootstrap) ]
then
  mkdir www_content/bootstrap
  cd www_content/bootstrap
fi
#cd www_content/bootstrap || mkdir www_content/bootstrap
echo $(pwd)
wget https://github.com/twbs/bootstrap/releases/download/v3.1.1/bootstrap-3.1.1-dist.zip .
unzip bootstrap-3.1.1-dist.zip -d .
mv bootstrap-3.1.1-dist/* .
rm -rf bootstrap-3.1.1-dist
rm bootstrap-3.1.1-dist.zip
cd $DIR
echo $(pwd)
#SettingsPort to JavaScript
SRVRPORT=$(jq ".ServerPort" Settings/local.json)
sed -i -e "s/var Setting_port=\"8080\"/var Setting_port=$SRVRPORT/g" www_content/settings.js