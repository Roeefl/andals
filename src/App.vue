<template>
  <v-app>
    <div id="app" class="app-wrapper">
      <div id="page">
        <router-view></router-view>
      </div>
      <BaseAlert v-for="(alert, alertId, index) in alerts" :key="alertId" :text="alert.text" :color="alert.color" :style="{ top: `${index * 55 + 10}px` }"></BaseAlert>
    </div>
    <audio ref="ambience">
      <source src="./assets/audio/snowstorm-ambience.mp3" type="audio/mpeg">
    </audio>
    <BaseButton
      spaced
      color="primary"
      iconName="play-box-outline"
      iconSize="24px"
      iconColor="success"
      @click="startAmbience"
      class="ambience-start"
    >
      Ambience, Please
    </BaseButton>
    <Avital class="avital" />
    <GameLoader v-if="isGameLoading" :players="players"></GameLoader>
    <v-dialog v-model="isDisplayCustomizePlayer" width="400" @click:outside="isDisplayCustomizePlayer = false">
      <PlayerCustomize @close="isDisplayCustomizePlayer = false"></PlayerCustomize>
    </v-dialog>
  </v-app>
</template>

<script>
  import { mapState } from 'vuex';
  import router from '@/router';
  import colyseusService from '@/services/colyseus';
  import firebaseService from '@/services/firebase';

  import AppHeader from '@/containers/AppHeader';
  import BaseAlert from '@/components/common/BaseAlert';
  import GameLoader from '@/components/interface/GameLoader';
  import PlayerCustomize from '@/components/lobby/PlayerCustomize';
  import BaseButton from '@/components/common/BaseButton';
  import Avital from '@/components/common/Avital';

  import { FIREBASE_USER_SIGNUP } from '@/constants'

  export default {
    name: 'App',
    components: {
      AppHeader,
      BaseAlert,
      BaseButton,
      Avital,
      GameLoader,
      PlayerCustomize
    },
    data: () => ({
      isDisplayCustomizePlayer: false
    }),
    computed: {
      isLoggedIn: function() {
        return !!(this.currentUser && this.currentUser.uid);
      },
      ...mapState([
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
    methods: {
      handleLogin: async function() {
        console.log("currentUser", this.currentUser);

        const wasLoggedIn = (this.currentUser && this.currentUser.email)
        
        const currentUser = wasLoggedIn
          ? await firebaseService.logout()
          : await firebaseService.login();

        if (currentUser === FIREBASE_USER_SIGNUP) {
          router.push('/signup');
          return;
        }

        this.$store.commit('setCurrentUser', currentUser || {});
        this.$store.commit('addAlert', { text: `You are now logged ${wasLoggedIn ? 'out' : 'in'}` });
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
  @import '@/styles/vuejs-dialog';

  #app {
    font-family: 'Darker Grotesque', sans-serif;
    display: flex;
    flex-direction: column;
    height: 100vh;
    position: relative;

    ul {
      padding-left: 0;
    }

    .button-icon {
      margin-right: 0;
    }

    .ambience-start {
      position: absolute;
      top: $spacer * 2;
      left: $spacer * 2;
      z-index: 2000;
    }

    .avital {
      position: absolute;
      top: 5%;
      left: 10%;
      z-index: 10000;
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
    background: $secondary;
    color: $primary;
  }

  a {
    text-decoration: none;
  }
</style>
