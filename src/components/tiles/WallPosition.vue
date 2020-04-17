<template>
  <BaseButton
    @click="enabled && $emit('clicked')"
    class="wall-position"
    :class="{ 'disabled': !enabled }"
  >
    <BaseIcon v-if="guard" size="24px" color="white" :name="structureIcons.guard" class="icon" />
    <span v-if="!guard" class="position-order">
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
      enabled: {
        type: Boolean,
        default: true
      },
      myColor: {
        type: String,
        default: 'red'
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
    border-radius: 999px;
    border: 1px solid black;
  }
</style>
