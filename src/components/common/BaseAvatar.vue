<template>
  <v-avatar :size="size">
    <img
      v-if="src"
      key="avatar-image"
      :src="src"
      :alt="alt"
    >
    <BaseIcon
      v-else
      key="avatar-icon"
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
      size: {
        type: String | Number,
        default: 48
      },
      iconColor: {
        type: String,
        default: 'secondary'
      }
    } 
  }
</script>
