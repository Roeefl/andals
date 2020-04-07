<template>
  <div class="player" :style="{ color: player.color }" :class="{ 'myself': isMe }">
    <div class="header">
      <div class="nickname">
        {{ player.nickname }}
      </div>
      <Button v-if="isStarted && !isMe" icon iconName="swap-vertical-circle" iconSize="x-large" @click="$emit('trade-with', player.playerSessionId)" />
      <Icon v-if="!isStarted" size="x-large" :color="player.isReady ? 'green' : 'red'" :name="player.isReady ? 'checkbox-marked-circle-outline' : 'do-not-disturb'" />
    </div>
    <div class="resources">
      <div v-for="resourceName in purchaseTypes" :key="resourceName" class="resource">
        <Button icon>
          <Icon
            size="x-large"
            :color="player.color"
            :name="resourceNameToIcon[resourceName]"
          />
          <NumberBadge color="purple" :content="resourceName === 'gameCards' ? (player[resourceName].length) : player[resourceName]" />
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
  import NumberBadge from '@/components/common/NumberBadge';

  export default {
    name: 'PlayerInfo.vue',
    components: {
      Button,
      Icon,
      ResourceCard,
      NumberBadge
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
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .nickname {
        font-weight: 700;
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