<template>
  <!-- <transition name="puff"> -->
    <v-card max-width="300" @click="clickable && $emit('clicked')" class="game-card" :class="{ 'clickable': clickable }">
      <BaseButton
        icon
        :xs="small"
        :iconSize="small ? 'medium' : 'x-large'"
        :iconName="hideIcon ? 'help-box' : gameCardIcons[type]"
        :iconColor="hideIcon? 'black' : 'white'"
        :clickable="clickable"
      >
        <BaseIcon v-if="selected" name="check-outline" size="x-large" color="green" class="selected" />
        <BaseBadge v-if="!!count" color="black" :content="count" class="card-count" />
      </BaseButton>
    </v-card>
  <!-- </transition> -->
</template>

<script>
  import { gameCardIcons, gameCardColors } from '@/specs/gameCards';

  import BaseButton from '@/components/common/BaseButton';
  import BaseIcon from '@/components/common/BaseIcon';
  import BaseBadge from '@/components/common/BaseBadge';

  export default {
    name: 'GameCard',
    components: {
      BaseButton,
      BaseIcon,
      BaseBadge
    },
    props: {
      type: {
        type: String,
        required: true
      },
      clickable: {
        type: Boolean,
        default: true
      },
      hideIcon: {
        type: Boolean,
        default: false
      },
      small: {
        type: Boolean,
        default: false
      },
      selected: {
        type: Boolean,
        default: false
      },
      count: {
        type: Number,
        default: 0
      }
    },
    created: function() {
      this.gameCardIcons = gameCardIcons;
      this.gameCardColors = gameCardColors;
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';
  
  .game-card {
    height: 50px;
    padding: 0 $spacer / 4;
    position: relative;
    background: $game-card-knight;
    cursor: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    
    &.clickable {
      cursor: pointer;
    }

    .card-count {
      position: absolute;
      right: $spacer / 4;
      top: $spacer / 2;
    }

    .selected {
      position: absolute;
      top: 0;
      right: -$spacer;
    }
  }
</style>