<template>
  <transition name="puff">
    <v-card max-width="300" class="resource-card" @click="!disabled && $emit('clicked')">
      <Button icon :xs="small">
        <Icon
          :size="small ? 'medium' : 'x-large'"
          :name="hideIcon ? 'help-box' : resourceCardNameToIcon[resource]"
          :color="hideIcon? 'black' : resourceCardColors[resource]"
        />
        <Badge v-if="!hideCount" :color="resourceCardColors[resource]" :content="count === 0 ? '0' : count" />
        <Icon v-if="selected" name="check-outline" size="x-large" color="green" class="selected" />
      </Button>
      <Button icon v-if="collectable" class="collect">
        <Icon size="x-large" name="sack" color="red" />
      </Button>
    </v-card>
  </transition>
</template>

<script>
  import { resourceCardNameToIcon, resourceCardColors } from '@/utils/tileManifest';

  import Button from '@/components/common/Button';
  import Icon from '@/components/common/Icon';
  import Badge from '@/components/common/Badge';

  export default {
    name: 'ResourceCard',
    components: {
      Button,
      Icon,
      Badge
    },
    props: {
      resource: {
        type: String,
        required: true
      },
      count: {
        type: [Number, String],
        default: 0
      },
      collectable: {
        type: Boolean,
        default: false
      },
      hideCount: {
        type: Boolean,
        default: false
      },
      hideIcon: {
        type: Boolean,
        default: false
      },
      small: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      },
      selected: {
        type: Boolean,
        default: false
      }
    },
    created: function() {
      this.resourceCardNameToIcon = resourceCardNameToIcon;
      this.resourceCardColors = resourceCardColors;
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  @keyframes puff-out-center {
    0% {
      transform: scale(1);
      filter: blur(0px);
      opacity: 1;
    }
    100% {
      transform: scale(2);
      filter: blur(4px);
      opacity: 0;
    }
  }

  .puff-leave-active {
    animation: puff-out-center 2s cubic-bezier(0.190, 1.000, 0.220, 1.000) both;
  }
  
  .resource-card {
    height: 50px;
    padding: 0 $spacer / 4;
    position: relative;
  }
  
  .collect {
    position: absolute;
    bottom: -1.2 * $spacer;
    left: 0;
  }

  .selected {
    position: absolute;
    top: 0;
    right: -$spacer;
  }
</style>