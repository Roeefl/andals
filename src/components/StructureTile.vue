<template>
  <span class="structure" :class="[placement, { 'enabled': enabled }]" :style="hoverStyle">
    <Button icon :onClick="() => enabled && $emit('clicked')" class="wrapper" :class="[activeData.type, { 'disabled': !enabled }]">
      <Icon v-if="!activeData.ownerId" size="24px" color="white" name="circle-outline" class="icon" />
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
      myColor: {
        type: String,
        default: 'white'
      },
      activeData: {
        type: Object,
        default: function() {
          return {};
        }
      }
    },
    computed: {
      hoverStyle: function() {
        return {
          '--color-hover': this.myColor
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

    &.top {
      top: $tile-size * 0.51;
      left: $tile-size * 1.37;
    }
    
    &.top-left {
      bottom: $tile-size * 1.53;
      left: $tile-size * 0.82;
    }

    &.enabled {
      border-radius: 999px;
      border: 1px dashed black;

      &:hover {
        background: var(--color-hover);
      }
    }
  }

  .wrapper {
    &.settlement {
      background: white;
    }

    &.city {
      background: orange;
    }

    &.disabled {
      cursor: initial;

      .icon {
        opacity: 0.2;
      }
    }
  }
</style>
