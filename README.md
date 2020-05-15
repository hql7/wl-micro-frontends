# wl-micro-frontends [wl-qiankun]

本项目采用 vue + qiankun 实践微前端落地。  
同时 qiankun 是一个开放式微前端架构，支持当前三大前端框架甚至 jq 等其他项目无缝接入。  
此项目为了尽可能的简单易上手，以及方便文章讲解，大部分逻辑都在主应用和子应用的 main.js 来回施展，  
实际项目应用可不要如此粗暴，要有优雅的架构设计。

另有微前端进阶实战项目：基于 vue3.0-beta 及 qiankun2.0 极速尝鲜！[wl-mfe](https://github.com/wl-ui/wl-mfe)

#### [在线地址](http://mfe.wlui.com.cn/)

## 项目启动

```bash
npm run cinit
npm run init
下载依赖，因为是批量下载所有应用下的依赖，推荐cinit节省下载时间

npm run serve
运行项目，同样，批量运行所有应用会耗时较久，浏览器页面自动打开后请稍家等待，然后刷新即可

npm run build
打包项目，打包所有应用
```

## 微前端 qiankun

微前端是什么、为什么要做微前端、qiankun 是什么这些笔者将不再叙述。（文末有彩蛋~）  
传送门：[可能是你见过最完善的微前端解决方案](https://yq.aliyun.com/articles/715922) & [qiankun](https://github.com/umijs/qiankun)  
下面直接进入实战教程。

### 实战教程目录详解

鉴于 qiankun 文档只有寥寥十几行，这里做一个尽量详细的实战示例描述:

- [x] 微前端主应用与子应用如何构建
- [x] 主应用与子应用通信(静态，无法监测到值变化)
- [x] 主、子，各应用间动态通信(动态，各应用间实时监听，同步数据)
- [x] 主应用资源下发至子应用
- [x] 微前端鉴权方案
  - [x] 一：异步注册(主应用异步获取子应用注册表并将子应用对应的路由下发至子应用)
  - [ ] 二：异步路由(使用应用间通信，通知子应用路由数据，子应用在内部 addRoutes 异步插入路由)
- [x] 各应用间路由基础管理
- [x] 公共资源处理

## 微前端主应用与子应用如何构建

### 构建主应用

1. 创建一个主项目工程目录
2. npm install qiankun 下载微前端方案依赖
3. 改造主项目：
   > 在 main.js 中

```javascript
// 导入qiankun内置函数
import {
  registerMicroApps, // 注册子应用
  runAfterFirstMounted, // 第一个子应用装载完毕
  setDefaultMountApp, // 设置默认装载子应用
  start, // 启动
} from 'qiankun';

let app = null;
/**
 * 渲染函数
 * appContent 子应用html
 * loading 如果主应用设置loading效果，可不要
 */
function render({ appContent, loading } = {}) {
  if (!app) {
    app = new Vue({
      el: '#container',
      router,
      store,
      data() {
        return {
          content: appContent,
          loading,
        };
      },
      render(h) {
        return h(App, {
          props: {
            content: this.content,
            loading: this.loading,
          },
        });
      },
    });
  } else {
    app.content = appContent;
    app.loading = loading;
  }
}

/**
 * 路由监听
 * @param {*} routerPrefix 前缀
 */
function genActiveRule(routerPrefix) {
  return (location) => location.pathname.startsWith(routerPrefix);
}

// 调用渲染主应用
render();

// 注册子应用
registerMicroApps(
  [
    {
      name: 'vue-aaa',
      entry: '//localhost:7771',
      render,
      activeRule: genActiveRule('/aaa'),
    },
    {
      name: 'vue-bbb',
      entry: '//localhost:7772',
      render,
      activeRule: genActiveRule('/bbb'),
    },
  ],
  {
    beforeLoad: [
      (app) => {
        console.log('before load', app);
      },
    ], // 挂载前回调
    beforeMount: [
      (app) => {
        console.log('before mount', app);
      },
    ], // 挂载后回调
    afterUnmount: [
      (app) => {
        console.log('after unload', app);
      },
    ], // 卸载后回调
  }
);

// 设置默认子应用,参数与注册子应用时genActiveRule("/aaa")函数内的参数一致
setDefaultMountApp('/aaa');

// 第一个子应用加载完毕回调
runAfterFirstMounted(() => {});

// 启动微服务
start();
```

注意, 主应用的 el 绑定 dom 为#container，因此你也需要修改一下 index.hrml 模板中的 id

> 在 app.vue 中，增加一个渲染子应用的盒子

```vue
<template>
  <div id="root" class="main-container">
    <div class="main-container-menu"></div>
    <!-- 子应用盒子 -->
    <div id="root-view" class="app-view-box" v-html="content"></div>
  </div>
</template>

<script>
export default {
  name: 'root-view',
  props: {
    loading: Boolean,
    content: String,
  },
};
</script>
```

> 在 vue.config.js 中

主应用可以不配置 `vue.config.js`
或者为了方便找到主应用运行端口可以只设置一个 `port`

```javascript
module.exports = {
  devServer: {
    port: 3333,
  },
};
```

更多的设置：

```javascript
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
      errors: true,
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
};
```

**注意这里**，vue 项目中，主应用设置`publicPath: './'`会造成子应用配置的 `publicPath` 失效进而刷新页面报错的问题。
一说可以在子应用 `vue.config.js` 里直接配置 `publicPath` 解决。

### 构建子应用

1. 在主应用的同级目录下创建一个子项目
2. 改造子项目
   > 在 main.js 中

```javascript
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
export async function bootstrap(props) {
    console.log(props)
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

**注意：**重要的事情说两遍-- 实例化路由时，判断当运行在 qiankun 环境时，路由要设置 base 参数，参数值与主应用注册子应用函数 genActiveRule("/aaa")内的参数一致。

**注意：**上面小小的修改了 router.js 导出的内容 & 引入了一个叫`public-path`的文件。

> 在 router.js 中（可不修改，自行处理）

```javascript
const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/about',
    name: 'a-about',
    component: () => import('../views/About.vue'),
  },
];

