#!/bin/sh
HOME="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $HOME
value=`cat $HOME/node.pid`
echo $value
kill $value
$HOME/node_start.sh

