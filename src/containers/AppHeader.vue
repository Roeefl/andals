<template>
  <v-card class="app-header overflow-hidden" :class="{ 'in-game': isInGame }">
    <v-app-bar
      absolute
      :color="isInGame ? 'transparent' : 'success'"
      shrink-on-scroll
      prominent
      scroll-target="#page"
      class="app-bar"
    >
      <section class="header-buttons">
        <div v-for="item in links" :key="item.key" class="header-item" :class="{ 'home': item.key === 'lobby' }">
          <router-link v-if="!!item.to" :to="item.to" class="router-link">
            <img v-if="item.img" :src="require(`../assets/${item.img}`)" :alt="item.key" />
            <h3 v-if="item.title" class="item-title">
              {{ item.title }}
            </h3>
          </router-link>
          <ChoiceDialog v-if="item.key === 'settings'" buttonColor="transparent" :iconName="item.icon" title="Preferences" :hasCancel="false">
            <AppSettings />
          </ChoiceDialog>
          <ChoiceDialog v-if="item.key === 'console'" buttonColor="transparent" :iconName="item.icon" title="Dev Console" :width="1400" :hasCancel="false">
            <!-- <DevConsole /> -->
            <div>Dev Console</div>
          </ChoiceDialog>
        </div>
      </section>
      <section v-if="!isInGame" class="additional-actions">
        Route: {{ this.$route.name }}
        <BaseButton v-for="(action, a) in actions" :key="a" icon :iconName="action.icon" iconSize="24px" />
        <BaseButton icon iconName="user" iconSize="24px" @click="$emit('login')" class="login">
          <span v-if="isLoggedIn">
            Logged in as {{ nickname }}
          </span>
          <span v-else>
            Log In
          </span>
        </BaseButton>
      </section>
    </v-app-bar>
  </v-card>
</template>

<script>
  import AppSettings from '@/containers/AppSettings';
  import DevConsole from '@/containers/DevConsole';
  import ChoiceDialog from '@/components/common/ChoiceDialog';
  import BaseButton from '@/components/common/BaseButton';

  const links = [
    {
      key: 'lobby',
      to: '/lobby',
      img: 'logo.png',
      title: 'Firstmen.io'
    },
    {
      key: 'settings',
      icon: 'cog'
    },
    {
      key: 'console',
      icon: 'console'
    }
  ];

  const actions = [
    {
      icon: 'magnify'
    },
    {
      icon: 'heart'
    },
    {
      icon: 'dots-vertical'
    }
  ];

  export default {
    name: 'AppHeader',
    components: {
      AppSettings,
      DevConsole,
      ChoiceDialog,
      BaseButton
    },
    props: {
      isLoggedIn: {
        type: Boolean,
        default: false
      },
      nickname: {
        type: String,
        default: null
      }
    },
    computed: {
      isInGame: function() {
        return this.$route.name === 'Room';
      }
    },
    created() {
      this.links = links;
      this.actions = actions;
    }
  }
</script>

<style lang="scss">
  @import '@/styles/partials';

  .app-header {
    height: $header-height;

    .app-bar {
      color: $primary;
      padding: $spacer;
      height: $header-height !important;

      .header-buttons {
        display: flex;
      }
    }

    .v-toolbar__content {
      height: $header-height !important;
      overflow-y: hidden;
      display: grid;
      grid-template-columns: 50% 50%;

      .additional-actions {
        justify-self: end; 

        .login {
          width: auto !important;
        }
      }
    }

    &.in-game {
      width: 20vw !important;
      box-shadow: none !important;

      .app-bar {
        box-shadow: none !important;
        padding: 0;
      }
    }
  }

  .header-item {
    width: 60px;
    height: 60px;
    border-radius: 100px;
    display: flex;
    justify-content: center;
    align-items: center;

    &.home {
      width: auto;
      margin-right: $spacer * 2;
    }

    .router-link {
      display: flex;

      .item-title {
        margin-left: $spacer;
        height: 32px;
        display: flex;
        align-items: flex-end;
      }
    }
  }

  .header-item {
    & + & {
      margin-left: $spacer / 2;
    }
  }
</style>
