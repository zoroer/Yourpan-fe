import Vue from "vue";
import ElementUI from "element-ui";
import '@common/style/reset.less'
import "element-ui/lib/theme-chalk/index.css";
import locale from "element-ui/lib/locale/lang/zh-CN";
import service from "./common/publicSource/service";

import App from "./App";
import router from "./router";
Vue.use(ElementUI);
Vue.config.productionTip = false;
Vue.prototype.$service = service;

new Vue({
  el: "#app",
  router,
  render: h => h(App)
});
