<template>
  <v-app>
    <div id="app" class="app-wrapper">
      <header id="header">
        <router-link to="/">
          <img src="./assets/logo.png" alt="logo" />
        </router-link>
        <div id="nav">
          <router-link to="/rooms">Rooms</router-link>
          <router-link to="/room">Game Room</router-link>
          <router-link to="/about">About</router-link>
        </div>
      </header>
      <div id="page">
        <router-view />
      </div>
      <Alert v-for="(alert, alertId) in alerts" :key="alertId" :text="alert" />
    </div>
  </v-app>
</template>

<script>
  import { mapState } from 'vuex';
  import colyseusService from '@/services/colyseus';
  import Alert from '@/components/common/Alert';
  
  export default {
    name: 'App',
    components: {
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

  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    color: $primary;
    display: flex;
    flex-direction: column;
    height: 100vh;
    background: $tile-water;

    ul {
      padding-left: 0;
    }
  }

  #header {
    padding: $spacer * 2;
    display: flex;

    #nav {
      margin-left: $spacer * 4;
    }

    a {
      font-weight: bold;
      color: $primary;
      margin-right: $spacer;

      &.router-link-exact-active {
        color: $highlighted;
      }
    }
  }

  #page {
    flex: 1;
  }
</style>
