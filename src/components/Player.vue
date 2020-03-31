<template>
  <div class="player" :style="{ color: nameColor }">
    <div class="nickname">
      {{ data.nickname }}
    </div>
    <div class="resources">
      <div v-for="resourceName in ['settlements', 'cities', 'roads', 'resourceCards']" :key="resourceName" class="resource">
        <h3 class="name">
          {{ resourceName }}:
        </h3>
        <div class="value">
          {{ data[resourceName] }}
          <!-- <Icon name="box" v-for="(resource, i) in Array(data[resourceName])" :key="i">
            <IconBox />
          </Icon> -->
        </div>
      </div>
    </div>
    <div class="ready" v-if="!isGameStarted">
      <i class="el-icon-circle-check" v-if="data.isReady" />
    </div>
  </div>
</template>

<script>
  import invert from 'invert-color';
  import Icon from '@/components/Icon';
  import IconBox from '@/components/Icons/IconBox';

  export default {
    name: 'Player',
    components: {
      Icon,
      IconBox
    },
    props: {
      data: Object,
      isGameStarted: {
        type: Boolean,
        default: false
      },
    },
    data: () => ({
      nameColor: ''
    }),
    created: function() {
      this.nameColor = invert(this.data.color);
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  .player {
    position: relative;
    padding: $spacer;

    .nickname {
      font-weight: 700;
    }

    .ready {
      position: absolute;
      top: $spacer;
      right: $spacer;
      color: white;
      background: green;
    }

    .resources {
      display: flex;
      flex-direction: column;

      .resource {
        margin-top: $spacer ;
        display: flex;

        .name {
          margin-bottom: $spacer;
        }

        .value {
          color: white;
        }
      }
    }
  }
</style>