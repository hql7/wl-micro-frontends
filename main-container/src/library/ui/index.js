
import FtContainer from "./ft-container/";
import FtContextmenu from "./ft-contextmenu/";

const components = [FtContainer, FtContextmenu];

const install = function (Vue) {
  components.forEach(component => {
    Vue.component(component.name, component);
  });
};

if (typeof window !== "undefined" && window.Vue) {
  install(window.Vue);
}

export default {
  install,
  FtContainer,
  FtContextmenu
};