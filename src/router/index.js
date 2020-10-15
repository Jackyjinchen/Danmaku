import Vue from "vue";
import VueRouter from "vue-router";
import Barrage from "@/components/Barrage";
import Websocket from "@/components/Websocket";

Vue.use(VueRouter);

const originalPush = VueRouter.prototype.push;

VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};

const router = new VueRouter({
  // mode: 'history',
  routes: [
    {
      path: "/",
      component: Barrage
    },
    {
      path: "/web",
      component: Websocket
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return {
        x: 0,
        y: 0
      };
    }
  }
});

export default router;