export default routes;
```

不再导出 rouer 实例而是导出路由数据

> 在 public-path 文件内（可直接在 vue.config.js 内配置 publicPath）

```javascript
if (window.__POWERED_BY_QIANKUN__) {
  // eslint-disable-next-line no-undef
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}
```

> 在 vue.comfig.js 中

```javascript
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
```

注意 output 必须按照规定格式要求配置;

经过上述改造，一个简易的微前端环境就草草建成了，是不是很简单，你是不是已经跃跃欲试了？

直接上手跑代码 --> [wl-micro-frontends(wl-qiankun)](https://github.com/hql7/wl-micro-frontends)

当然，一个基础的微前端架子建成后，我们还有一些无法绕过的问题要处理，下面将其中部分逐一讲解。

## 主应用与子应用通信(静态，无法监测到值变化)

### 父子应用通信

在上述所建微前端应用中，父子间的通信是极其普遍且无法绕过的需求，而 qiankun 在这方面当然有所考虑。

> 在上述构建项目步骤中，有一步是在主应用 main.js 注册子应用：

```javascript
registerMicroApps([
  {
    name: 'app1',
    entry: '//localhost:7771',
    render,
    activeRule: genActiveRule('/app1'),
    props: 'mg', // 传递给子应用
  },
]);
```

> 在上述构建项目步骤中，有一步是子应用导出生命周期：

```javascript
export async function bootstrap(props) {
  console.log(props);
}
```

> 其中 props 参数即为传递给子应用的数据，其内容你可以自由定制。
> 子应用在 main.js 导出的生命周期函数中均可接收到所传 props 数据：

qiankun 对于 props 的应用类似于 react 框架的父子组件通信，传入 data 数据供自组件使用，传入 fn 函数给子组件触发向上回调。

按照这个思路我们将主应用的 main.js 和子应用的 main.js 都改造一番（此改造会在后续主应用下发子应用资源章节重构）：

> 改造后的主应用 main.js

```javascript
// ...
// 定义传入子应用的数据
let msg = {
  data: {
    auth: false,
  },
  fns: [
    function LOGOUT_(data) {
      alert('父应用返回信息：' + data);
    },
  ],
};

