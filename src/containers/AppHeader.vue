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
        <div v-for="item in links" :key="`header-item-${item.to}`" class="header-item" :class="{ 'home': item.key === 'lobby' }">
          <router-link v-if="!!item.to" :to="item.to" class="router-link">
            <img v-if="item.img" :src="require(`../assets/${item.img}`)" :alt="item.key" />
            <h3 v-if="item.title" class="item-title">
              {{ item.title }}
            </h3>
          </router-link>
          <ChoiceDialog v-else buttonColor="transparent" iconName="cog" title="Preferences" :hasCancel="false">
            <AppSettings />
          </ChoiceDialog>
        </div>
      </section>
      <section v-if="!isInGame">
        Route: {{ this.$route.name }}
        <BaseButton v-for="(action, a) in actions" :key="a" icon :iconName="action.icon" iconSize="24px" />
      </section>
    </v-app-bar>
  </v-card>
</template>

<script>
  import AppSettings from '@/containers/AppSettings';
  import ChoiceDialog from '@/components/common/ChoiceDialog';
  import BaseButton from '@/components/common/BaseButton';

  const links = [
    {
      to: '/lobby',
      key: 'lobby',
      img: 'logo.png',
      title: 'Firstmen.io'
    },
    {
      key: 'settings'
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
      ChoiceDialog,
      BaseButton
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
      display: flex;
      justify-content: space-between;
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
