<template>
  <v-snackbar top v-model="isOpen" :timeout="timeout">
    {{ text }}
    <BaseButton color="white" text @click="isOpen = false">
      X
    </BaseButton>
  </v-snackbar>
</template>

<script>
  import BaseButton from '@/components/common/BaseButton';

  export default {
    name: 'BaseAlert',
    components: {
      BaseButton
    },
    props: {
      text: {
        type: String,
        requireD: true
      },
      timeout: {
        type: Number,
        default: 3000
      }
    },
    data: () => ({
      isOpen: true
    }),
  }
</script>