// 注册子应用
registerMicroApps([
  {
    name: 'app1',
    entry: '//localhost:7771',
    render,
    activeRule: genActiveRule('/app1'),
    props: msg, // 将定义好的数据传递给子应用
  },
]);
//...
```

在注册应用时将定义好的`msg`通过`props`参数传递给子应用。
现实使用场景中可能会依赖于某些后台返回数据比如权限路由信息，你也可以等到请求完成再调用注册。

> 改造后的子应用 main.js

```javascript
// ...
export async function bootstrap(props = {}) {
  Array.isArray(props.fns) &&
    props.fns.map((i) => {
      Vue.prototype[i.name] = i[i.name];
    });
}
// ...
```

我们这里在 bootstrap 函数里将接收到的 props 参数内的函数挂在 vue 原型上方便使用，你也可以在其他导出的生命周期函数内得到 props 并按照你的设想去处理。

## 主、子应用间动态通信(动态，各应用间实时监听，同步数据)

经过上述处理后我们仍会遇到一个问题：即需要改变状态的数据如果通信，上面只是在注册子应用时传递了一次数据，而数据改变后又不能再注册一遍子应用。这个时候就需要应用间动态通信了，比如处理主应用登陆后的用户身份改变，或者 token 之类。
这个问题是考虑微前端架构的人都会遇到，当然 qiankun 官方也在日程上规划的有官方通信机制，但是鉴于一次又一次的时间推迟及维护人手短缺，这里本文作者使用[rxjs](https://rxjs.dev/guide/subject)来作为应用间通信的方案。

> 因为只使用 rxjs 解决应用间通信的需求，因此处理十分简单

1. 先在主应用下载并引入 rxjs；并创建我们的‘呼机’

```javascript
import { Subject } from 'rxjs'; // 按需引入减少依赖包大小
const pager = new Subject();
export default pager;
```

2. 然后在主应用 main.js 引入并注册呼机，以及将呼机下发给子应用

```javascript
import pager from './util/pager'; // 导入应用间通信介质：呼机

pager.subscribe((v) => {
  // 在主应用注册呼机监听器，这里可以监听到其他应用的广播
  console.log(`监听到子应用${v.from}发来消息：`, v);
  store.dispatch('app/setToken', v.token); // 这里处理主应用监听到改变后的逻辑
});

