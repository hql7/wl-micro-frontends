import WlScroll from "./index.vue";

WlScroll.install = function (Vue) {
  Vue.component(WlScroll.name, WlScroll);
};

export default WlScroll;