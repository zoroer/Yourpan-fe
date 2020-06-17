import Vue from "vue";
import Router from "vue-router";
import Test from "@/router/test";

Vue.use(Router);

export const asyncRouterMap = [
  Test,
];

export default new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: [...asyncRouterMap]
});