let msg = {
  // 结合下章主应用下发资源给子应用，将pager作为一个模块传入子应用
  data: store.getters, // 从主应用仓库读出的数据
  components: LibraryUi, // 从主应用读出的组件库
  utils: LibraryJs, // 从主应用读出的工具类库
  emitFnc: childEmit, // 从主应用下发emit函数来收集子应用反馈
  pager, // 从主应用下发应用间通信呼机
};
registerMicroApps(
  // 注册子应用
  [
    {
      name: 'subapp-ui',
      entry: '//localhost:6651',
      render,
      activeRule: genActiveRule('/ui'),
      props: msg, // 将上面数据传递给子应用
    },
  ]
);
```

3. 在子应用中注册呼机

```javascript
export async function bootstrap({ components, utils, emitFnc, pager }) {
  Vue.use(components); // 注册主应用下发的组件
  Vue.prototype.$mainUtils = utils; // 把工具函数挂载在vue $mainUtils对象
  Object.keys(emitFnc).forEach((i) => {
    // 把mainEmit函数一一挂载
    Vue.prototype[i] = emitFnc[i];
  });

  pager.subscribe((v) => {
    // 在子应用注册呼机监听器，这里可以监听到其他应用的广播
    console.log(`监听到子应用${v.from}发来消息：`, v);
    // store.dispatch('app/setToken', v.token)   // 在子应用中监听到其他应用广播的消息后处理逻辑
  });
  Vue.prototype.$pager = pager; // 将呼机挂载在vue实例
}
```

4. 在各应用中使用呼机动态传递信息

```javascript
methods: {  // 在某个应用里调用.next方法更新数据，并传播给其他应用
  callParentChange() {
    this.myMsg = "但若不见你，阳光也无趣";
    this.$pager.next({
      from: "subapp-ui",
      token: "但若不见你，阳光也无趣"
    });
  }
}
```

经过上述 4 个步骤，你将在控制台看到我们在应用注册呼机检测器里打印的数据，它将是各应用实时同步，至此我们的应用间通信已经完成，简单高效。

这里还有其他应用间通信方案：

1. 等待 qiankun 官方通信机制
2. 使用 event bus 等技术栈耦合的方法
3. 使用观察者/发布订阅
4. 使用 local 或者 window 传递
5. 等

## 主应用将自身资源下发给子应用

在真实项目使用中，单纯的主、子应用数据与回调函数传递无法满足需求。通常还会有一部门主应用的资源或者公共资源可以下放给主应用使用！

在我的[github](https://github.com/hql7)微前端 qiankun 项目[wl-micro-frontends](https://github.com/hql7/wl-micro-frontends)中，我是这么处理的：将主应用 msg 分成`data、components、utils、emitFnc`分别代表各类需要下发给子应用的资源！

> 此时经过改造后的主应用 main.js 是这样的：

```javascript
/**
 * 主应用公共资源下发子应用
 */
// 导入主应用ui库
import LibraryUi from './library/ui/';
// 导入主应用工具类库
import LibraryJs from './library/js';
// 导入主应用需要下发的emit函数
import * as childEmit from './util/childEmit';
// 定义传入子应用的数据
let msg = {
  data: store.getters, // 从主应用仓库读出的数据
  components: LibraryUi, // 从主应用读出的组件库
  utils: LibraryJs, // 从主应用读出的工具类库
  emitFnc: childEmit, // 从主应用下发emit函数来收集子应用反馈
};

// <!--注册-->
registerMicroApps([
  {
    name: 'module-app1',
    entry: '//localhost:6651',
    render,
    activeRule: genActiveRule('/app1'),
    props: msg,
  },
  {
    name: 'module-app2',
    entry: '//localhost:6652',
    render,
    activeRule: genActiveRule('/app2'),
    props: msg,
  },
]);
```

- 详见[主应用 main.js](https://github.com/hql7/wl-micro-frontends/blob/master/main-container/src/main.js)

> 处理完主应用的下发逻辑，下面再改造一下子应用的接收逻辑
> 在子应用 main.js 中写下这段代码：因为 bootstrap 在子应用的生命周期只会调用一次，因此我们把注册组件和挂载函数放在这里

```javascript
export async function bootstrap({ components, utils, emitFnc }) {
  // 注册主应用下发的组件
  Vue.use(components);
  // 把工具函数挂载在vue $mainUtils对象
  Vue.prototype.$mainUtils = utils;
  // 把mainEmit函数一一挂载
  Object.keys(emitFnc).forEach((i) => {
    Vue.prototype[i] = emitFnc[i];
  });
}
```

而主应用传回的 data 信息我们想在子应用 vue 实例化时传递进去，因此在 mount 生命周期使用

```javascript
export async function mount({ data = {} } = {}) {
  router = new VueRouter({
    base: window.__POWERED_BY_QIANKUN__ ? '/app1' : '/',
    mode: 'history',
    routes,
  });
  instance = new Vue({
    router,
    store,
    render: (h) => h(App, { props: data }),
  }).$mount('#app');
}
```

- 详见[子应用 main.js](https://github.com/hql7/wl-micro-frontends/blob/master/module-basic-data/src/main.js)

好，道理我们都懂，那么到底有没有效果呢，下面我们就在子应用中使用下主应用下发的组件和函数来验证一下：

> 在子应用 module-basic-data 的 Home.vue 中添加以下代码：

```vue
<template>
  <div class="basic-home">
    <el-button size="small" type="primary" @click="layout.fadein = true">
      点击调用主应用下发的【fadein】组件
    </el-button>
    <h4>树形表格</h4>
    <WlTable></WlTable>
    <wl-fadein :show.sync="layout.fadein">
      <span slot="header">表单头部</span>
      <div slot="footer">
        <el-button size="small" @click="layout.fadein = false">取 消</el-button>
        <el-button size="small" type="primary" @click="layout.fadein = false">确 定</el-button>
      </div>
    </wl-fadein>
  </div>
