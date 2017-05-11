HOME="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $HOME
LOGLOCATION=`cat $HOME/log_location.setting`
CVSERVERHOME=`cat $HOME/cvServerlocation.setting`
echo $LOGLOCATION
echo $CVSERVERHOME
cd $CVSERVERHOME/fuseki
./fuseki-server --conf=../Settings/local.ttl >> $LOGLOCATION/fuseki.log &
PID=$!
echo $PID > $HOME/fuseki.pid

