<template>
  <BaseOverlay :isOpen="isOpen">
    <div class="overlay-contents">
      <h1 class="overlay-header">
        {{ overlay.header }}
      </h1>
      <div v-if="overlay.tokens" class="wildling-tokens">
        <WildlingToken
          v-for="(token, t) in overlay.tokens"
          :key="`token-${t}`"
          :wildling="token.wildlingType"
          :clan="token.clanType"
          size="50px"
          class="wildling-token"
        />
      </div>
      <div v-if="overlay.dice" class="player-rolls">
        <GameDice small :dice="overlay.dice" :enabled="false" />
      </div>
      <div v-if="overlay.heroCard" class="hero-card">
        <h2>
          {{ overlay.heroCard.name }}
        </h2>
        <h3>
          {{ overlay.heroCard.title }}
        </h3>
        <h4>
          {{ overlay.heroCard.ability }}
        </h4>
      </div>
    </div>
  </BaseOverlay>
</template>

<script>
  import BaseOverlay from '@/components/common/BaseOverlay';
  import WildlingToken from '@/components/north/WildlingToken';
  import GameDice from '@/components/interface/GameDice';

  export default {
    name: 'EssentialOverlay',
    components: {
      BaseOverlay,
      WildlingToken,
      GameDice
    },
    props: {
      isOpen: {
        type: Boolean,
        default: false
      },
      overlay: {
        type: Object,
        required: true
      },
      dice: {
        type: Array,
        default: () => null
      },
    }
  }
</script>

<style scoped lang="scss">
 @import '@/styles/partials';

  .overlay-contents {
    // animation: swing-in-top-fwd 0.3s cubic-bezier(0.550, 0.055, 0.675, 0.190) both;
    // animation: swing-in-top-fwd 1.2s cubic-bezier(0.550, 0.055, 0.675, 0.190) both;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .overlay-header {
      text-transform: uppercase;
    }

    .wildling-tokens {
      width: 30%;
      display: flex;
      justify-content: space-between;

      .wildling-token {
        width: 8vw;
        height: 8vh;
      }
    }

    .player-rolls {
      display: flex;
    }

    .hero-card {
      width: 30vw;
      height: 40vh;
    }
  }
</style>
