<template>
  <span class="structure" :class="placement">
    <Button icon>
      <Icon size="24px" color="white" name="circle" />
    </Button>
  </span>
</template>

<script>
  import Button from '@/components/Button';
  import Icon from '@/components/Icon';

  export default {
    name: 'Road',
    components: {
      Button,
      Icon
    },
    props: {
      type: {
        type: String,
        default: 'settlement'
      },
      placement: {
        type: String,
        default: 'top'
      }
    } 
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  .structure {
    transform: rotate(90deg);
    position: absolute;
    z-index: 30;

    &.target {
      border: 2px dashed black;

      &:hover {
        background-color: yellow;
      }

      &::before {
        display: none;
      }
    }

    &.top {
      top: $tile-size * 0.51;
      left: $tile-size * 1.37;
    }
    
    &.top-left {
      bottom: $tile-size * 1.53;
      left: $tile-size * 0.82;
    }
  }
</style>