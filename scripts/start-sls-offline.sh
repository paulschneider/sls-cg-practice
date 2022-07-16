TMPFILE=/var/tmp/offline$$.log
if [ -f .offline.pid ]; then
    echo "Found file .offline.pid. Not starting."
    exit 1
fi
 
sls dynamodb install

serverless offline start 2>1 > $TMPFILE &
PID=$!
echo $PID > .offline.pid
 
while ! grep "Server ready" $TMPFILE
do sleep 1; done
 
rm $TMPFILE