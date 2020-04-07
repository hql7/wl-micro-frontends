import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;
// 导入乾坤函数
import {
  registerMicroApps,
  runAfterFirstMounted,
  setDefaultMountApp,
  start
} from "qiankun";
// 按需导入element-ui
import "./plugins/element.js";
// 导入封装后的ui组件
import "./library/ui/install";
// 导入路由监听函数
import { genActiveRule } from "./util";
/**
 * 主应用公共资源下发子应用
 */
// 导入主应用ui库
import LibraryUi from "./library/ui/";
// 导入主应用工具类库
import LibraryJs from "./library/js";
console.log(LibraryJs)
// 导入主应用需要下发的emit函数 
import * as childEmit from "./util/childEmit"
// 定义传入子应用的数据
import pager from "./util/pager"
// 导入应用间通信介质：呼机
let msg = {
  data: store.getters,         // 从主应用仓库读出的数据
  components: LibraryUi,       // 从主应用读出的组件库
  utils: LibraryJs,            // 从主应用读出的工具类库
  emitFnc: childEmit,          // 从主应用下发emit函数来收集子应用反馈
  pager                       // 从主应用下发应用间通信呼机
};

// 在主应用注册呼机
pager.subscribe(v => {
  console.log(`监听到子应用${v.from}发来消息：`, v)
  store.dispatch('app/setToken', v.token)
})

// 主应用渲染函数
let app = null;
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
render();

//注册子应用
registerMicroApps(
  [
    {
      name: "subapp-ui",
      entry: "//localhost:6651",
      render,
      activeRule: genActiveRule("/ui"),
      props: msg
    },
    {
      name: "subapp-blog",
      entry: "//localhost:6652",
      render,
      activeRule: genActiveRule("/blog"),
      props: msg
    }
  ],
  {
    beforeLoad: [
      app => {
        console.log("before load", app);
      }
    ],
    beforeMount: [
      app => {
        console.log("before mount", app);
      }
    ],
    afterUnmount: [
      app => {
        console.log("after unload", app);
      }
    ]
  }
);

// 设置默认子应用
setDefaultMountApp("/ui");
// 第一个子应用加载完毕回调
runAfterFirstMounted((app) => {
  console.log(app)
});
// 启动微服务
start({ prefetch: true });


