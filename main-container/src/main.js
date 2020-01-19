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
// 导入公共工具函数
import { genActiveRule, routerGo } from "./library/js/util"

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

// 定义传入子应用的数据
let msg = {
  data: store.getters,
  fns: [
    routerGo,
    function changeDataMsg(val) {
      store.dispatch('send-data/changeMsg', val)
    }
  ]
};

//注册子应用
registerMicroApps(
  [
    {
      name: "module-app1",
      entry: "//localhost:6651",
      render,
      activeRule: genActiveRule("/app1"),
      props: msg
    },
    {
      name: "module-app2",
      entry: "//localhost:6652",
      render,
      activeRule: genActiveRule("/app2"),
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
setDefaultMountApp("/app1");
// 第一个子应用加载完毕回调
runAfterFirstMounted(() => {
  console.log(app)
});
// 启动微服务
start({ prefetch: true });

/* new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app"); */
