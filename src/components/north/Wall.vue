<template>
  <div class="the-wall">
    <WallSection
      v-for="(sectionStart, w) in wallTiles"
      :key="`wall-${w}`"
      :section="w"
      :myColor="myColor"
      :allowPurchase="allowPurchase"
      :allowRemove="allowRemove"
      :guards="wall.slice(sectionStart, sectionStart + 5)"
      @wall-clicked="$emit('wall-clicked', { section: w, position: $event })"
      @kill-guard="$emit('kill-guard', { section: w, position: $event })"
    />
  </div>
</template>

<script>
  import WallSection from '@/components/north/WallSection';

  const wallTiles = [0, 5, 10, 15];

  export default {
    name: 'Wall',
    components: {
      WallSection
    },
    props: {
      wall: {
        type: Array,
        default: () => Array(20).fill({})
      },
      myColor: {
        type: String,
        default: 'red'
      },
      allowPurchase: {
        type: Boolean,
        default: false
      },
      allowRemove: {
        type: Boolean,
        default: false   
      }
    },
    created() {
      this.wallTiles = wallTiles;
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  .the-wall {
    border: 1px dashed black;
    display: grid;
    grid-template-columns: repeat(4, 25%);
  }
</style>
