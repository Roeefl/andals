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
      <div class="adjust-snowflakes">
        <div class="icon-wrapper">
          <BaseIcon name="snowflake" color="primary" size="30px"/>
        </div>
        <BaseSlider :min="5" :max="300" :value="lobbySnowflakes" @changed="setSnowflakes($event)" />
      </div>
     </form>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import BaseSwitch from '@/components/common/BaseSwitch';
  import BaseSlider from '@/components/common/BaseSlider';
  import BaseIcon from '@/components/common/BaseIcon';

  export default {
    name: 'AppSettings',
    components: {
      BaseSwitch,
      BaseSlider,
      BaseIcon
    },
    computed: mapState([
      'lobbySnowflakes',
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
      },
      setSnowflakes: function(value) {
        this.$store.commit('setLbbySnowflakes', value);
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

    .adjust-snowflakes {
      margin-top: $spacer;
      display: flex;
      align-items: flex-start;
    }
  }
</style>
