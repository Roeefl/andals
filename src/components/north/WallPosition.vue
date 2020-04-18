<template>
  <BaseButton icon @click="$emit('clicked')">
    <BaseIcon v-if="guard.ownerId" size="24px" :color="guard.ownerColor" :name="structureIcons.guard" class="icon" />
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
    name: 'WallPosition',
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
