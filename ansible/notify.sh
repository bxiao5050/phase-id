#!/bin/bash

# Author: KK
# Version: 1.0

url="http://172.16.3.205:10000/sender/wechat?"
#tos="user1,user2"
tos="kk,bin.duan,zongjiang.ge,tao.wang,shindousaigo"

#"PROJECT: ${JOB_NAME}&BUILD: ${BUILD_NUMBER}&URL: http://jenkins2.royale.com/blue/organizations/jenkins/${JOB_NAME}/detail/${JOB_NAME}/${BUILD_NUMBER}/pipeline/"

status=$1
job=$2
build=$3
project=$(echo $job | awk -F'/' '{print $1}')
name=$(echo $job | awk -F'/' '{print $2}')
view=$(echo $project | awk -F'-' '{print $1"-"$2"}')

content="STATUS: $status&PROJECT: ${job}&BUILD: ${build}&URL: http://jenkins2.royale.com/view/${view}/job/${project}/job/${name}/${build}/"

curl -d "tos=$tos&content=$(echo $content | sed 's/&/\n/g')" $url 2>/dev/null
