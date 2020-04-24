<template>
  <v-dialog
    :value="isOpen"
    persistent
    width="800"
  >
    <ActionCard
      title="Select your next Hero Card"
      :cancel="false"
      @approve="$emit('selected', deck[0])"
    >
      <BaseButton icon iconName="arrow-left-box" iconColor="black" @click="swipeLeft" class="arrow arrow-left" />
      <ul class="hero-cards">
        <li v-for="(card, c) in deck" :key="`wrapper-${c}-${card.type}`" class="hero-card-wrapper">
          <HeroCard
            :card="card"
            class="hero-card"
          />
        </li>
      </ul>
      <BaseButton icon iconName="arrow-right-box" iconColor="black" @click="swipeRight" class="arrow arrow-right" />
    </ActionCard>
  </v-dialog>
</template>

<script>
  import ActionCard from '@/components/common/ActionCard';
  import HeroCard from '@/components/game/HeroCard';
  import BaseButton from '@/components/common/BaseButton';

  export default {
    name: 'HeroCardSwapper',
    components: {
      ActionCard,
      HeroCard,
      BaseButton
    },
    props: {
      isOpen: {
        type: Boolean,
        default: false
      },
      cards: {
        type: Array,
        default: () => []
      }
    },
    data: () => ({
      deck: []
    }),
    created() {
      this.deck = this.cards;
    },
    methods: {
      swipeLeft: function() {
        const firstCard = this.deck.shift();
        this.deck.push(firstCard);
      },
      swipeRight: function() {
        const lastCard = this.deck.pop();
        this.deck.unshift(lastCard);
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  // @TODO: should be this.cards.length;
  $cards-count: 3;
  $first-card-left: 20%;
  $card-distance: 80px;
  $zindex-first-card: 100;

  @mixin cards($start) {
    @for $c from 0 to $cards-count {
      &:nth-child(#{$c + 1}) {
        left: calc(#{$start} + #{$card-distance * $c});
        transform: translate(-#{$c * 0}rem, #{$c * 0}rem) rotate(#{(60 / $cards-count) * $c}deg);
        z-index: $zindex-first-card - $c;
      }
    }
  }

  .hero-cards {
    position: relative;
    height: 500px;

    .hero-card-wrapper {
      position: absolute;
      top: $spacer * 2;
      @include cards($first-card-left);
      animation: slide-in-bck-center 1.4s cubic-bezier(0.230, 1.000, 0.320, 1.000) both;

      .hero-card {
        width: 280px;
        height: 420px;
      }
    }
  }

  .arrow {
    position: absolute;
    top: 45%;
    z-index: 1000;

    &.arrow-right {
      right: 0;
    }

    &.arrow-left {
      left: 0;
    }
  }
</style>
