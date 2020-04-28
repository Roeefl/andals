<template>
  <header id="appHeader">
    <div v-for="item in links" :key="`header-item-${item.to}`" class="header-item" :class="{ 'home': item.key === 'lobby' }">
      <router-link v-if="!!item.to" :to="item.to" class="router-link">
        <img v-if="item.img" :src="require(`../assets/${item.img}`)" :alt="item.key" />
        <h3 v-if="item.title" class="item-title">
          {{ item.title }}
        </h3>
      </router-link>
      <ChoiceDialog v-else buttonColor="transparent" :assetName="item.img" title="Preferences" :hasCancel="false">
        <AppSettings />
      </ChoiceDialog>
    </div>
  </header>
</template>

<script>
  import AppSettings from '@/containers/AppSettings';
  import ChoiceDialog from '@/components/common/ChoiceDialog';

  const links = [
    {
      to: '/lobby',
      key: 'lobby',
      img: 'logo.png',
      title: 'Firstmen.io'
    },
    {
      key: 'settings',
      img: 'settings.png'
    }
  ];

  export default {
    name: 'AppHeader',
    components: {
      AppSettings,
      ChoiceDialog
    },
    created() {
      this.links = links;
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  #appHeader {
    padding: $spacer;
    display: flex;

    .header-item {
      width: 60px;
      height: 60px;
      background: $primary;
      border-radius: 100px;
      display: flex;
      justify-content: center;
      align-items: center;

      &.home {
        width: auto;
        background: unset;
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
  }

  .header-item {
    & + & {
      margin-left: $spacer / 2;
    }
  }
</style>
