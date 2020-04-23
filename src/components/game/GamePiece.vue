<template>
  <BaseButton icon>
    <BaseIcon
      :size="size"
      :color="color"
      :name="structureIcons[type]"
    />
    <BaseBadge v-if="showCount" color="black" :content="count" />
  </BaseButton>
</template>

<script>
  import { structureIcons } from '@/specs/gamePieces';

  import BaseButton from '@/components/common/BaseButton';
  import BaseIcon from '@/components/common/BaseIcon';
  import BaseBadge from '@/components/common/BaseBadge';

  export default {
    name: 'GamePiece',
    components: {
      BaseButton,
      BaseIcon,
      BaseBadge
    },
    props: {
      type: {
        type: String,
        required: true
      },
      size: {
        type: String,
        default: '24px'
      },
      color: {
        type: String,
        default: 'black'
      },
      showCount: {
        type: Boolean,
        default: false
      },
      count: {
        type: Number,
        default: 0
      }
    },
    created() {
      this.structureIcons = structureIcons;
    }
  }
</script>
