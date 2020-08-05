import Vue from "vue";
import ElementUI from "element-ui";
import '@common/style/reset.less'
import "element-ui/lib/theme-chalk/index.css";
import locale from "element-ui/lib/locale/lang/zh-CN";
import service from "@common/publicSource/service";
import sparkMD5 from 'spark-md5';

import App from "./App";
import router from "./router";
// import store from "./store";
import "@/permission"; // permission control

Vue.use(ElementUI);
Vue.config.productionTip = false;
Vue.prototype.$service = service;
Vue.prototype.$sparkMD5 = sparkMD5;

new Vue({
  el: "#app",
  router,
  render: h => h(App)
});
