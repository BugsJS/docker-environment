#!/bin/bash -e

ver=$1

case $ver in
  24)
    echo "Stopping mongodb 2.4"
    /opt/mongodb-linux-x86_64-2.4.14/bin/mongod --shutdown -f /work/mongod.conf24
    ;;
  26)
    echo "Stopping mongodb 2.6"
    /opt/mongodb-linux-x86_64-2.6.12/bin/mongod --shutdown -f /work/mongod.conf26
    ;;
  36)
    echo "Stopping mongodb 3.6"
    /usr/bin/mongod --shutdown -f /etc/mongod.conf
    ;;
  *)
    echo "Unsupported mongodb version"
    ;;
esac

