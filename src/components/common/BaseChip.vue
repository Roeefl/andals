<template>
  <v-chip
    :close="closeable"
    :color="color"
    :text-color="textColor"
    @click:close="closeable && close"
    @click="$emit('click')"
    :outlined="outlined"
    :disabled="disabled"
    :label="labeled"
    class="base-chip"
  >
    <v-avatar left>
      <BaseIcon
        v-if="iconName"
        :name="iconName"
        :size="iconSize"
        :color="iconColor"
      />
    </v-avatar>
    {{ label }}
  </v-chip>
</template>

<script>
  import BaseIcon from '@/components/common/BaseIcon';

  export default {
    name: 'BaseChip',
    components: {
      BaseIcon
    },
    props: {
      closeable: {
        type: Boolean,
        default: false
      },
      outlined: {
        type: Boolean,
        default: false
      },
      labeled: {
        type: Boolean,
        default: false
      },
      color: {
        type: String,
        default: 'secondary'
      },
      textColor: {
        type: String,
        default: 'primary'
      },
      iconName: {
        type: String,
        default: null
      },
      iconColor: {
        type: String,
        default: 'primary'
      },
      iconSize: {
        type: String,
        default: '24px'
      },
      label: {
        type: String,
        default: ''
      },
      disabled: {
        type: Boolean,
        default: false
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  .base-chip {
    margin: 0;
  }
</style>
