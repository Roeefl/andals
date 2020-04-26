<template>
  <BaseButton icon @click="$emit('clicked')">
    <drag :transfer-data="{ fromSection: guard.wallSection, fromPosition: guard.position }">
      <BaseIcon v-if="guard.ownerId" size="24px" :color="guard.ownerColor" :name="structureIcons.guard" class="icon" />
    </drag>
    <span v-if="!guard.ownerId" class="position-order">
      {{ order }}
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
      order: {
        type: Number,
        default: 1
      },
      guard: {
        type: Object,
        default: () => null
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
