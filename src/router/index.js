import Vue from "vue";
import Router from "vue-router";

// 业务页面路由
import Test from "@/router/test";

Vue.use(Router);

// 全局路由
const constantRouterMap = [
  {
    name: 'login',
    path: '/login',
    component: () => import('@/pages/login/index'),
    hidden: true
  },
  {
    path: "/",
    redirect: "/test",
    hidden: true
  }
];

// 业务路由
const asyncRouterMap = [
  Test,
];

export default new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    ...asyncRouterMap,
    ...constantRouterMap
  ]
});
