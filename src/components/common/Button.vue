<template>
  <v-btn
    :type="type"
    :color="color"
    :small="small"
    :x-small="xs"
    :x-large="xl"
    :disabled="disabled"
    :rounded="rounded"
    :outlined="outlined"
    :icon="icon"
    @click="clickable && $emit('click')"
    v-on="on"
    :class="{ 'non-clickable': !clickable }"
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
      xl: {
        type: Boolean,
        default: false
      },
      clickable: {
        type: Boolean,
        default: true
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
      on: Object
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  .button-icon {
    margin-right: $spacer / 2;
  }

  .non-clickable {
    opacity: 0.5;
    cursor: auto;
  }
</style>
