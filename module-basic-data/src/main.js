import Vue from "vue";
import VueRouter from 'vue-router';
import App from "./App.vue";
import './public-path';
import routes from "./router";
import store from "./store";

Vue.config.productionTip = false;

let router = null;
let instance = null;

export async function bootstrap(props) {
  console.log(props)
  console.log("进入基础数据");
}

export async function mount() {
  router = new VueRouter({
    base: window.__POWERED_BY_QIANKUN__ ? '/basic' : '/',
    mode: 'history',
    routes
  });
  instance = new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount("#app")
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
