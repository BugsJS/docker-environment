FROM node:8.16-jessie

RUN apt-get update && \
	apt-get install -y nano python3 screen zip unzip

RUN mkdir -p /work
WORKDIR /work
RUN npm i --save fs-extra
RUN npm i --save mkdirp
RUN npm i -g istanbul
RUN npm i -g n
RUN npm i -g grunt-cli
RUN npm i --save glob

RUN echo '{ "allow_root": true, "registry": "https://registry.bower.io" }' > /root/.bowerrc

RUN echo 'loglevel = "error"' > /root/.npmrc

COPY profile /root/.bashrc

# Redis for node_redis
RUN wget http://download.redis.io/releases/redis-3.2.12.tar.gz && \
	tar xvzf redis-3.2.12.tar.gz && \
	cd redis-3.2.12 && \
	make && \
	cp src/redis-server /usr/local/bin/redis-server && \
	cp src/redis-cli /usr/local/bin/redis-cli && \
	cd .. && \
	rm -rf redis-3.2.12 && \
	rm redis-3.2.12.tar.gz


# Mongodb for mongoose
# 3.6
RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 2930ADAE8CAF5059EE73BB4B58712A2291FA4AD5
RUN echo "deb http://repo.mongodb.org/apt/debian jessie/mongodb-org/3.6 main" | tee /etc/apt/sources.list.d/mongodb-org-3.6.list
RUN apt-get update
RUN apt-get install -y mongodb-org
RUN rm /etc/apt/sources.list.d/mongodb-org-3.6.list

# 2.4, 2.6
RUN wget -qO- http://downloads.mongodb.org/linux/mongodb-linux-x86_64-2.4.14.tgz | tar zxfv - -C /opt
RUN wget -qO- http://downloads.mongodb.org/linux/mongodb-linux-x86_64-2.6.12.tgz | tar zxfv - -C /opt

RUN n 8.0.0

RUN mkdir -p /data
WORKDIR /data

COPY work /work

RUN chmod +x /work/*

ARG CACHE_DATE=2018-07-20


RUN git clone https://github.com/BugsJS/bug-dataset.git /work/bug-dataset

VOLUME /data
