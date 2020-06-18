# Yourpan-fe

## 安装使用
``` bash
# 安装依赖
npm install

# 本地开发
npm run dev

# 本地代理开发
npm run proxy

# 正式打包
npm run build
```

## 目录结构
```
|-- assets  // 静态文件文件
|   |-- logo.ico 
|-- build   // 打包文件
|-- config  // webpack配置文件
|-- src // 项目代码
    |-- api // 项目的api接口声明
    |   |-- api.js // 接口export
    |-- common // 公用资源文件夹
    |   |-- public-source  // 业务相关js
    |   |-- components     // 公共组件
    |   |-- style          // 跟css相关
    |   |-- utils          // 工具库
    |-- pages  // 项目页面
        |-- yourpage // 项目一
        |   |-- index.vue // 项目根vue
    |-- router // 项目路由
        |-- yourpage // 项目一
        |   |-- index.vue // 项目根vue
```  

## License

This project is licensed under the [MIT license](./LICENSE).

