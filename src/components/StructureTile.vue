<template>
  <span class="structure" :class="placement">
    <Button icon :disabled="!enabled" :onClick="() => $emit('clicked')" class="wrapper" :class="activeData.type">
      <Icon v-if="!activeData.ownerId" size="24px" color="white" name="circle" />
      <Icon v-if="!!activeData.type" size="40px" :color="activeData.color" :name="iconNames[activeData.type]" />
    </Button>
  </span>
</template>

<script>
  import Button from '@/components/Button';
  import Icon from '@/components/Icon';

  const iconNames = {
    settlement: 'home',
    city: 'city'
  };

  export default {
    name: 'StructureTile',
    components: {
      Button,
      Icon
    },
    props: {
      placement: {
        type: String,
        required: true
      },
      enabled: {
        type: Boolean,
        default: true
      },
      activeData: {
        type: Object,
        default: function() {
          return {};
        }
      }
    },
    created() {
      this.iconNames = iconNames;
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

  .wrapper {
    &.settlement {
      background: white;
    }

    &.city {
      background: orange;
    }
  }
</style>