<template>
  <div class="the-wall">
    <WallSection
      v-for="(wallSection, w) in wallSections"
      :key="renderKey(wallSection, w)"
      :section="w"
      :guards="wallSection"
      :myColor="myColor"
      :allowPurchase="allowPurchase"
      :allowRemove="allowRemove"
      @wall-clicked="$emit('wall-clicked', { section: w, position: $event })"
      @kill-guard="$emit('kill-guard', { section: w, position: $event })"
      @relocate-guard="$emit('relocate-guard', { ...$event, toSection: w })"
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
    computed: {
      wallSections: function() {
        return wallTiles.map(sectionStart => this.wall.slice(sectionStart, sectionStart + 5));
      }
    },
    created() {
      this.wallTiles = wallTiles;
    },
    methods: {
      renderKey(wallSection, sectionIndex) {
        const allOwnerIds = wallSection
          .map(guard => (guard || {}).ownerId)
          .join('-');

        return `wall-${sectionIndex}-${allOwnerIds}`;
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  .the-wall {
    @include dashed-around();
    display: grid;
    grid-template-columns: repeat(4, 25%);
  }
</style>
