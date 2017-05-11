#!/bin/bash
DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
JenaName=apache-jena-2.7.4
JENADIR = $DIR/apache-jena-2.7.4
cd $DIR
mkdir $DIR/processed/
#Download and Configure Jena
if [ ! -d $JENADIR ]; then
	wget http://archive.apache.org/dist/jena/binaries/$JenaName.zip
	unzip $JenaName.zip -d .
	cd $JenaName/bin
	sed -i -e "s/-Xmx1024M/-Xmx6024M/g" tdbloader2
fi
cd $DIR

#wget http://downloads.dbpedia.org/2016-04/core-i18n/en/instance_types_en.ttl.bz2
#bzip2 -d instance_types_en.ttl.bz2
#apache-jena-2.7.4/bin/tdbloader2  --loc $DIR/processed/classes instance_types_en.ttl

if [ ! -d $DIR/processed/classes ]; then
	
	if [ ! -f instance_types_en.ttl ]; then
		if [ ! -f instance_types_en.ttl.bz2 ]; then
			wget http://downloads.dbpedia.org/2016-04/core-i18n/en/instance_types_en.ttl.bz2
		fi
		bzip2 -d instance_types_en.ttl.bz2
	fi
	$JenaName/bin/tdbloader2  --loc $DIR/processed/classes instance_types_en.ttl
	rm instance_types_en.ttl

fi


#wget http://downloads.dbpedia.org/2016-04/core-i18n/en/redirects_en.ttl.bz2
#bzip2 -d redirects_en.ttl.bz2
#apache-jena-2.7.4/bin/tdbloader2  --loc $DIR/processed/redirects redirects_en.ttl

if [ ! -d $DIR/processed/redirects ]; then
	
	if [ ! -f redirects_en.ttl ]; then
		if [ ! -f redirects_en.ttl.bz2 ]; then
			wget http://downloads.dbpedia.org/2016-04/core-i18n/en/redirects_en.ttl.bz2
		fi
		bzip2 -d redirects_en.ttl.bz2
	fi
	$JenaName/bin/tdbloader2  --loc $DIR/processed/redirects redirects_en.ttl
	rm redirects_en.ttl

fi

#wget http://downloads.dbpedia.org/2016-04/core-i18n/en/page_links_en.ttl.bz2
#bzip2 -d page_links_en.ttl.bz2
#apache-jena-2.7.4/bin/tdbloader2  --loc $DIR/processed/enPagelink page_links_en.ttl



if [ ! -d $DIR/processed/enPagelink ]; then
	
	if [ ! -f page_links_en.ttl ]; then
		if [ ! -f page_links_en.ttl.bz2 ]; then
			wget http://downloads.dbpedia.org/2016-04/core-i18n/en/page_links_en.ttl.bz2
		fi
		bzip2 -d page_links_en.ttl.bz2
	fi
	$JenaName/bin/tdbloader2  --loc $DIR/processed/enPagelink page_links_en.ttl
	rm page_links_en.ttl

fi

if [ ! -d $DIR/processed/dePagelink ]; then
	
	if [ ! -f page_links_en_uris_de.ttl ]; then
		if [ ! -f page_links_en_uris_de.ttl.bz2 ]; then
			wget http://downloads.dbpedia.org/2016-04/core-i18n/de/page_links_en_uris_de.ttl.bz2
		fi
		bzip2 -d page_links_en_uris_de.ttl.bz2
	fi
	$JenaName/bin/tdbloader2  --loc $DIR/processed/dePagelink page_links_en_uris_de.ttl
	rm page_links_en_uris_de.ttl

fi
