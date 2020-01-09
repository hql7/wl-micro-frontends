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
/* function render({ appContent, loading }) {
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
*/
function render({ appContent, loading }) {
  if (!app && appContent !== undefined) {
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
  } else if (app == null && appContent !== undefined) {
    app.content = appContent;
    app.loading = loading;
  }
}

function genActiveRule(routerPrefix) {
  return location => location.pathname.startsWith(routerPrefix);
}
render({ loading: true });
let msg = {
  auth: false
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
      activeRule: genActiveRule("/report")
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
setDefaultMountApp("/basic");
runAfterFirstMounted(() => console.info("first app mounted"));
start();

/* new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app"); */
