#!/bin/bash
cd /home/ec2-user/opax
docker-compose up -d
sudo /bin/systemctl restart daa