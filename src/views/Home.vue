<template>
  <div id="home">
    <router-link to="/lobby">
      <BaseButton color="white">
        Take me to Lobby
      </BaseButton>
    </router-link>
  </div>
</template>

<script>
  import BaseButton from '@/components/common/BaseButton';

  export default {
    name: 'Home',
    components: {
      BaseButton
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  #home {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
