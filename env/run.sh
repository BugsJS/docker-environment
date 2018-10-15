#!/bin/bash -e

# Build BugsJS environment
docker-compose build --build-arg CACHE_DATE=$(date '+%Y%m%d%H%M%S') bugsjs-env

# Run the BugsJS environment
docker run --rm --name bugsjs-env -it -v data:/data bugsjs-env bash
