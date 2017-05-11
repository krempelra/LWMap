#!/bin/sh
HOME="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $HOME
value=`cat $HOME/fuseki.pid`
echo $value
kill $value
$HOME/fuseki_start.sh
