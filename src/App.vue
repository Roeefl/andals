<template>
  <v-app>
    <div id="app" class="app-wrapper">
      <div id="page">
        <router-view />
      </div>
      <BaseAlert v-for="(alert, alertId, index) in alerts" :key="alertId" :text="alert" :style="{ top: `${index * 55 + 10}px` }" />
    </div>
    <audio ref="ambience">
      <source src="./assets/audio/snowstorm-ambience.mp3" type="audio/mpeg">
    </audio>
  </v-app>
</template>

<script>
  import { mapState } from 'vuex';
  import colyseusService from '@/services/colyseus';

  import BaseAlert from '@/components/common/BaseAlert';
  
  export default {
    name: 'App',
    components: {
      BaseAlert
    },
    computed: mapState([
      'enableAmbience',
      'alerts'
    ]),
    async beforeCreate() {
      await colyseusService.init();
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

  #page {
    position: relative;
    flex: 1;
    // background-image: url('./assets/snowy-ground.jpg');
    // background-size: cover;
    background: $primary;
    color: $primary;
  }
</style>
