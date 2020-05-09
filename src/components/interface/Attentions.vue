<template>
  <BaseOverlay :isOpen="isOpen" :opacity="0.85">
    <div class="attention-contents">
      <h1 class="attention-header">
        {{ attentions.header }}
      </h1>
      <h2 v-if="attentions.guardsKilled">
        {{ attentions.guardsKilled }} guards were killed!
      </h2>
      <div v-if="attentions.guardPurchased" class="guard-purchased">
        <GameAsset type="events" asset="guard-purchased" />
      </div>
      <div v-if="attentions.guardsKilled" class="guards-killed">
        <GameAsset v-if="attentions.wildlingType" type="wildlings" :asset="attentions.wildlingType" />
        <GameAsset type="events" asset="guard-killed" />
      </div>
      <div class="game-phase">
        <GameAsset
          v-for="(gameNotification, g) in gameNotifications.filter(phase => attentions[phase])"
          :key="g"
          type="phases"
          :asset="notificationToAsset[gameNotification]"
        />
      </div>
      <h2 v-if="attentions.subHeader">
        {{ attentions.subHeader }}
      </h2>
      <div v-if="attentions.tokens" class="wildling-tokens">
        <WildlingToken
          v-for="(token, t) in attentions.tokens"
          :key="`token-${t}`"
          :wildling="token.wildlingType"
          :clan="token.clanType"
          size="50px"
          class="wildling-token"
        />
      </div>
      <div v-if="attentions.isRobber" class="robber">
        <GameAsset type="pieces" asset="robber" color="red" />
      </div>
      <div v-if="attentions.heroCardType" class="hero-card">
        <div class="ability-icon">
          <GameAsset type="abilities" :asset="attentions.heroCardType" />
        </div>
        <div class="hero-details">
          <h2>
            {{ attentions.heroCard.name }}
          </h2>
          <h4>
            {{ attentions.heroCard.ability }}
          </h4>
        </div>
      </div>
      <div v-if="attentions.gameCardType" class="game-card">
        <h2>
          {{ attentions.gameCardType }}
        </h2>
      </div>
    </div>
  </BaseOverlay>
</template>

<script>
  import { mapState } from 'vuex';

  import BaseOverlay from '@/components/common/BaseOverlay';
  import WildlingToken from '@/components/north/WildlingToken';
  import GameAsset from '@/components/game/GameAsset';
  import ResourceCard from '@/components/game/ResourceCard';

  import { gameNotifications, notificationToAsset } from '@/specs/gamePhases';

  export default {
    name: 'Attentions',
    components: {
      BaseOverlay,
      WildlingToken,
      GameAsset,
      ResourceCard
    },
    props: {
      isOpen: {
        type: Boolean,
        default: false
      },
      attentions: {
        type: Object,
        required: true
      }
    },
    computed: mapState([
      'recentLoot'
    ]),
    created() {
      this.gameNotifications = gameNotifications;
      this.notificationToAsset = notificationToAsset;
    }
  }
</script>

<style scoped lang="scss">
 @import '@/styles/partials';

  .attention-contents {
    // animation: swing-in-top-fwd 0.3s cubic-bezier(0.550, 0.055, 0.675, 0.190) both;
    // animation: swing-in-top-fwd 1.2s cubic-bezier(0.550, 0.055, 0.675, 0.190) both;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .attention-header {
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
      display: flex;

      .hero-details {
        display: flex;
        flex-direction: column;
      }
    }
  }
</style>
