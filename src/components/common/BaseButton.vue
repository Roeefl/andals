<template>
  <v-btn
    :type="type"
    :color="color"
    :width="width"
    :height="height"
    :x-small="xs"
    :small="small"
    :large="large"
    :x-large="xl"
    :disabled="disabled"
    :rounded="rounded"
    :outlined="outlined"
    :icon="icon"
    @click="clickable && $emit('click')"
    :ripple="clickable"
    v-on="on"
    :class="{ 'non-clickable': !clickable }"
  >
    <BaseIcon v-if="iconName" :color="iconColor" :name="iconName" :size="iconSize" class="base-button-icon" />
    <slot />
  </v-btn>
</template>

<script>
  import BaseIcon from '@/components/common/BaseIcon';
  
  export default {
    name: 'BaseButton',
    components: {
      BaseIcon
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
      width: {
        type: String,
        default: undefined
      },
      height: {
        type: String,
        default: undefined
      },
      xs: {
        type: Boolean,
        default: false
      },
      small: {
        type: Boolean,
        default: false
      },
      large: {
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

<style lang="scss">
  @import '@/styles/partials';

  // --- <General Button Styling> ---
  #app {
    .theme--dark {
      &.v-btn {
        &.primary {
          color: $secondary;
        }
      }
    }
  }
  // --- </General Button Styling> ---

  .base-button-icon {
    margin-right: $spacer;
  }

  .non-clickable {
    opacity: 0.5;
    cursor: auto;
  }
</style>
