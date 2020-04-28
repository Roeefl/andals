<template>
  <v-avatar>
    <img
      v-if="src"
      :src="src"
      :alt="alt"
    >
    <BaseIcon
      v-else
      name="account-circle"
      size="36px"
      :color="iconColor"
    />
  </v-avatar>
</template>

<script>
  import BaseIcon from '@/components/common/BaseIcon';

  export default {
    name: 'BaseAvatar',
    components: {
      BaseIcon
    },
    props: {
      src: {
        type: String,
        default: null
      },
      alt: {
        type: String,
        default: 'Avatar'
      },
      iconColor: {
        type: String,
        default: 'secondary'
      }
    } 
  }
</script>
