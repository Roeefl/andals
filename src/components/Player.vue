<template>
  <div class="player" :style="{ color: nameColor }">
    <div class="nickname">
      {{ data.nickname }}
    </div>
    <div class="resources">
      <div v-for="resourceName in ['settlements', 'cities', 'roads', 'gameCards']" :key="resourceName" class="resource">
        <Button icon>
          <Icon
            size="x-large"
            :color="nameColor"
            :name="resourceNameToIcon[resourceName]"
          />
          <Badge color="purple" :content="resourceName === 'gameCards' ? (data[resourceName].length || '0') : data[resourceName]" />
        </Button>
      </div>
    </div>
    <div class="resources cards">
      <Button icon v-for="(resource, i) in resourceCardTypes" :key="i" class="resource-card">
        <Icon
          size="x-large"
          :color="resourceCardColors[resource]"
          :name="resouceCardNameToIcon[resource]"
        />
        <Badge :color="resourceCardColors[resource]" content="0" />
        <!-- resourceCardsCounts[resource] -->
      </Button>
    </div>
    <div class="ready" v-if="!isStarted">
      <Icon color="green" name="checkbox-marked-circle-outline" v-if="data.isReady" />
    </div>
  </div>
</template>

<script>
  import invert from 'invert-color';
  import Button from '@/components/Button';
  import Icon from '@/components/Icon';
  import Badge from '@/components/Badge';
  import { resourceCardTypes, resourceNameToIcon, resouceCardNameToIcon, resourceCardColors } from '@/utils/tileManifest';
  import { PLAYER_BG } from '@/utils/colors';

  export default {
    name: 'Player',
    components: {
      Button,
      Icon,
      Badge
    },
    props: {
      data: Object,
      isStarted: {
        type: Boolean,
        default: false
      },
    },
    data: () => ({
      nameColor: '',
      resourceCardsCounts: {}
    }),
    computed: {
      resourceNameToIcon: () => resourceNameToIcon,
      resourceCardTypes: () => resourceCardTypes,
      resourceCardColors: () => resourceCardColors,
      resouceCardNameToIcon: () => resouceCardNameToIcon
    },
    created: function() {
      this.nameColor = invert(PLAYER_BG);

      this.resourceCardsCounts = this.data.resourceCards
        .reduce((acc, { type }) => {
          if (!acc[type]) acc[type] = 0;
          acc[type]++
          return acc;
        }, {});
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