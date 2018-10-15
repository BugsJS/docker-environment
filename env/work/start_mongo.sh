#!/bin/bash -e

ver=$1

ln -s /usr/bin/mongod$ver /usr/bin/mongod
rm -rf /data/db/*
rm -rf /var/lib/mongodb/*
mongod$ver --fork -f /etc/mongodb.conf$ver

