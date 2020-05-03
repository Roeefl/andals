<template>
  <v-dialog :value="isOpen" width="600" @click:outside="$emit('close')">
    <ActionCard
      closeButton
      @close="$emit('close')"
      :title="card.name"
      titleColor="secondary"
      :cancel="playAllowed"
      cancelColor="warning"
      cancelText="Play and discard"
      @cancel="$emit('play-hero', true)"
      :approve="playAllowed && !card.wasPlayed"
      approveText="Play and flip for a subsequent use"
      approveColor="highlight"
      @approve="$emit('play-hero', false)"
    >
      <div v-if="!!card" class="dialog-content">
        <HeroCard :card="card" class="hero-card" />
      </div>
    </ActionCard>
  </v-dialog>
</template>

<script>
  import ActionCard from '@/components/common/ActionCard';
  import HeroCard from '@/components/game/HeroCard';

  export default {
    name: 'GameCardDialog',
    components: {
      ActionCard,
      HeroCard
    },
    props: {
      isOpen: {
        type: Boolean,
        default: false
      },
      card: {
        type: Object,
        default: () => {}
      },
      playAllowed: {
        type: Boolean,
        default: false
      }
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

    .hero-card {
      width: 320px;
      height: 560px;
    }
  }
</style>
