import Vue from "vue";
import VueRouter from "vue-router";
import App from "./App.vue";
import "./public-path";
import routes from "./router";
import store from "./store";
import "./plugins/element.js";
import "@/assets/css/demo.min.css"
import routeMatch from "@/auth/route-match"; // 导入路由匹配文件路径函数

Vue.config.productionTip = false;

let router = null;
let instance = null;
const __qiankun__ = window.__POWERED_BY_QIANKUN__;

export async function bootstrap({ components, utils, emitFnc, pager, actions }) {
    // 注册主应用下发的组件
    Vue.use(components);
    // 把工具函数挂载在vue $mainUtils对象
    Vue.prototype.$mainUtils = utils;
    // 把mainEmit函数一一挂载
    Object.keys(emitFnc).forEach(i => {
        Vue.prototype[i] = emitFnc[i]
    });
    // 在子应用注册呼机
    pager.subscribe(v => {
        console.log(`监听到子应用${v.from}发来消息：`, v)
            // store.dispatch('app/setToken', v.token)
    })
    Vue.prototype.$pager = pager;
    // 在子应用注册官方通信
    /* actions.onGlobalStateChange((state, prev) => console.log(`子应用subapp-ui监听到来自${state.from}发来消息：`, state, prev)); */
    Vue.prototype.$actions = actions;
}

export async function mount({ data = {}, ROUTES, routerBase, state } = {}) {
    router = new VueRouter({
        base: __qiankun__ ? routerBase : "/",
        mode: "history",
        routes: __qiankun__ ? routeMatch(ROUTES, routerBase) : routes
    });
    instance = new Vue({
        router,
        store,
        render: h => h(App, {
            props: {...data, ...state }
        })
    }).$mount("#app");
}

export async function unmount() {
    instance.$destroy();
    instance = null;
    router = null;
}

// 单独开发环境
__qiankun__ || mount();

/* new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app"); */