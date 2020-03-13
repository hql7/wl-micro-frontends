import WlContextmenu from "./index.vue";

WlContextmenu.install = function (Vue) {
  Vue.component(WlContextmenu.name, WlContextmenu);
};

export default WlContextmenu;