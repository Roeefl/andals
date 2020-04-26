<template>
  <BaseButton
    icon
    :width="`${size}px`"
    :height="`${size}px`"
    :iconSize="`${size}px`"
    :iconName="wildlingIcons[type]"
    :iconColor="wildlingColors[type]"
    @click="$emit('remove')"
    class="wildling"
  />
</template>

<script>
  import BaseButton from '@/components/common/BaseButton';
  import { wildlingIcons, wildlingColors } from '@/specs/wildlings';

  export default {
    name: 'Wildling',
    components: {
      BaseButton
    },
    props: {
      type: {
        type: String,
        required: true
      },
      size: {
        type: Number,
        default: '40'
      }
    },
    created() {
      this.wildlingIcons = wildlingIcons;
      this.wildlingColors = wildlingColors;
    }
  }
</script>