</template>

<script>
import WlTable from '@/components/wl-table.vue';

export default {
  name: 'basic-home',
  components: { WlTable },
  data() {
    return {
      layout: {
        fadein: false,
      },
    };
  },
  created() {
    console.log(this.$mainUtils);
    console.log(this.changeDataMsg);
  },
};
</script>
```

好，我们能够看到主应用下发的 fadein 组件已经能够使用了，这里有个小 bug，我在主应用导出的组件信息中，附带了主应用的 vue 注册信息，而 Vue.use()是在子应用，可能两个应用的 vue 版本不一致而引发一些小报错（你可以修改下 library/ui/index.js 只导出组件列表）, 并且在 created 中也打印出来了我们从主应用下发下来的工具函数和 emit 函数，成功！~

- 详见[子应用 Home.vue](https://github.com/hql7/wl-micro-frontends/blob/master/module-basic-data/src/views/Home.vue)

## 微前端鉴权方案

前端鉴权这一块在项目中已经成为成熟又不可缺少的基础构成部分了，既然如此那微前端同样也绕不过这段路。
下面就从两种思路来实现微前端的前端鉴权方案

### 异步注册(主应用异步获取子应用注册表并将子应用对应的路由下发至子应用)

此方案采用在主应用请求获取子应用注册表及附带的子应用菜单数据，异步注册子应用，并在注册子应用时将子应用自身的路由下发，然后子应用在实例化路由前根据规则整理主应用下发的路由数据。

1. 先 cnpm i axios mockjs -S 引入我们要用到的插件

2. 在你乐意的地方写好 api 封装和 mockjs 应用

3. 老规矩，打开主应用 main.js，将注册子应用步骤写在异步请求里，然后整理获取的注册表数据（这里是：[子应用注册表数据结构](https://github.com/hql7/wl-micro-frontends/blob/master/master/mock/appConfig.js)）

```javascript
// 获取app注册表
getAppConfigApi().then(({ data }) => {
  if (data.code === 200) {
    let _res = data.data || [];
    // 处理菜单
    store.dispatch('menu/setUserMenu', _res);
    if (_res.length === 0) {
      Message({
        type: 'error',
        message: '没有可以注册的子应用数据',
      });
      return;
    }
    // 处理子应用注册数据
    let apps = [];
    let defaultApp = null;
    _res.forEach((i) => {
      apps.push({
        name: i.module,
        entry: i.entry,
        render,
        activeRule: genActiveRule(i.routerBase),
        props: { ...msg, ROUTES: i.children },
      });
      if (i.defaultRegister) defaultApp = i.routerBase;
    });
    // 注册子应用
    registerMicroApps(apps, {
      beforeLoad: [
        (app) => {
          console.log('before load', app);
        },
      ],
      beforeMount: [
        (app) => {
          console.log('before mount', app);
        },
      ],
      afterUnmount: [
        (app) => {
          console.log('after unload', app);
        },
      ],
    });
    // 设置默认子应用
    if (!defaultApp) defaultApp = _res[0].routerBase;
    setDefaultMountApp(defaultApp);
    // 第一个子应用加载完毕回调
    runAfterFirstMounted((app) => {
      console.log(app);
    });
    // 启动微服务
    start({ prefetch: true });
  }
});
```

4. 撸好主应用再来看下子应用 main.js,将实例化路由所需的 routes 根据 qiankun 环境加载主应用下发的还是自身的路由
   > 这里我实在不忍心再往 main 里塞逻辑了，将路由匹配文件摘出，详见[route-match](https://github.com/hql7/wl-micro-frontends/blob/master/subapp-ui/src/auth/route-match.js)

```javascript
// 导入路由匹配文件路径函数,，
import routeMatch from '@/auth/route-match';

