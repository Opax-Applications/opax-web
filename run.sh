#!/bin/bash
cd /home/ec2-user/opax
docker-compose build --no-cache
docker-compose up -d