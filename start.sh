#!/bin/bash



#start the nginx
service nginx start &

# Start the first process
pm2-runtime start process.json
