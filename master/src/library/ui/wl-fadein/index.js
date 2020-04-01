import WlFadein from "./index.vue";

WlFadein.install = function (Vue) {
  Vue.component(WlFadein.name, WlFadein);
};

export default WlFadein;