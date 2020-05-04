<template>
  <v-progress-circular
    :size="size"
    :color="color"
    :width="radius"
    :value="Math.floor((value / (initialValue * 1000)) * 100)"
  />
</template>

<script>
  export default {
    name: 'Countdown',
    props: {
      size: {
        type: Number,
        default: 200
      },
      color: {
        type: String,
        default: 'blue darken-1'
      },
      radius: {
        type: Number,
        default: 14
      },
      initialValue: {
        type: Number,
        default: 5
      }
    },
    data: () => ({
      value: 0,
      incrementSeconds: null
    }),
    mounted() {
      this.value = this.initialValue * 1000;

      this.incrementSeconds = setInterval(
        () => {
          this.value = this.value - 100;

          if (this.value === 0)
            this.$emit('finished');
        },
        100
      );
    },
    destroyed() {
      clearInterval(this.incrementSeconds);
    },
    methods: {
      reset: function() {
        this.value = this.initialValue * 1000;
      }
    }
  }
</script>
