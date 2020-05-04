<template>
  <BaseOverlay :isOpen="true">
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
        <div class="avatar">
          <BaseAvatar v-if="player.avatar" :size="100" :src="require(`../../assets/avatars/${player.avatar}.png`)" :alt="player.nickname" />
          <span class="nickname">
            {{ player.nickname }} is connecting...
          </span>
        </div>
      </li>
    </ul>
  </BaseOverlay>
</template>

<script>
  import BaseOverlay from '@/components/common/BaseOverlay';
  import BaseAvatar from '@/components/common/BaseAvatar';

  export default {
    name: 'GameLoader',
    components: {
      BaseOverlay,
      BaseAvatar
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

    .avatar {
      display: flex;
      align-items: center;

      .nickname {
        margin-left: $spacer;
      }
    }
  }
</style>
