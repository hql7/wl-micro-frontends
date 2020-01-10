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

### 父子应用信息传递机制

  微前端父子应用消息传递机制类似于`react`的`props`，将`data`信息和`fn`函数作为props传递给子应用。再由子应用使用信息数据或调用回调函数。

  主应用中
  ``` 
  // 定义传输信息
  let msg = {
    data: {
      auth: false
    },
    fns: [
      {
        name: "LOGOUT_",
        LOGOUT_(data) {
          alert('父应用返回信息：' + data)
        }
      }
    ]
  };

  // 注册应用
  registerMicroApps(
  [
    {
      name: "app1",
      entry: "//localhost:7771",
      render,
      activeRule: genActiveRule("/app1"),
      props: msg // 通过注册函数提供的props参数将msg信息传递给子应用
    }
  ])
  ```
  子应用中main.js中
  ```
  // 将接收到的函数挂在vue原型方便全局调用
  export async function bootstrap(props = {}) {
    Array.isArray(props.fns) && props.fns.map(i => {
      Vue.prototype[i.name] = i[i.name]
    });
    ... 对传进来的data数据进行处理，例如将传入的store或routes注入
  }
  ```
  子应用.vue文件中
  ```
    /**
     * 通知父应用退出登录
     * data 自定义数据
     */
    callParentLogout(data) {
      this.LOGOUT_(data);
    }
  ```