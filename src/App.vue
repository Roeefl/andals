<template>
  <v-app>
    <div id="app" class="app-wrapper">
      <div id="page">
        <AppHeader id="app-header" />
        <router-view />
      </div>
      <BaseAlert v-for="(alert, alertId, index) in alerts" :key="alertId" :text="alert" :style="{ top: `${index * 55 + 10}px` }" />
    </div>
    <audio ref="ambience">
      <source src="./assets/audio/snowstorm-ambience.mp3" type="audio/mpeg">
    </audio>
    <GameLoader v-if="isGameLoading" />
  </v-app>
</template>

<script>
  import { mapState } from 'vuex';
  import colyseusService from '@/services/colyseus';

  import AppHeader from '@/containers/AppHeader';
  import BaseAlert from '@/components/common/BaseAlert';
  import GameLoader from '@/components/interface/GameLoader';

  export default {
    name: 'App',
    components: {
      AppHeader,
      BaseAlert,
      GameLoader
    },
    computed: mapState([
      'enableAmbience',
      'isGameLoading',
      'alerts'
    ]),
    async beforeCreate() {
      await colyseusService.init();
      await colyseusService.initializeStaticResources();
    },
    watch: {
      enableAmbience: function(enabled, prevEnabled) {
        if (enabled && !prevEnabled) this.startAmbience();
        if (!enabled && prevEnabled) this.stopAmbience();
      }
    },
    methods: {
      startAmbience: function() {
        const { ambience } = this.$refs;

        if (ambience) {
          ambience.play(); 
          ambience.loop = true;
        }
      },
      stopAmbience: function() {
        const { ambience } = this.$refs;
        if (ambience) {
          ambience.pause();
          ambience.currentTime = 0;
        }
      }
    }
  }
</script>

<style lang="scss">
  @import '@/styles/reset';
  @import '@/styles/partials';

  #app {
    font-family: 'Darker Grotesque', sans-serif;
    display: flex;
    flex-direction: column;
    height: 100vh;

    ul {
      padding-left: 0;
    }

    .button-icon {
      margin-right: 0;
    }
  }

  #app-header {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    z-index: $zindex-app-header;
  }

  #page {
    position: relative;
    flex: 1;
    // background-image: url('./assets/snowy-ground.jpg');
    // background-size: cover;
    background: $secondary;
    color: $primary;
  }

  a {
    text-decoration: none;
  }
</style>
