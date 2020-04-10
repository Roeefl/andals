<template>
  <div class="app-settings">
    <form class="preferences">
      <BaseSwitch
        label="Developer Mode"
        :value="isDeveloperMode"
        @flipped="toggleDeveloperMode"
      />
      <BaseSwitch
        label="Use HTML5 Game Engine (Experimental)"
        :value="isUseGameEngine"
        @flipped="toggleUseGameEngine"
      />
    </form>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import BaseSwitch from '@/components/common/BaseSwitch';

  export default {
    name: 'AppSettings',
    components: {
      BaseSwitch
    },
    computed: mapState([
      'isDeveloperMode',
      'isUseGameEngine'
    ]),
    methods: {
      toggleDeveloperMode: function() {
        this.$store.commit('toggleDeveloperMode');
      },
      toggleUseGameEngine: function() {
        this.$store.commit('toggleUseGameEngine');
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  .preferences {
    padding: $spacer;
    display: flex;
    flex-direction: column;
  }
</style>
