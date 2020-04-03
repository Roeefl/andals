<template>
  <div class="player" :style="{ color: nameColor }">
    <div class="nickname">
      {{ player.nickname }}
    </div>
    <div class="resources">
      <div v-for="resourceName in ['settlements', 'cities', 'roads', 'gameCards']" :key="resourceName" class="resource">
        <Button icon>
          <Icon
            size="x-large"
            :color="nameColor"
            :name="resourceNameToIcon[resourceName]"
          />
          <NumberBadge color="purple" :content="resourceName === 'gameCards' ? (player[resourceName].length || '0') : player[resourceName]" />
        </Button>
      </div>
    </div>
    <div class="resources cards">
      <ResourceCard v-for="(resource, i) in resourceCardTypes" :key="i" :resource="resource" :count="resourceCounts[resource] || '0'" class="resource-card" />
    </div>
    <div class="ready" v-if="!isStarted">
      <Icon color="green" name="checkbox-marked-circle-outline" v-if="player.isReady" />
    </div>
  </div>
</template>

<script>
  import invert from 'invert-color';
  
  import { resourceCardTypes, resourceNameToIcon } from '@/utils/tileManifest';
  import { PLAYER_BG } from '@/utils/colors';
  
  import Button from '@/components/Button';
  import Icon from '@/components/Icon';
  import ResourceCard from '@/components/ResourceCard';
  import NumberBadge from '@/components/NumberBadge';

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
      resourceCounts: {
        type: Object,
        default: function() {
          return {};
        }
      },
      isStarted: {
        type: Boolean,
        default: false
      },
    },
    data: () => ({
      nameColor: ''
    }),
    created: function() {
      this.nameColor = invert(PLAYER_BG);
      this.resourceNameToIcon = resourceNameToIcon;
      this.resourceCardTypes = resourceCardTypes;
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  .player {
    position: relative;
    padding: $spacer;
    overflow-y: hidden;

    .nickname {
      font-weight: 700;
    }

    .ready {
      position: absolute;
      top: $spacer;
      right: $spacer;
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
    & + & {
      margin-left: $spacer;
    }
  }
</style>