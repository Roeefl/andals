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
    <BaseBadge v-if="!!activePurchase" color="primary">
      <PurchaseConfirm
        :type="activePurchase.type"
        :removing="activePurchase.isRemove"
        :header="activePurchase.isRemove ? 'Remove' : undefined"
        :isFree="isSetupPhase"
        :myPlayer="myPlayer"
        :isFlexible="myPlayer.flexiblePurchase === activePurchase.type"
        @no="$emit('cancel-purchase')"
        @yes="$emit('confirm-purchase', $event)"
      />
    </BaseBadge>
  </div>
</template>

<script>
  import WallSection from '@/components/north/WallSection';
  import BaseBadge from '@/components/common/BaseBadge';
  import PurchaseConfirm from '@/components/interface/PurchaseConfirm';

  import { wallSectionsCount } from '@/specs/wall';

  export default {
    name: 'Wall',
    components: {
      WallSection,
      BaseBadge,
      PurchaseConfirm
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
      },
      activePurchase: {
        type: Object,
        default: () => null
      },
      myPlayer: {
        type: Object,
        default: () => {}
      },
      isSetupPhase: {
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
