<template>
  <BaseOverlay :isOpen="isOpen" :opacity="0.85">
    <div class="overlay-contents">
      <h1 class="overlay-header">
        {{ overlay.header }}
      </h1>
      <h2 v-if="overlay.guardsKilled">
        {{ guardsKilled }} guards were killed!
      </h2>
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
      <div v-if="overlay.guardPurchased" class="guard-purchased">
        <GameAsset type="events" asset="guard-purchased" />
      </div>
      <div v-if="overlay.guardsKilled" class="guards-killed">
        <GameAsset v-if="overlay.wildlingType" type="wildlings" :asset="overlay.wildlingType" />
        <GameAsset type="events" asset="guard-killed" />
      </div>
      <div class="game-phase">
        <GameAsset
          v-for="(gamePhase, g) in gamePhases.filter(phase => overlay[phase])"
          :key="g"
          type="phases"
          :asset="phaseToAssetName[gamePhase]"
        />
      </div>
      <div v-if="overlay.isRobber" class="robber">
        <GameAsset type="pieces" asset="robber" />
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
  import GameAsset from '@/components/game/GameAsset';
  import { gamePhases, phaseToAssetName } from '@/specs/gamePhases';

  export default {
    name: 'EssentialOverlay',
    components: {
      BaseOverlay,
      WildlingToken,
      GameAsset
    },
    props: {
      isOpen: {
        type: Boolean,
        default: false
      },
      overlay: {
        type: Object,
        required: true
      }
    },
    created() {
      this.gamePhases = gamePhases;
      this.phaseToAssetName = phaseToAssetName;
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
      width: 30vw;
      display: flex;
      justify-content: space-between;

      .wildling-token {
        width: 10vw;
        height: 10vh;
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
