import Vue from "vue";
import Router from "vue-router";

// 业务页面路由
import Home from "@/router/home";

Vue.use(Router);

// 全局路由
const constantRouterMap = [
  {
    name: 'login',
    path: '/login',
    component: () => import('@/pages/login/index'),
  },
  {
    name: 'regist',
    path: '/regist',
    component: () => import('@/pages/regist/index'),
  },
  {
    path: "/",
    redirect: "/Home",
  }
];

// 业务路由
const asyncRouterMap = [
  Home,
];

export default new Router({
  routes: [
    ...asyncRouterMap,
    ...constantRouterMap
  ]
});
