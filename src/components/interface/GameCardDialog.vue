<template>
  <v-dialog
    :value="isOpen"
    persistent
    width="400"
  >
    <ActionCard
      :title="firstMenGameCardsTitles[type]"
      :titleColor="gameCardColors[type]"
      @cancel="$emit('dismiss')"
      :approve="playAllowed"
      approveText="Play Card"
      @approve="$emit('play')"
    >
      <div class="dialog-content">
        <GameCard
          :type="type"
          full
          visible
          :clickable="false"
          class="game-card"
        />
      </div>
    </ActionCard>
  </v-dialog>
</template>

<script>
  import { gameCardColors, firstMenGameCardsTitles } from '@/specs/gameCards';

  import ActionCard from '@/components/common/ActionCard';
  import GameCard from '@/components/game/GameCard';

  export default {
    name: 'GameCardDialog',
    components: {
      ActionCard,
      GameCard
    },
    props: {
      isOpen: {
        type: Boolean,
        default: false
      },
      type: {
        type: String,
        required: true
      },
      playAllowed: {
        type: Boolean,
        default: false
      }
    },
    created() {
      this.gameCardColors = gameCardColors;
      this.firstMenGameCardsTitles = firstMenGameCardsTitles;
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  .dialog-content {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;

    .game-card {
      height: 40vh;
    }
  }
</style>
