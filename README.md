# wl-qiankun
qiankun + vue + element 的微前端架构项目，主项目与子应用均使用vue。支持三大前端框架可根据自己需求调整    

`main-container`是主项目入口，其他`module-**`为子应用。

开发过程中，将会利用[Git Subtree](https://segmentfault.com/a/1190000012002151?utm_source=tag-newest)把每个子应用拆成子仓库。开发时只需关注于当前子应用仓库，开发与日常vue项目开发无异。   
同时根级建立公共资源库目录连接每个子应用的内部公共资源目录（注意：此做法为便于所有仓库统一公共资源，相应的-修改某个仓库的内部公共资源目录提交后将影响所有仓库）。附：[Git仓库拆分](https://www.jianshu.com/p/3f5365e5cd6c)

### 项目启动

  1. 运行单个子应用模块开发时，进入当前子仓库文件夹   
     ``` 
     npm install 下载依赖

     npm run serve 运行服务

     npm run build 打包
     ``` 

  2. 运行主应用时，需要在主应用目录下自行启动主应用和所需子应用。同时主应用提供相应的下载、运行、打包命令，详见`pakeage.json`   
  主要命令：
  ```
    npm install:all 下载主应用和所有子应用依赖

    npm run start 运行主应用和所有子应用

    npm build:all 打包主应用和所有子应用

  ```