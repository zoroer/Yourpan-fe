import router from "@/router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { getToken } from "@common/publicSource/auth";
NProgress.configure({
  showSpinner: false
});

const whiteList = ["/login", "/regist"];

router.beforeEach((to, from, next) => {
  NProgress.start();

  if (getToken()) {
    if (to.path === "/login" || to.path === '/regist') {
      next("/home");
      NProgress.done();
    } else {
      next();
    }
  } else {
    // 在免登录白名单中，直接进入
    whiteList.indexOf(to.path) > -1
      ? next()
      : next("/login");
    NProgress.done();
  }
});

router.afterEach(() => {
  NProgress.done();
});
