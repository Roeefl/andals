<template>
  <el-button
    :type="color"
    :plain="plain"
    :round="round"
    :circle="circle"
    :icon="`el-icon-${icon}`"
    @click="onClick"
  >
    <slot></slot>
  </el-button>
</template>

<script>
  const colors = ['primary', 'success', 'info', 'warning', 'danger'];

  export default {
    name: 'Button',
    props: {
      color: String,
      icon: String,
      plain: Boolean,
      round: Boolean,
      circle: Boolean,
      onClick: Function
    }
  }
</script>

<style scoped lang="scss">

</style>
