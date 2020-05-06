<template>
  <v-tooltip :disabled="!tooltip" :bottom="align === 'bottom'" :left="align === 'left'" :right="align === 'right'" :top="align === 'top'">
    <template v-slot:activator="{ on }">
      <span v-on="on">
        <slot />
      </span>
    </template>
    <span class="tooltip-text">
      {{ tooltip }}
    </span>
  </v-tooltip>
</template>

<script>
  const alignOptions = ['bottom', 'left', 'right', 'top'];

  export default {
    name: 'BaseTooltip',
    props: {
      align: {
        type: String,
        default: 'bottom',
        validator: value => alignOptions.includes(value)
      },
      tooltip: {
        type: String,
        default: null
      }
    }
  };
</script>


<style scoped lang="scss">
  @import '@/styles/partials';

  .tooltip-text {
    text-transform: capitalize;
  }
</style>