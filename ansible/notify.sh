#!/bin/sh

# Author: KK
# Version: 1.0

url="http://172.16.3.205:10000/sender/wechat?"
#tos="user1,user2"
tos="kk,bin.duan,zongjiang.ge"

#"PROJECT: ${JOB_NAME}&BUILD: ${BUILD_NUMBER}&URL: http://jenkins.royale.com/blue/organizations/jenkins/${JOB_NAME}/detail/${JOB_NAME}/${BUILD_NUMBER}/pipeline/"

status=$1
job=$2
build=$3

content="STATUS: $status&PROJECT: ${job}&BUILD: ${build}&URL: http://jenkins.royale.com/blue/organizations/jenkins/${job}/detail/${job}/${build}/pipeline/"

echo $(echo $content | sed 's/&/\n/g')
curl -d "tos=$tos&content=$(echo $content | sed 's/&/\n/g')" $url 2>/dev/null
