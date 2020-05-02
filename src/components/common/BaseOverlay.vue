<template>
  <v-overlay
    absolute
    :opacity="opacity"
    :z-index="zIndex"
    :value="isOpen"
    class="base-overlay"
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
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
</style>