// 判断qiankun环境
const __qiankun__ = window.__POWERED_BY_QIANKUN__;

// mount函数中根据qiankun环境使用主应用下发路由数据
export async function mount({ data, ROUTES }) {
  router = new VueRouter({
    base: __qiankun__ ? '/ui' : '/',
    mode: 'history',
    routes: __qiankun__ ? routeMatch(ROUTES, '/ui') : routes,
  });
  instance = new Vue({
    router,
    store,
    render: (h) => h(App, { props: data }),
  }).$mount('#app');
}
```

5. 只需要简单的修改，一个基础鉴权就完成了，需要注意的是[route-match](https://github.com/hql7/wl-micro-frontends/blob/master/subapp-ui/src/auth/route-match.js)中设计的匹配规则需要贴合你自己的实际。

6. 按钮权限部分设计放在路由元信息 meta 里，这样在页面内基于本页面的按钮编码判断即可，见[按钮权限](https://github.com/hql7/wl-micro-frontends/blob/master/subapp-ui/src/mixins/auth.js),但是现在主流更多的是写权限指令 v-auth 等，你可百度实现

### 异步路由(使用应用间通信，通知子应用路由数据，子应用在内部 addRoutes 异步插入路由)

此方案和 token 结合较为复杂，见：[鉴权设计](https://github.com/hql7/wl-admin/tree/master/src/auth)

## 各应用间路由基础管理

1.在主应用内设置路由监控

```javascript
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

```javascript
router = new VueRouter({
  base: window.__POWERED_BY_QIANKUN__ ? '/aaa' : '/',
  mode: 'history',
  routes,
});
```

设置 base 字段值与在主应用注册时`activeRule: genActiveRule("/aaa")`中 genActiveRule 函数内的参数一致

3.应用内路由跳转及跨应用路由处理

> 经过 1、2 步配置后

```javascript
// 子应用内跳转和普通vue项目一致：
this.$router.push() 等

// 跨应用跳转：
window.history.pushState({}, title, href);
```

## 公共资源处理

1.开发过程中
当我们有一个对多个项目、多个团队提供公共资源支持的仓库需求。
开发环境建立公共资源的目的，是减少开发时的重复劳作和多方修改带来的维护难题。  
相应的，修改 public-lib 内资源一定要有影响其他应用的觉悟并严格按照设计规范：向上兼容和可扩展性。

> 注意

1. 放入此处的文件是否满足提供多项目使用的条件

2. 此项目的文件改动必须向上兼容，不允许再未经讨论的情况下进行大的重构

3. 各应用中 library 本质上还是本仓库中的一个文件夹，提交项目代码时正常提交即可，但是需要手动将此目录推送至公共资源仓库

> 工程结构

```bash
    big-repo                            (微前端大仓库)
    |-----------app1                    (或者将每个应用作为一个仓库都可以)
    |           |------src
    |                   |------library （开发中）
    |-----------app2
    |           |------src
    |                   |------library （开发中）
    |-----------app3
    |           |------src
    |                    |-----library （开发中）
    |

    library                             （公共资源仓库）

```

下面就使用 git subtree 来将每个应用的 library

1. 将 library 仓库添加至应用仓库的 src/library 位置: 在项目仓库根路径执行以下命令

```bash
 git subtree add --prefix=app1/src/library git@**.***.1.***:****.FE/library.git master --squash
```

执行完毕，应用仓库 app1/src/路径下会出现 library 文件夹，--prefix=后面即是路径，你可以自由定制

