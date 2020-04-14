<template>
  <v-overlay
    absolute
    :opacity="0.75"
    :value="isOpen"
  >
    <BaseButton color="orange lighten-2" @click="$emit('close')">
      {{ closeText }}
    </BaseButton>
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
      closeText: {
        type: String,
        default: 'CLOSE'
      }
    }
  }
</script>
