<template>
  <v-app>
    <div id="app" class="app-wrapper">
      <div id="page">
        <AppHeader
          id="app-header"
          :isLoggedIn="isLoggedIn"
          :nickname="(currentUser || {}).nickname"
          @login="handleLogin"
          @customize-player="isDisplayCustomizePlayer = true"
        />
        <router-view />
      </div>
      <BaseAlert v-for="(alert, alertId, index) in alerts" :key="alertId" :text="alert" :style="{ top: `${index * 55 + 10}px` }" />
    </div>
    <audio ref="ambience">
      <source src="./assets/audio/snowstorm-ambience.mp3" type="audio/mpeg">
    </audio>
    <GameLoader v-if="isGameLoading" :players="players" />
    <CustomizePlayer
      v-if="isDisplayCustomizePlayer"
      :isOpen="isDisplayCustomizePlayer"
      @close="isDisplayCustomizePlayer = false"
    />
  </v-app>
</template>

<script>
  import { mapState } from 'vuex';
  import colyseusService from '@/services/colyseus';
  import firebaseService from '@/services/firebase';

  import AppHeader from '@/containers/AppHeader';
  import BaseAlert from '@/components/common/BaseAlert';
  import GameLoader from '@/components/interface/GameLoader';
  import CustomizePlayer from '@/components/lobby/CustomizePlayer';

  export default {
    name: 'App',
    components: {
      AppHeader,
      BaseAlert,
      GameLoader,
      CustomizePlayer
    },
    data: () => ({
      isDisplayCustomizePlayer: false
    }),
    computed: {
      isLoggedIn: function() {
        return !!(this.currentUser && this.currentUser.uid);
      },
      ...mapState([
        'enableAmbience',
        'isGameLoading',
        'currentUser',
        'alerts',
        'players'
      ])
    },
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
      handleLogin: async function() {
        console.log("currentUser", this.currentUser);

        const wasLoggedIn = (this.currentUser && this.currentUser.email)
        
        const currentUser = wasLoggedIn
          ? await firebaseService.logout()
          : await firebaseService.login();

        this.$store.commit('setCurrentUser', currentUser || {});
        this.$store.commit('addAlert', `You are now logged ${wasLoggedIn ? 'out' : 'in'}`);
      },
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

  .dg-container {
    display: flex;
    justify-content: center;
    align-items: center;

    .dg-content-cont {
      position: static;

      .dg-main-content {
        background: $secondary;
        color: $primary;
        border: 1px solid $primary;

        .dg-content-body {
          border-bottom: 0;
        }

        .dg-btn--ok {
          background: $success;
          color: $primary;
          border: 0;
        }

        .dg-btn--cancel {
          background: $warning;
          border: 0;
        }
        
        // .dg-btn-loader .dg-circle {
        //   background-color: green;
        // }
      }
    }
  }
</style>
