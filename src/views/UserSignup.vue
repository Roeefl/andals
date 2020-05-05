<template>
  <main class="user-signup">
    <div class="header-fallback" />
    <section class="signup-container">
      <CustomizePlayer light isSignup @created="onUserCreated($event)" class="customize-player" />
    </section>
  </main>
</template>

<script>
  import { mapState } from 'vuex';
  import router from '@/router';
  import colyseusService from '@/services/colyseus';
  import firebaseService from '@/services/firebase';
  
  import CustomizePlayer from '@/components/lobby/CustomizePlayer';

  export default {
    name: 'UserSignup',
    components: {
      CustomizePlayer
    },
    created() {
      if (this.currentUser.email)
        router.push('/lobby');
    },
    computed: mapState([
      'currentUser'
    ]),
    methods: {
      onUserCreated: async function(addedDbuser) {
        this.$store.commit('setCurrentUser', addedDbuser);
        this.$store.commit('addAlert', 'Successfully signed up! welcome aboard =)');
        router.push('/lobby');
      }
    }
  }
</script>

<style scoped lang="scss">
 @import '@/styles/partials';

  .user-signup {
    .header-fallback {
      height: $header-height;
      background: $primary;
      margin-bottom: $spacer * 2;
    }

    .signup-container {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;

      .customize-player {
        width: 40%;
      }
    }
  }
</style>
