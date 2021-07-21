#!/bin/bash
cd /home/ec2-user/opax
docker container prune -f
docker image prune -f -a
docker-compose up -d