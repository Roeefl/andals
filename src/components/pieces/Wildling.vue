<template>
  <transition name="puff">
    <BaseButton
      icon
      :width="size"
      :height="size"
      iconSize="large"
      :iconName="wildlingIcons[type]"
      :iconColor="wildlingColors[type]"
      :clickable="false"
      class="wildling"
    />
  </transition>
</template>

<script>
  import BaseButton from '@/components/common/BaseButton';
  import BaseIcon from '@/components/common/BaseIcon';

  import { wildlingIcons, wildlingColors } from '@/specs/wildlings';

  export default {
    name: 'Wildling',
    components: {
      BaseButton,
      BaseIcon
    },
    props: {
      type: {
        type: String,
        required: true
      },
      size: {
        type: String,
        default: '40px'
      }
    },
    created() {
      this.wildlingIcons = wildlingIcons;
      this.wildlingColors = wildlingColors;
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  @keyframes puff-out-center {
    0% {
      transform: scale(1);
      filter: blur(0px);
      opacity: 1;
    }
    100% {
      transform: scale(2);
      filter: blur(4px);
      opacity: 0;
    }
  }

  .puff-leave-active {
    animation: puff-out-center 2s cubic-bezier(0.190, 1.000, 0.220, 1.000) both;
  }
</style>