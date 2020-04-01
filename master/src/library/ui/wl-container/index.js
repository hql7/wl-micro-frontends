import WlContainer from "./index.vue";

WlContainer.install = function (Vue) {
  Vue.component(WlContainer.name, WlContainer);
};

export default WlContainer;