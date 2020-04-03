<template>
  <v-app>
    <div id="app" class="app-wrapper">
      <header id="header">
        <router-link to="/">firstmen.io</router-link>
        <div id="nav">
          <router-link to="/rooms">Rooms</router-link>
          <router-link to="/room">Game Room</router-link>
          <router-link to="/about">About</router-link>
        </div>
      </header>
      <div id="page">
        <router-view />
      </div>
      <GameAlert v-for="(alert, i) in alerts" :key="i" :text="alert" />
    </div>
  </v-app>
</template>

<script>
  import { mapState } from 'vuex';
  import colyseusService from '@/services/colyseus';
  import GameAlert from '@/components/GameAlert';
  
  export default {
    name: 'App',
    components: {
      GameAlert
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
