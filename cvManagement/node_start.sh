HOME="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $HOME
LOGLOCATION=`cat $HOME/log_location.setting`
CVSERVERHOME=`cat $HOME/cvServerlocation.setting`
cd $CVSERVERHOME
cd run
node ./cvServerAdvanced.js >> $LOGLOCATION/node.log &
PID=$!
echo $PID > $HOME/node.pid
