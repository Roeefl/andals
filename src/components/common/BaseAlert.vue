<template>
  <v-snackbar top v-model="isOpen" :color="color" :timeout="timeout">
    <span class="content">
      {{ text }}
    </span>
    <BaseButton color="transparent" small text @click="isOpen = false">
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
        required: true
      },
      color: {
        type: String,
        default: 'light-green darken-3'
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

<style scoped lang="scss">
  @import '@/styles/partials';

  .content {
    font-size: $font-size-md;
  }
</style>
