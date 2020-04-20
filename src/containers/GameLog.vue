<template>
  <MessageList title="Game Log" :messages="gameLog" class="messages-container">
    <li v-for="(log, i) in gameLog" :key="i" class="log" :class="{ 'last-in-round': log.type === CHAT_LOG_SIMPLE && log.message && log.message.toLowerCase().includes('finish') }">
      <div v-if="log.type === CHAT_LOG_SIMPLE">
        {{ log.message }}
      </div>
      <div v-if="log.type === CHAT_LOG_DICE" class="player-rolls">
        {{ log.playerName }} rolls:
        <GameDice :small="true" :dice="log.dice" :enabled="false" />
      </div>
      <div v-if="log.type === CHAT_LOG_LOOT || log.type === CHAT_LOG_DISCARD" class="loot">
        {{ log.playerName }} {{ log.type === CHAT_LOG_LOOT ? 'collects' : 'discards' }}
        <span v-for="resource in resourceCardTypes" :key="resource" v-show="log.loot[resource]" class="resource-type">
          <ResourceCard
            v-for="(card, i) in Array(log.loot[resource]).fill(resource)"
            :key="`card-${i}`"
            small
            hideCount
            :hideIcon="!friendly"
            :resource="resource"
            class="resource"
          />
        </span>
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
    </li>
  </MessageList>
</template>

<script>
  import { mapState } from 'vuex';

  import MessageList from '@/components/common/MessageList';
  import ResourceCard from '@/components/game/ResourceCard';
  import GameDice from '@/components/interface/GameDice';
  import BaseIcon from '@/components/common/BaseIcon';
  import WildlingToken from '@/components/north/WildlingToken';
  
  import { resourceCardTypes } from '@/specs/resources';
  import { CHAT_LOG_SIMPLE, CHAT_LOG_DICE, CHAT_LOG_LOOT, CHAT_LOG_DISCARD, CHAT_LOG_WILDLING_TOKENS } from '@/constants';

  export default {
    name: 'GameLog',
    components: {
      MessageList,
      ResourceCard,
      GameDice,
      BaseIcon,
      WildlingToken
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
      this.CHAT_LOG_DICE = CHAT_LOG_DICE;
      this.CHAT_LOG_LOOT = CHAT_LOG_LOOT;
      this.CHAT_LOG_DISCARD = CHAT_LOG_DISCARD;
      this.CHAT_LOG_WILDLING_TOKENS = CHAT_LOG_WILDLING_TOKENS;
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

    .log {
      margin: $spacer / 5 0;
      padding: $spacer / 5 0;

      &.last-in-round {
        margin: $spacer / 2 0;
        padding: $spacer / 2 0;
        border-bottom: 1px solid lightgray;
      }

      .loot {
        display: flex;

        .resource-type { 
          display: flex;

          .resource {
            width: 24px;
            height: 24px;
            margin-left: $spacer / 2;
          }
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
</style>