2. 拉取公共仓库代码（如果公共仓库有更新）

```bash
 git subtree pull --prefix=src/library git@**.***.1.***:****.FE/library.git master --squash
```

3. 将 app1/src/library 下的内容改动推送至公共资源仓库

```bash
 git subtree push --prefix=src/library git@**.***.1.***:****.FE/library.git master
```

注意，你的项目代码正常推送即可，app1/src/library 作为项目下的一个文件夹无需特殊处理（方便！）

4. 说到方便，每次命令都需要写公共资源仓库 git@**.\***.1.**\*:\*\***.FE/library.git 地址是贼不方便，改！
   将先将子仓库地址添加为 remote：

```bash
 git remote add -f library git@**.***.1.***:****.FE/library.git
```

5. 此后再提交即可使用以下精简命令

```bash
  git subtree add --prefix=src/library library master --squash

  git subtree pull --prefix=src/library library master --squash

  git subtree push --prefix=src/library library master
```

2.生产环境
在主应用引入，子应用判断是否是 qiankun 环境，如果是，则忽略打包第三方依赖
vue.config.js 中：

```javascript
configureWebpack: {
  externals: process.env.NODE_ENV === 'production' ?
    {
        axios: "axios",
        "chart.js": "Chart",
        vue: "Vue"
    } : {}
},
```

## 结语

一个简单的基于 qiankun 和 vue 的实战示例就这么结束啦。  
 当然我们需要考虑的还有很多，但是我前天刚买的狼叔推荐的[【前端架构：从入门到微前端】](https://item.jd.com/12621088.html)告诉我们，架构是一件持续性和渐进式的事儿，其他的后续再逐渐丰富吧~~~

> 另附 Github 上的 demo 地址:[wl-micro-frontends(wl-qiankun)](https://github.com/hql7/wl-micro-frontends)

不想看我在这罗里吧嗦的直接代码跑起吧~，如果你觉得还有一点点可以，就请留个 star 吧~~

## Donate & 咖啡

如果你有心，可以请作者喝杯咖啡，或者推荐一份好工作

<div>
  <img src="http://wlsy.oss-cn-hangzhou.aliyuncs.com/apply.jpg" height="330" width="220" />
  <img src="http://wlsy.oss-cn-hangzhou.aliyuncs.com/wx.jpg" height="330" width="220" />
</div>

### 后续\*花絮

有群里的小伙伴问能不能举个栗子通俗的比喻一下，这不是难为我前端小菜鸡吗?安排~
![这里有个栗子](https://user-gold-cdn.xitu.io/2020/3/5/170a877ad77e35a7?w=400&h=300&f=jpeg&s=11170)

> 在未来的某个时间，世界突然出现了未知怪兽破坏和威胁人类，这个时候地球的超级英雄们不再归隐山林纷纷喷涌而出，暴打怪兽保护人类。  
> 蒙面超人变身身~~，于是我们有了五个蒙面超人，分别来自五大洲，各自特性不同，有的会喷火，有的会喷水(emmmmmm)，有的刀枪不入，有的会发射雷电，于是他们各自分工，该灭火的灭火，该放电的放电，日常还能满足需求  
> ，，，，，loading，，，，  
> 突然！有一天出现了一个超级大大大大大怪兽，它又会喷水又会喷火，那咋整啊，，，，产品们陷入了沉思，突然设计师小博说：我们把喷水超人和喷火超人放在一个超人爸爸里，岂不是就能对抗大大大大大怪兽啦！  
> 于是，喷水超人和喷火超人决定合体进化成超级喷水火超人（啊哈哈哈哈），，蒙面超人合体~~~~~，超级蒙面 biubiubiu~，，，，大怪兽 died，，欧耶，，，  
> 超人们又回到了各自的幸福生活，但是每当他们遇到有多个需求的大怪兽时，他们总能按照产品的要求相对应的合体进化，，成长为满足复杂条件的超级蒙面
