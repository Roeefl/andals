<template>
  <MessageList title="Game Log" :messages="gameLog" class="messages-container">
    <transition-group name="gamelogs" tag="span">
      <li v-for="(log, i) in gameLog" :key="i" class="log" :class="{ 'last-in-round': log.type === CHAT_LOG_SIMPLE && log.message && log.message.toLowerCase().includes('finish') }">
        <div v-if="log.type === CHAT_LOG_SIMPLE">
          {{ log.message }}
        </div>
        <div v-if="[CHAT_LOG_PURCHASE, CHAT_LOG_TURN_ORDER].includes(log.type)">
          <span v-if="log.playerName" :style="{ color: log.playerColor }" class="player-name">
            {{ log.playerName }}
          </span>
          <span>
            {{ log.message }}
          </span>
        </div>
        <div v-if="log.type === CHAT_LOG_DICE" class="player-rolls">
          <span :style="{ color: log.playerColor }" class="player-name">
            {{ log.playerName }}
          </span> rolls:
          <GameDice :dice="log.dice" size="28px" />
        </div>
        <div v-if="[CHAT_LOG_DISCARD, CHAT_LOG_LOOT].includes(log.type)" class="loot">
          <span :style="{ color: log.playerColor }" class="player-name">
            {{ log.playerName }}
          </span>
          {{ log.type === CHAT_LOG_LOOT ? 'collects' : 'discards' }}
          <fragment v-for="resource in resourceCardTypes" :key="resource" v-show="log.loot[resource]">
            <ResourceCard
              v-for="(card, i) in Array(log.loot[resource] || 0).fill(resource)"
              :key="`card-${i}`"
              small
              hideCount
              :hideIcon="!friendly"
              :resource="resource"
              class="resource"
            />
          </fragment>
        </div>
        <div v-if="log.type === CHAT_LOG_WILDLING_TOKENS" class="wildling-tokens">
          Wildling Tokens revealed:
          <WildlingToken
            v-for="(token, t) in log.tokens"
            :key="`token-${t}`"
            :wildling="token.wildlingType"
            :clan="token.clanType"
            class="wildling-token"
          />
        </div>
        <div v-if="[CHAT_LOG_HERO_CARD, CHAT_LOG_GAME_CARD].includes(log.type)" class="played-card">
          <span class="card">
            <span :style="{ color: log.playerColor }" class="player-name">
              {{ log.playerName }}
            </span>
            has {{ log.action }}
            <span v-if="log.heroCardType">
              <GameAsset type="abilities" :asset="log.heroCardType" width="32px" height="32px" />
            </span>
            <span class="card-name">
              {{ log.type === CHAT_LOG_HERO_CARD ? log.heroCard.name : log.cardType }}
            </span>
          </span>
        </div>
      </li>
    </transition-group>
  </MessageList>
</template>

<script>
  import { mapState } from 'vuex';

  import MessageList from '@/components/common/MessageList';
  import ResourceCard from '@/components/game/ResourceCard';
  import GameDice from '@/components/interface/GameDice';
  import BaseIcon from '@/components/common/BaseIcon';
  import WildlingToken from '@/components/north/WildlingToken';
  import HeroCard from '@/components/game/HeroCard';
  import GameAsset from '@/components/game/GameAsset';
  
  import { resourceCardTypes } from '@/specs/resources';
  import {
    CHAT_LOG_SIMPLE,
    CHAT_LOG_TURN_ORDER,
    CHAT_LOG_PURCHASE,
    CHAT_LOG_DICE,
    CHAT_LOG_LOOT,
    CHAT_LOG_DISCARD,
    CHAT_LOG_WILDLING_TOKENS,
    CHAT_LOG_HERO_CARD,
    CHAT_LOG_GAME_CARD
    } from '@/constants';

  export default {
    name: 'GameLog',
    components: {
      MessageList,
      ResourceCard,
      GameDice,
      BaseIcon,
      WildlingToken,
      HeroCard,
      GameAsset
    },
    props: {
      friendly: {
        type: Boolean,
        default: false
      }
    },
    computed: mapState([
      'gameLog'
    ]),
    created() {
      this.resourceCardTypes = resourceCardTypes;
      this.CHAT_LOG_SIMPLE = CHAT_LOG_SIMPLE;
      this.CHAT_LOG_PURCHASE = CHAT_LOG_PURCHASE;
      this.CHAT_LOG_TURN_ORDER = CHAT_LOG_TURN_ORDER;
      this.CHAT_LOG_DICE = CHAT_LOG_DICE;
      this.CHAT_LOG_LOOT = CHAT_LOG_LOOT;
      this.CHAT_LOG_DISCARD = CHAT_LOG_DISCARD;
      this.CHAT_LOG_WILDLING_TOKENS = CHAT_LOG_WILDLING_TOKENS;
      this.CHAT_LOG_HERO_CARD = CHAT_LOG_HERO_CARD;
      this.CHAT_LOG_GAME_CARD = CHAT_LOG_GAME_CARD;
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';
  
  .messages-container {
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: $spacer / 2;
    font-size: $font-size-md;
    max-width: 99%;

    .gamelogs-enter-active, .gamelogs-leave-active {
      transition: opacity 4s, background 10s ease-in, transform 3s;
    }
    .gamelogs-enter, .gamelogs-leave-to {
      opacity: 0.5;
      background: $highlight;
      transform: translateX($spacer * -3);
    }

    .log {
      max-width: 95%;
      margin: $spacer / 5 0;
      padding: $spacer / 5 0;

      &.last-in-round {
        margin: $spacer / 2 0;
        padding: $spacer / 2 0;
        border-bottom: 1px solid lightgray;
      }

      .player-name {
        margin-right: $spacer / 3;
      }

      .loot {
        display: flex;
        flex-flow: row wrap;

        .resource {
          width: 24px;
          height: 24px;
          margin-left: $spacer / 2;
        }
      }
    }

    .player-rolls {
      display: flex;
    }

    .wildling-tokens {
      display: flex;
    }
  }

  .wildling-token {
    width: 30px;
    height: 30px;
    
    & + & {
      margin-left: $spacer / 2;
    }
  }

  .played-card {
    display: flex;

    .card {
      background: $error;
    }
  }
</style>
