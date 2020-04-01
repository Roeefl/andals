<template>
  <v-app>
    <div id="app" class="app-wrapper">
      <div id="nav">
        <router-link to="/">Home</router-link>
        <router-link to="/about">About</router-link>
        <router-link to="/room">Game Room</router-link>
        <router-link to="/settings">Settings</router-link>
      </div>
      <div id="page">
        <router-view />
      </div>
    </div>
  </v-app>
</template>

<script>
  import colyseusService from '@/services/colyseus';
  
  export default {
    name: 'App',
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
    // width: 100vw;
    // height: 100vh;
    display: flex;
    flex-direction: column;

    ul {
      padding-left: 0;
    }
  }

  #nav {
    padding: $spacer * 2;
    // width: 100%;
    display: flex;
    justify-content: center;

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
