<template>
  <header id="appHeader">
    <div class="header-item" v-for="(item, i) in links" :key="`header-item-${item.to}`">
      <router-link :to="item.to">
        <img v-if="item.img" :src="require(`../assets/${item.img}`)" :alt="item.name" />
      </router-link>
    </div>
  </header>
</template>

<script>
  import BaseButton from '@/components/common/BaseButton';

  const links = [
    {
      to: '/',
      name: 'Home',
      img: 'logo.png'
    },
    {
      to: '#',
      name: 'Settings',
      img: 'settings.png'
    }
  ];

  export default {
    name: 'AppHeader',
    components: {
      BaseButton
    },
    created() {
      this.links = links;
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  #appHeader {
    position: absolute;
    top: $spacer / 2;
    left: $spacer /2;
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
</style>
