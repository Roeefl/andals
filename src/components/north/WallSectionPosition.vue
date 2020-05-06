<template>
  <BaseButton icon @click="$emit('clicked')">
    <drag v-if="guard && guard.ownerId" key="guarded-position" :transfer-data="{ fromSection: guard.section, fromPosition: position }">
      <BaseIcon v-if="guard.ownerId" size="24px" :color="guard.ownerColor" :name="structureIcons.guard" class="icon" />
    </drag>
    <span v-else key="empty-position" class="position-order">
      {{ position + 1 }}
    </span>
  </BaseButton>
</template>

<script>
  import BaseButton from '@/components/common/BaseButton';
  import BaseIcon from '@/components/common/BaseIcon';

  import { structureIcons } from '@/specs/gamePieces';

  export default {
    name: 'WallSectionPosition',
    components: {
      BaseButton,
      BaseIcon
    },
    props: {
      position: {
        type: Number,
        default: 0
      },
      guard: {
        type: Object,
        default: () => {}
      }
    },
    created() {
      this.structureIcons = structureIcons;
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  .position-order {
    color: $mountain;
  }
</style>
