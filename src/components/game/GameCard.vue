<template>
  <!-- <transition name="puff"> -->
    <v-card max-width="500" @click="clickable && $emit('clicked')" class="game-card" :class="{ 'clickable': clickable }">
      <BaseButton
        icon
        :xs="small"
        :iconSize="small ? 'medium' : 'x-large'"
        :iconName="(visible || wasPlayed) ? gameCardIcons[type] : 'help-box'"
        :iconColor="wasPlayed ? 'white' : 'black'"
        :clickable="clickable"
      >
        <BaseIcon v-if="selected" name="check-outline" size="x-large" color="green" class="selected" />
        <BaseBadge v-if="!!count" color="black" :content="count" class="card-badge" />
        <BaseBadge v-if="wasPlayed" color="red" content="X" class="card-badge" />
        <section v-if="full" class="image-wrapper">
          <h2>
            {{ firstMenGameCardsTitles[type] }}
          </h2>
          <img :src="require(`../../assets/gameCards/${type}.jpg`)" :alt="`Game Card: ${type}`" class="card-image" />
        </section>
      </BaseButton>
    </v-card>
  <!-- </transition> -->
</template>

<script>
  import { gameCardIcons, gameCardColors, firstMenGameCardsTitles } from '@/specs/gameCards';

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
      visible: {
        type: Boolean,
        default: false 
      },
      clickable: {
        type: Boolean,
        default: true
      },
      wasPlayed: {
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
      },
      full: {
        type: Boolean,
        default: false
      }
    },
    created() {
      this.gameCardIcons = gameCardIcons;
      this.gameCardColors = gameCardColors;
      this.firstMenGameCardsTitles = firstMenGameCardsTitles;
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

    .card-badge {
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