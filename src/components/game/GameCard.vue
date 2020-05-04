<template>
  <v-card light max-width="400" @click="clickable && $emit('clicked')" class="game-card" :class="{ 'clickable': clickable, 'thumbnail': !full }" :style="cardStyle">
    <BaseButton
      v-if="!full"
      icon
      :xs="small"
      :iconSize="small ? 'medium' : 'x-large'"
      :iconName="(visible || wasPlayed) ? gameCardIcons[type] : 'help-box'"
      :iconColor="wasPlayed ? 'primary' : 'secondary'"
      :clickable="clickable"
    >
      <BaseIcon v-if="selected" name="check-outline" size="x-large" color="green" class="selected" />
      <BaseBadge v-if="!!count" color="secondary" :content="count" class="card-badge" />
      <BaseBadge v-if="wasPlayed" color="red" content="X" class="card-badge" />
    </BaseButton>
    <section v-else class="full-card">
      <h2 class="card-title">
        {{ firstMenGameCardsTitles[type] }}
      </h2>
      <div class="card-image-wrapper">
        <img :src="require(`../../assets/gameCards/${type}.jpg`)" :alt="`Game Card: ${type}`" class="card-image" />
      </div>
      <div v-if="withDescription" class="card-description">
        {{ firstMenGameCardsDescriptions[type] }}
      </div>
    </section>
  </v-card>
</template>

<script>
  import { gameCardIcons, gameCardColors, firstMenGameCardsTitles, firstMenGameCardsDescriptions } from '@/specs/gameCards';

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
      },
      withDescription: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      cardStyle: function() {
        if (!this.visible || this.full) return {};
        
        return {
          backgroundColor: gameCardColors[this.type]
        };
      }
    },
    created() {
      this.gameCardIcons = gameCardIcons;
      this.gameCardColors = gameCardColors;
      this.firstMenGameCardsTitles = firstMenGameCardsTitles;
      this.firstMenGameCardsDescriptions = firstMenGameCardsDescriptions;
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';
  
  .game-card {
    padding: 0 $spacer / 4;
    position: relative;
    cursor: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    
    &.clickable {
      cursor: pointer;
    }

    &.thumbnail {
      height: 50px;
      background: $primary;
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

    .full-card {
      height: 100%;
      // padding: $spacer / 2;
      display: flex;
      flex-direction: column;
      align-items: center;

      .card-title {
        background: $game-card-victory-point;
        width: 100%;
        text-align: center;
        font-size: $font-size-sm;
        flex: 1;
      }

      .card-image-wrapper {
        flex: 4;
        min-height: 70%;

        .card-image {
          width: 100%;
          height: 100%;
        }
      }

      .card-description {
        flex: 1;
        display: flex;
        align-items: center;
      }
    }
  }
</style>