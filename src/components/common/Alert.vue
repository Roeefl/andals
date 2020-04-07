<template>
  <v-snackbar top v-model="isOpen" :timeout="timeout">
    {{ text }}
    <Button color="white" text @click="isOpen = false">
      X
    </Button>
  </v-snackbar>
</template>

<script>
  import Button from '@/components/common/Button';

  export default {
    name: 'Alert',
    components: {
      Button
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
