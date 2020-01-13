import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;
import {
  registerMicroApps,
  runAfterFirstMounted,
  setDefaultMountApp,
  start
} from "qiankun";
import "./plugins/element.js";

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

// 路由监听
function genActiveRule(routerPrefix) {
  return location => location.pathname.startsWith(routerPrefix);
}

render();

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

//注册子应用
registerMicroApps(
  [
    {
      name: "module-basic-data",
      entry: "//localhost:7771",
      render,
      activeRule: genActiveRule("/basic"),
      props: msg
    },
    {
      name: "module-report",
      entry: "//localhost:7772",
      render,
      activeRule: genActiveRule("/report"),
      props: msg
    }
  ]
  /* {
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
  } */
);

// 设置默认子应用
setDefaultMountApp("/basic");
// 第一个子应用加载完毕回调
runAfterFirstMounted();
// 启动微服务
start({ prefetch: true});

/* new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app"); */
