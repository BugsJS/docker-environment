#!/bin/bash -e

ver=$1

rm /usr/bin/mongod
mongod$ver --shutdown -f /etc/mongodb.conf$ver

