<template>
  <v-btn
    :type="type"
    :color="color"
    :small="small"
    :x-small="xs"
    :disabled="disabled"
    :rounded="rounded"
    :outlined="outlined"
    :icon="icon"
    @click="onClick"
    v-on="on"
  >
    <Icon v-if="iconName" :color="iconColor" :name="iconName" :size="iconSize" class="button-icon" />
    <slot />
  </v-btn>
</template>

<script>
  import Icon from '@/components/common/Icon';
  
  export default {
    name: 'Button',
    components: {
      Icon
    },
    props: {
      type: {
        type: String,
        default: 'button'
      },
      color: {
        type: String,
        default: 'primary'
      },
      small: {
        type: Boolean,
        default: false
      },
      xs: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      },
      rounded: {
        type: Boolean,
        default: false
      },
      outlined: {
        type: Boolean,
        default: false
      },
      icon: {
        type: Boolean,
        default: false
      },
      iconName: {
        type: String,
        default: null
      },
      iconColor: {
        type: String,
        default: 'white'
      },
      iconSize: {
        type: String,
        default: 'medium'
      },
      onClick: {
        type: Function,
        default: () => {}
      },
      on: Object
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  .button-icon {
    margin-right: $spacer / 2;
  }
</style>
