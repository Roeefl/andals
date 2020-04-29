<template>
  <BaseOverlay :isOpen="true" class="game-loader">
    <v-progress-circular
      indeterminate
      :color="color"
      :size="size"
      :width="width"
    />
    <div class="content">
      <span>
        Game Loading...
      </span>
    </div>
    <ul class="players">
      <li
        v-for="(player, p) in players"
        :key="p"
        class="player"
      >
        <span>
          {{ player.nickname }} is connecting...
        </span>
      </li>
    </ul>
  </BaseOverlay>
</template>

<script>
  import BaseOverlay from '@/components/common/BaseOverlay';

  export default {
    name: 'GameLoader',
    components: {
      BaseOverlay
    },
    props: {
      size: {
        type: Number,
        default: 100
      },
      color: {
        type: String,
        default: 'primary'
      },
      width: {
        type: Number,
        default: 7
      },
      players: {
        type: Array,
        default: () => []
      },
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  .game-loader {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 1000;

    .content {
      font-size: $font-size-lg;
      margin-top: $spacer;
    }

    .players {
      display: flex;
      flex-direction: column;

      .player {
        padding: 1px;
      }
    }
  }
</style>
