<template>
  <div class="app-settings">
    <form class="preferences">
      <BaseSwitch
        label="Sound and Background Music"
        :value="enableAmbience"
        @flipped="toggleAmbience"
      />
      <BaseSwitch
        label="In-game Snow"
        :value="enableSnow"
        @flipped="toggleSnow"
      />
      <BaseSwitch
        label="Developer Mode"
        :value="isDeveloperMode"
        @flipped="toggleDeveloperMode"
      />
      <BaseSwitch
        label="Use HTML5 Game Engine (Experimental)"
        :value="isUseGameEngine"
        disabled
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
      'enableSnow',
      'enableAmbience',
      'isDeveloperMode',
      'isUseGameEngine'
    ]),
    methods: {
      toggleAmbience: function() {
        this.$store.commit('toggleAmbience');
      },
      toggleSnow: function() {
        this.$store.commit('toggleSnow');
      },
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
