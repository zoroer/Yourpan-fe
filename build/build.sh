#!/bin/bash

# Set up basic environment
root=$(cd "$(dirname "$0")"; pwd)
build_env="prod"

#清理旧的打包文件
rm -rf output

#通过 npm 命令进行构建，构建的 media 为 prod ，这个可以根据用户具体配置修改
if [ ${1} == 'test' ]; then
    build_env=${1}
fi

echo "模式 ${build_env}"

npm install

npm run build

#整理目录结构

#将output目录进行打包

echo "build end"