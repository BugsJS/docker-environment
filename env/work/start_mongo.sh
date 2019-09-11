#!/bin/bash -e

ver=$1

rm -rf /data/db/*
rm -rf /var/lib/mongodb/*

case $ver in
  24)
    echo "Starting mongodb 2.4"
    /opt/mongodb-linux-x86_64-2.4.14/bin/mongod --fork -f /work/mongod.conf24
    ;;
  26)
    echo "Starting mongodb 2.6"
    /opt/mongodb-linux-x86_64-2.6.12/bin/mongod --fork -f /work/mongod.conf26
    ;;
  36)
    echo "Starting mongodb 3.6"
    /usr/bin/mongod --fork -f /etc/mongod.conf
    ;;
  *)
    echo "Unsupported mongodb version"
    ;;
esac
