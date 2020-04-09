<template>
  <div class="player" :style="{ color: player.color }" :class="{ 'myself': isMe }">
    <div class="header">
      <div class="nickname">
        {{ player.nickname }}
      </div>
      <div class="status">
        <Button
          v-if="isStarted && !isMe && !waitingTrade"
          icon
          iconName="swap-vertical-circle"
          iconSize="x-large"
          @click="$emit('trade-with', player.playerSessionId)"
        />
        <Button
          v-if="allowStealing"
          icon
          iconName="hand-okay"
          iconSize="x-large"
          @click="$emit('steal-from', player.playerSessionId)"
        />
        <Badge v-if="waitingTrade" color="red" content="........" icon="head-dots-horizontal" class="waiting" />
        <Icon v-if="!isStarted" size="x-large" :color="player.isReady ? 'green' : 'red'" :name="player.isReady ? 'checkbox-marked-circle-outline' : 'do-not-disturb'" />
      </div>
    </div>
    <div class="resources">
      <div v-for="resourceName in purchaseTypes" :key="resourceName" class="resource">
        <Button icon>
          <Icon
            size="x-large"
            :color="player.color"
            :name="resourceNameToIcon[resourceName]"
          />
          <Badge color="purple" :content="resourceName === 'gameCards' ? (player[resourceName].length) : player[resourceName]" />
        </Button>
      </div>
    </div>
    <div class="resources cards" @click="$emit('deck-clicked')">
      <ResourceCard
        v-for="(resource, i) in resourceCardTypes"
        :key="i"
        :resource="resource"
        :count="isMe ? player.resourceCounts[resource] : '?'"
        class="resource-card"
      />
    </div>
  </div>
</template>

<script>
  import { resourceCardTypes, resourceNameToIcon } from '@/utils/tileManifest';
  import { pluralTypes as purchaseTypes } from '@/utils/buildingCosts';
  
  import Button from '@/components/common/Button';
  import Icon from '@/components/common/Icon';
  import ResourceCard from '@/components/game/ResourceCard';
  import Badge from '@/components/common/Badge';

  export default {
    name: 'PlayerInfo.vue',
    components: {
      Button,
      Icon,
      ResourceCard,
      Badge
    },
    props: {
      player: {
        type: Object,
        required: true
      },
      isStarted: {
        type: Boolean,
        default: false
      },
      isMe: {
        type: Boolean,
        default: false
      },
      waitingTrade: {
        type: Boolean,
        default: false
      },
      allowStealing: {
        type: Boolean,
        default: false
      }
    },
    created: function() {
      this.purchaseTypes = purchaseTypes;
      this.resourceNameToIcon = resourceNameToIcon;
      this.resourceCardTypes = resourceCardTypes;
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  @keyframes slide-in-bck-center {
    0% {
      transform: translateZ(600px);
      opacity: 0;
    }
    100% {
      transform: translateZ(0);
      opacity: 1;
    }
  }

  .player {
    position: relative;
    padding: $spacer;
    overflow-y: hidden;
    display: flex;
    flex-direction: column;

    &.myself {
      box-shadow: inset 8px 8px 40px 6px rgba(255, 0, 0, 1); 
    }

    .header {
      width: 85%;
      display: flex;
      align-items: center;
      
      .nickname {
        flex: 2;
        font-weight: 700;
      }

      .status {
        flex: 1;
        display: flex;
        justify-content: flex-end;
      }
    }

    .resources {
      display: flex;

      .resource {
        display: flex;

        .name {
          margin-bottom: $spacer;
        }
      }
    }
  }

  .resource {
    & + & {
      margin-left: $spacer * 2;
    }
  }

  .resource-card {
    &.updated {
      animation: slide-in-bck-center 1.4s cubic-bezier(0.230, 1.000, 0.320, 1.000) both;
    }

    & + & {
      margin-left: $spacer;
    }
  }
</style>