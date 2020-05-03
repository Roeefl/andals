<template>
  <v-overlay
    absolute
    :opacity="opacity"
    :z-index="zIndex"
    :value="isOpen"
    class="base-overlay"
    :class="{ 'full-screen': isFullScreen }"
  >
    <BaseButton v-if="!!closeText" color="error" @click="$emit('close')">
      {{ closeText }}
    </BaseButton>
    <slot />
  </v-overlay>
</template>

<script>
  import BaseButton from '@/components/common/BaseButton';

  export default {
    name: 'BaseOverlay',
    components: {
      BaseButton
    },
    props: {
      isOpen: {
        type: Boolean,
        default: false
      },
      isFullScreen: {
        type: Boolean,
        default: true
      },
      zIndex: {
        type: Number,
        default: 100
      },
      opacity: {
        type: Number,
        default: 0.75
      },
      closeText: {
        type: String,
        default: null
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  .base-overlay {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    &.full-screen {      
      z-index: 1000;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100%;
    }
  }
</style>