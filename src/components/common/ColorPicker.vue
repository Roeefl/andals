<template>
  <v-color-picker :hide-canvas="hideCanvas" v-model="color" @update:color="$emit('update', color)" />
</template>

<script>
  const defaultColor = '#409EFF';

  export default {
    name: 'ColorPicker',
    props: {
      initialColor: {
        type: String,
        default: defaultColor
      },
      hideCanvas: {
        type: Boolean,
        default: false
      }
    },
    data: function() {
      return {
        color: this.initialColor
      }
    },
    watch: {
      initialColor: function(newColor, oldColor) {
        if (newColor !== this.color) this.color = newColor; // reverted
      }
    },
  }
</script>
