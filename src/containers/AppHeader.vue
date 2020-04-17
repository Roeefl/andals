<template>
  <header id="appHeader">
    <div class="header-item" v-for="item in links" :key="`header-item-${item.to}`">
      <router-link v-if="!!item.to" :to="item.to">
        <img v-if="item.img" :src="require(`../assets/${item.img}`)" :alt="item.key" />
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
      to: '/',
      key: 'home',
      img: 'logo.png'
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
      background: rgba(black, 0.5);
      border-radius: 100px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .header-item {
    & + & {
      margin-left: $spacer / 2;
    }
  }
</style>
