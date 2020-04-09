<template>
  <v-app>
    <div id="app" class="app-wrapper">
      <div id="page">
        <Header />
        <router-view />
      </div>
      <Alert v-for="(alert, alertId) in alerts" :key="alertId" :text="alert" />
    </div>
  </v-app>
</template>

<script>
  import { mapState } from 'vuex';

  import colyseusService from '@/services/colyseus';

  import Header from '@/containers/Header';
  import Alert from '@/components/common/Alert';
  
  export default {
    name: 'App',
    components: {
      Header,
      Alert
    },
    computed: mapState([
      'alerts'
    ]),
    async beforeCreate() {
      await colyseusService.init();
    }
  }
</script>

<style lang="scss">
  @import '@/styles/reset';
  @import '@/styles/partials';

  $header-height: 85px;

  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    color: $primary;
    display: flex;
    flex-direction: column;
    height: 100vh;

    ul {
      padding-left: 0;
    }
  }

  #page {
    position: relative;
    flex: 1;
    padding-top: $header-height;
    background-image: url('./assets/wood.jpg');
    background-size: cover;
    color: white;
  }
</style>
