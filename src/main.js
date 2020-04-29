import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import Fragment from 'vue-fragment';
import VueDragDrop from 'vue-drag-drop';
import firebaseService from '@/services/firebase';

Vue.config.productionTip = false;
Vue.use(Fragment.Plugin);
Vue.use(VueDragDrop);

firebaseService.init(
  async (user) => store.commit('setCurrentUser', user)
);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app');
