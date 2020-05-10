<template>
  <v-dialog
    :value="isOpen"
    persistent
    width="75vw"
  >
    <ActionCard
      title="Select your next Hero Card"
      :cancel="false"
      :approve="false"
    >
      <!-- <BaseButton icon iconName="arrow-left-box" iconColor="primary" iconSize="60px" @click="swipeLeft" class="arrow arrow-left" /> -->
      <ul class="hero-cards">
        <BaseButton v-for="(card, c) in deck" :key="`wrapper-${c}-${card.type}`" icon @click="$emit('selected', deck[c])" class="hero-card-wrapper">
          <HeroCard
            :card="card"
            class="hero-card"
          />
        </BaseButton>
      </ul>
      <!-- <BaseButton icon iconName="arrow-right-box" iconColor="primary" iconSize="60px" @click="swipeRight" class="arrow arrow-right" /> -->
    </ActionCard>
  </v-dialog>
</template>

<script>
  import ActionCard from '@/components/common/ActionCard';
  import HeroCard from '@/components/game/HeroCard';
  import BaseButton from '@/components/common/BaseButton';

  export default {
    name: 'CardSwapper',
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
        const lastCard = this.deck.pop();
        this.deck.unshift(lastCard);
      },
      swipeRight: function() {
        const firstCard = this.deck.shift();
        this.deck.push(firstCard);
      },
      swipeTo: function(index) {
        if (index <= 0) return;

        for (let s = 0; s < index; s++) {
          this.swipeRight();
        } 
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  // @TODO: should be this.cards.length;
  $cards-count: 16;
  $first-card-left: 5%;
  $card-distance: 80px;
  $zindex-first-card: 100;

  $hero-card-width: 200px;
  $hero-card-height: 440px;

  @mixin cards($start) {
    @for $c from 0 to ($cards-count / 2) {
      &:nth-child(#{$c + 1}) {
        left: calc(#{$start} + #{$card-distance * $c});
        transform: translate(#{(($cards-count / 2) - $c) * 0.25}rem, #{$c * -1.5}rem) rotate(-#{(60 / $cards-count) * (($cards-count / 2) - $c)}deg);
        z-index: $zindex-first-card + $c;
      }
    }

    @for $c from ($cards-count / 2) to $cards-count {
      &:nth-child(#{$c + 1}) {
        left: calc(#{$start} + #{$card-distance * $c});
        transform: translate(#{$c * 0.25}rem, #{($cards-count - $c) * -1.5}rem) rotate(#{(60 / $cards-count) * ($c + 1 - ($cards-count / 2))}deg);
        z-index: $zindex-first-card + $c;
      }
    }
  }

  .hero-cards {
    position: relative;
    height: 600px;

    .hero-card-wrapper {
      position: absolute;
      bottom: 70%;
      @include cards($first-card-left);
      opacity: 0.9;

      .hero-card {
        width: $hero-card-width;
        height: $hero-card-height;
        font-size: $font-size-xs;
      }

      &:hover {
        z-index: $zindex-first-card + 100;
        opacity: 1;
        bottom: 75%;

        .hero-card {
          width: $hero-card-width * 1.3;
          height: $hero-card-height * 1.3;
        }
      }
    }
  }

  .arrow {
    position: absolute;
    top: 45%;
    z-index: $zindex-navigation;

    &.arrow-right {
      right: 0;
    }

    &.arrow-left {
      left: 0;
    }
  }
</style>
