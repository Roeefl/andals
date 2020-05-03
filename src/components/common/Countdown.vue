<template>
  <v-progress-circular
    :size="size"
    :color="color"
    :width="radius"
    :value="(value / maxValue) * 100"
  />
</template>

<script>
  export default {
    name: 'Countdown',
    props: {
      size: {
        type: Number,
        default: 60
      },
      color: {
        type: String,
        default: 'success'
      },
      radius: {
        type: Number,
        default: 8
      },
      value: {
        type: Number,
        required: true
      },
      maxValue: {
        type: Number,
        default: 10
      }
    },
    data: () => ({
      incrementSeconds: null
    }),
    mounted() {
      this.incrementSeconds = setInterval(
        () => {
          this.$emit('increment');

          if (this.value === 0)
            this.$emit('end');
        },
        1000
      );
    },
    destroyed() {
      clearInterval(this.incrementSeconds);
    }
  }
</script>
