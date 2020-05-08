<template>
  <div class="the-wall">
    <WallSection
      v-for="(wallSection, w) in wallSections"
      :key="renderKey(wallSection, w)"
      :guards="wallSection"
      :myColor="myColor"
      :allowPurchasing="allowPurchasing"
      :allowRemove="allowRemove"
      @wall-clicked="$emit('wall-clicked', { section: w, position: $event })"
      @kill-guard="$emit('kill-guard', { section: w, position: $event })"
      @relocate-guard="$emit('relocate-guard', { ...$event, toSection: w })"
    />
  </div>
</template>

<script>
  import WallSection from '@/components/north/WallSection';
  import { wallSectionsCount } from '@/specs/wall';

  export default {
    name: 'Wall',
    components: {
      WallSection
    },
    props: {
      guards: {
        type: Array,
        default: () => []
      },
      myColor: {
        type: String,
        default: 'red'
      },
      allowPurchasing: {
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
        return Array(wallSectionsCount).fill(0)
          .map((x, sectionIndex) => this.guards.filter(guard => guard.section === sectionIndex));
      }
    },
    methods: {
      renderKey(wallSection, sectionIndex) {
        const allOwnerIds = wallSection
          .map(guard => guard.ownerId)
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
