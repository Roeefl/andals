import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '@/views/Home';
import GameLobby from '@/views/GameLobby';
import GameRoom from '@/views/GameRoom';
import UserSignup from '@/views/UserSignup';
import GameBoardDesign from '@/views/GameBoardDesign';

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/lobby',
    name: 'Lobby',
    component: GameLobby
  },
  {
    path: '/rooms',
    name: 'Rooms',
    component: Home
  },
  {
    path: '/room/:roomId',
    name: 'Room',
    component: GameRoom
  },
  {
    path: '/signup',
    name: 'UserSignup',
    component: UserSignup
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/design',
    name: 'Layout',
    component: GameBoardDesign
  },
]

const router = new VueRouter({
  routes
});

export default router;
