import Vue from "vue";
import VueRouter from "vue-router";
import App from "./App.vue";
import "./public-path";
import routes from "./router";
import store from "./store";
import "./plugins/element.js";
import "@/assets/css/demo.min.css"

Vue.config.productionTip = false;

let router = null;
let instance = null;

export async function bootstrap({ components, utils, emitFnc, pagers }) {
  // 注册主应用下发的组件
  Vue.use(components);
  // 把工具函数挂载在vue $mainUtils对象
  Vue.prototype.$mainUtils = utils;
  // 把mainEmit函数一一挂载
  Object.keys(emitFnc).forEach(i => {
    Vue.prototype[i] = emitFnc[i]
  });
  Vue.prototype.$pagers = pagers;
}

export async function mount({ data = {} } = {}) {
  router = new VueRouter({
    base: window.__POWERED_BY_QIANKUN__ ? "/ui" : "/",
    mode: "history",
    routes
  });
  instance = new Vue({
    router,
    store,
    render: h => h(App, { props: data })
  }).$mount("#app");
}

export async function unmount() {
  instance.$destroy();
  instance = null;
  router = null;
}

// 单独开发环境
window.__POWERED_BY_QIANKUN__ || mount();

/* new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app"); */
