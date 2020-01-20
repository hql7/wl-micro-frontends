本项目采用 vue + qiankun 实践微前端落地。       
同时qiankun是一个开放式微前端架构，支持当前三大前端框架甚至jq等其他项目无缝接入。

### 微前端 qiankun

微前端是什么、为什么要做微前端、qiankun是什么这些笔者将不再叙述。   
传送门：[可能是你见过最完善的微前端解决方案](https://yq.aliyun.com/articles/715922)  &  [qiankun](https://github.com/umijs/qiankun)     
下面直接进入实战教程。

## 实战教程

鉴于qiankun文档只有寥寥十几行，这里做一个尽量详细的实战示例描述。   
另本项目作为长期构建项目，并不限于本文所讲基础应用，但与微前端构建太大相关的不再一一说明，有兴趣clone一一探查。

### 构建主应用

1. 创建一个主项目工程目录
2. npm install qiankun 下载微前端方案依赖
3. 改造主项目：
> 在main.js中
```
    // 导入qiankun内置函数
    import {
        registerMicroApps, // 注册子应用
        runAfterFirstMounted, // 第一个子应用装载完毕
        setDefaultMountApp, // 设置默认装载子应用
        start // 启动
    } from "qiankun";
    
    let app = null;
    /**
     * 渲染函数
     * appContent 子应用html
     * loading 如果主应用设置loading效果，可不要
     */
    function render({ appContent, loading } = {}) {
        if (!app) {
            app = new Vue({
                el: "#container",
                router,
                store,
                data() {
                    return {
                        content: appContent,
                        loading
                    };
                },
                render(h) {
                    return h(App, {
                        props: {
                        content: this.content,
                        loading: this.loading
                        }
                    });
                }
            });
        } else {
            app.content = appContent;
            app.loading = loading;
        }
    }; 
    
    /**
    * 路由监听
    * @param {*} routerPrefix 前缀
    */
    function genActiveRule(routerPrefix) {
        return location => location.pathname.startsWith(routerPrefix);
    }
    
    // 调用渲染主应用
    render();
    
    // 注册子应用
    registerMicroApps(
        [
            {
                name: "vue-aaa"
                entry: "//localhost:7771",
                render,
                activeRule: genActiveRule("/aaa")
            },
            {
                name: "vue-bbb"
                entry: "//localhost:7772",
                render,
                activeRule: genActiveRule("/bbb")
            },
        ],
        {
            beforeLoad: [ 
                app => {
                    console.log("before load", app);
                }
            ], // 挂载前回调
            beforeMount: [
                app => {
                    console.log("before mount", app);
                }
            ], // 挂载后回调
            afterUnmount: [
                app => {
                    console.log("after unload", app);
                }
            ] // 卸载后回调
        }
     )
     
     // 设置默认子应用,参数与注册子应用时genActiveRule("/aaa")函数内的参数一致
    setDefaultMountApp("/aaa");
    
    // 第一个子应用加载完毕回调
    runAfterFirstMounted(()=>{});
    
    // 启动微服务
    start();
```
注意, 主应用的el绑定dom为#container，因此你也需要修改一下index.hrml模板中的id
   
> 在app.vue中，增加一个渲染子应用的盒子
```
    <template>
        <div id="root" class="main-container">
            <div class="main-container-menu">
                
            </div>
        <!-- 子应用盒子 -->
        <div id="root-view" class="app-view-box" v- html="content"></div>
    </div>
    </template>

    <script>
    export default {
        name: "root-view",
        props: {
            loading: Boolean,
            content: String 
        }
    };
    </script>
```

> 在vue.config.js中
```
主应用可以不配置vue.config.js
或者为了方便找到主应用运行端口可以只设置一个port
module.exports = {
  devServer: {
    port: 3333
  }
};

更多的设置：
const port = 7770; // dev port
module.exports = {
  // publicPath: './',  
  devServer: {
    // host: '0.0.0.0',
    hot: true,
    disableHostCheck: true,
    port,
    overlay: {
      warnings: false,
      errors: true
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
    }
  },
};
注意这里，vue项目中，主应用设置`publicPath: './'会造成子应用配置的publicPath失效进而刷新页面报错的问题。
一说可以在子应用vue.config.js里直接配置publicPath解决。
```

### 构建子应用

1. 在主应用的同级目录下创建一个子项目
2. 改造子项目
> 在main.js中
```
import Vue from "vue";
import VueRouter from "vue-router";
import App from "./App.vue";
import "./public-path";
import routes from "./router";

Vue.config.productionTip = false;

// 声明变量管理vue及路由实例
let router = null;
let instance = null;

// 导出子应用生命周期 挂载前
export async function bootstrap(props = {}) {
  Array.isArray(props.fns) && props.fns.map(i => {
    Vue.prototype[i.name] = i[i.name]
  });
}

// 导出子应用生命周期 挂载前 挂载后
**注意，实例化路由时，判断当运行在qiankun环境时，路由要添加前缀，前缀与主应用注册子应用函数genActiveRule("/aaa")内的参数一致**
export async function mount(props) {
  router = new VueRouter({
    base: window.__POWERED_BY_QIANKUN__ ? "/aaa" : "/",
    mode: "history",
    routes
  });
  instance = new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount("#app");
}

// 导出子应用生命周期 挂载前 卸载后
export async function unmount() {
  instance.$destroy();
  instance = null;
  router = null;
}

// 单独开发环境
window.__POWERED_BY_QIANKUN__ || mount();
```
注意：重要的事情说两遍-- 实例化路由时，判断当运行在qiankun环境时，路由要设置base参数，参数值与主应用注册子应用函数genActiveRule("/aaa")内的参数一致。

注意：上面小小的修改了router.js导出的内容 & 引入了一个叫`public-path`的文件。

> 在router.js中（可不修改，自行处理）
```
const routes = [
  {
    path: "/",
    name: "home",
    component: Home
  },
  {
    path: "/about",
    name: "a-about",
    component: () =>
      import("../views/About.vue")
  }
];

export default routes;

不再导出rouer实例而是导出路由数据
```

> 在public-path文件内（可直接在vue.config.js内配置publicPath）
```
if (window.__POWERED_BY_QIANKUN__) {
  // eslint-disable-next-line no-undef
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}
```

> 在vue.comfig.js中
```
const path = require('path');
const { name } = require('./package');

function resolve(dir) {
  return path.join(__dirname, dir);
}

const port = 7771; // dev port

module.exports = {
  outputDir: 'dist',
  assetsDir: 'static',
  filenameHashing: true,
  devServer: {
    // host: '0.0.0.0',
    hot: true,
    disableHostCheck: true,
    port,
    overlay: {
      warnings: false,
      errors: true,
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  // 自定义webpack配置
  configureWebpack: {
    resolve: {
      alias: {
        '@': resolve('src'),
      },
    },
    output: {
      // 把子应用打包成 umd 库格式
      library: `${name}-[name]`,
      libraryTarget: 'umd',
      jsonpFunction: `webpackJsonp_${name}`,
    },
  },
};

注意output必须按照规定格式要求配置
```
经过上述改造，一个简易的微前端环境就草草建成了，是不是很简单，你是不是已经跃跃欲试了？

直接上手跑代码 --> [wl-qiankun](https://github.com/hql7/wl-qiankun)

当然，一个基础的微前端架子建成后，我们还有一些无法绕过的问题要处理，下面将其中部分逐一讲解。

### 父子应用通信
  在上述所建微前端应用中，父子间的通信是极其普遍且无法绕过的需求，而qiankun在这方面当然有所考虑。
> 在上述构建项目步骤中，有一步是在主应用main.js注册子应用：
```
   registerMicroApps(
        [{
                name: "app1"
                entry: "//localhost:7771",
                render,
                activeRule: genActiveRule("/app1")
                props: 'mg' // 传递给子应用
        }],
   )
```
> 在上述构建项目步骤中，有一步是子应用导出生命周期：
```
   export async function bootstrap(props) {
        console.log(props)
    }
```
> 其中props参数即为传递给子应用的数据，其内容你可以自由定制。
子应用在main.js导出的生命周期函数中均可接收到所传props数据：

qiankun对于props的应用类似于react框架的父子组件通信，传入data数据供自组件使用，传入fn函数给子组件触发向上回调。

 按照这个思路我们将主应用的main.js和子应用的main.js都改造一番：
> 改造后的主应用main.js
```
    ...
    // 定义传入子应用的数据
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
      
    // 注册子应用
    registerMicroApps(
        [{
                name: "app1"
                entry: "//localhost:7771",
                render,
                activeRule: genActiveRule("/app1")
                props: msg // 将定义好的数据传递给子应用
        }]
     )
     ...
```
在注册应用时将定义好的`msg`通过`props`参数传递给子应用。
现实使用场景中可能会依赖于某些后台返回数据比如权限路由信息，你也可以等到请求完成再调用注册。

> 改造后的子应用main.js
```
  ...
  export async function bootstrap(props = {}) {
    Array.isArray(props.fns) && props.fns.map(i => {
        Vue.prototype[i.name] = i[i.name]
    });
  }
  ...
```
我们这里在bootstrap函数里将接收到的props参数内的函数挂在vue原型上方便使用，你也可以在其他导出的生命周期函数内得到props并按照你的设想去处理。

### 各应用间路由管理
1.在主应用内设置路由监控
```
/**
 * 路由监听
 * @param {*} routerPrefix 前缀
 */
function genActiveRule(routerPrefix) {
  return location => location.pathname.startsWith(routerPrefix);
}

//注册子应用
registerMicroApps(
  [
    {
      name: "vue-aaa", // 此处写子应用package.json下的name
      entry: "//localhost:7771",
      render,
      activeRule: genActiveRule("/aaa"), // 此处子应用内的路由前缀
    }
  ]
```
2.在子应用内设置路由前缀
```
router = new VueRouter({
    base: window.__POWERED_BY_QIANKUN__ ? "/aaa" : "/", 
    mode: "history",
    routes
  });
```
设置base字段值与在主应用注册时`activeRule: genActiveRule("/aaa")`中genActiveRule函数内的参数一致

3.应用内路由跳转及跨应用路由处理
> 经过1、2步配置后
```
子应用内跳转和普通vue项目一致：
this.$router.push() 等

跨应用跳转：
window.history.pushState({}, title, href);
```

### 公共资源处理

1.开发环境

开发环境建立公共资源的目的，是减少开发时的重复劳作和多方修改带来的维护难题。        
相应的，修改public-lib内资源一定要有影响其他应用的觉悟并严格按照设计规范：向上兼容和可扩展性。

> 工程结构
```
    big-repo
    |-----------app1
    |           |------src
    |                   |------public-lib （开发中）
    |-----------app2
    |           |------src
    |                   |------public-lib （开发中）
    |-----------app3
    |           |------src
    |                    |-----public-lib （开发中）
    |
    |-----------public-lib（只是作为中继站的类型同步三个app内的public-lib）       
```
使用`git subtree`拆分子仓库，使每个子应用下的public-lib目录与根public-lib建立联系，并能完成互相推送。

2.生产环境
  公共引用拆分打包待续

### 一个简单的基于qiankun和vue的实战示例就这么结束啦

  当然我们需要考虑的还有很多，但是我前天刚买的狼叔的[【前端架构：从入门到微前端】](https://item.jd.com/12621088.html)告诉我们，架构是一件持续性和渐进式的事儿，其他的后续再逐渐丰富吧~~~
>另附Github上的demo地址:[wl-qiankun](https://github.com/hql7/wl-qiankun)。

不想看我在这罗里吧嗦的直接代码跑起吧~，如果你觉得还有一点点可以，就请留个star吧~~