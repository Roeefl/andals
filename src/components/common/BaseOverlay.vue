<template>
  <v-overlay
    absolute
    :opacity="0.75"
    :z-index="zIndex"
    :value="isOpen"
  >
    <BaseButton v-if="!!closeText" color="orange lighten-2" @click="$emit('close')">
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
      closeText: {
        type: String,
        default: null
      }
    }
  }
</script>
