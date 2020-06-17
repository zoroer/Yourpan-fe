import Vue from "vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import locale from "element-ui/lib/locale/lang/zh-CN"; // lang i18n

import App from "./App";
import router from "./router";
Vue.use(ElementUI);
Vue.config.productionTip = false;
new Vue({
  el: "#app",
  router,
  render: h => h(App)
});
