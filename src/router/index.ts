import Vue from 'vue'
import VueRouter, {RawLocation, RouteConfig} from 'vue-router'
import MyRecommand from 'components/m-recommand/MyRecommand.vue'

Vue.use(VueRouter)

const originPush = VueRouter.prototype.push

VueRouter.prototype.push = function (location: RawLocation) {
  return (originPush.call(this, location) as any).catch((e: Error) => e)
}

const routes: Array<RouteConfig> = [
  {
    path: '/',
    redirect: '/recommand'
  },
  {
    path: '/recommand',
    component: MyRecommand
  },
  {
    path: '/rank',
    component: () => import('components/m-rank/MyRank.vue')
  },
  {
    path: '/search',
    component: () => import('components/m-search/MySearch.vue')
  },
  {
    path: '/singers',
    component: () => import('components/m-singers/MySingers.vue'),
    children: [
      {
        path: ':id',
        component: () => import('components/m-singer-detail/SingerDetail.vue')
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
