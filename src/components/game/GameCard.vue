<template>
  <!-- <transition name="puff"> -->
    <v-card max-width="300" @click="clickable && $emit('clicked')" class="game-card" :class="{ 'clickable': clickable }">
      <Button
        icon
        :xs="small"
        :iconSize="small ? 'medium' : 'x-large'"
        :iconName="hideIcon ? 'help-box' : gameCardIcons[type]"
        :iconColor="hideIcon? 'black' : 'white'"
        :clickable="clickable"
      >
        <Icon v-if="selected" name="check-outline" size="x-large" color="green" class="selected" />
        <Badge v-if="!!count" :color="gameCardColors[type]" :content="count === 0 ? '0' : count" />
      </Button>
    </v-card>
  <!-- </transition> -->
</template>

<script>
  import { gameCardIcons, gameCardColors } from '@/specs/gameCards';

  import Button from '@/components/common/Button';
  import Icon from '@/components/common/Icon';
  import Badge from '@/components/common/Badge';

  export default {
    name: 'GameCard',
    components: {
      Button,
      Icon,
      Badge
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
    
    &.clickable {
      cursor: pointer;
    }

    .selected {
      position: absolute;
      top: 0;
      right: -$spacer;
    }
  }
</style>