import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import Fragment from 'vue-fragment';
import draggable from 'vuedraggable';

Vue.config.productionTip = false;
Vue.use(Fragment.Plugin);
Vue.use(draggable);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app');
