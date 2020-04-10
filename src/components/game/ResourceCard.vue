<template>
  <transition name="puff">
    <v-card max-width="300" @click="clickable && $emit('clicked')" class="resource-card" :class="{ 'clickable': clickable }">
      <BaseButton
        icon
        :xs="small"
        :iconSize="small ? 'medium' : 'x-large'"
        :iconName="hideIcon ? 'help-box' : resourceCardIcons[resource]"
        :iconColor="hideIcon? 'black' : resourceCardColors[resource]"
        :clickable="clickable"
      >
        <BaseBadge v-if="!hideCount" :color="resourceCardColors[resource]" :content="maskCount ? '?' : count" class="resource-count" />
        <BaseIcon v-if="selected" name="check-outline" size="x-large" color="green" class="selected" />
      </BaseButton>
      <BaseIcon v-if="collectable" size="x-large" name="sack" color="red" class="collect" />
    </v-card>
  </transition>
</template>

<script>
  import { resourceCardIcons, resourceCardColors } from '@/specs/resources';

  import BaseButton from '@/components/common/BaseButton';
  import BaseIcon from '@/components/common/BaseIcon';
  import BaseBadge from '@/components/common/BaseBadge';

  export default {
    name: 'ResourceCard',
    components: {
      BaseButton,
      BaseIcon,
      BaseBadge
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
      clickable: {
        type: Boolean,
        default: true
      },
      collectable: {
        type: Boolean,
        default: false
      },
      hideCount: {
        type: Boolean,
        default: false
      },
      maskCount: {
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
      selected: {
        type: Boolean,
        default: false
      }
    },
    created: function() {
      this.resourceCardIcons = resourceCardIcons;
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
    cursor: auto;
    display: flex;
    justify-content: center;
    align-items: center;

    &.clickable {
      cursor: pointer;
    }

    .resource-count {
      position: absolute;
      right: $spacer / 4;
      top: $spacer / 2;
    }

    & + & {
      margin-left: $spacer;
    }
  }
  
  .collect {
    position: absolute;
    bottom: -0.6 * $spacer;
    left: $spacer * 0.4;
  }

  .selected {
    position: absolute;
    top: 0;
    right: -$spacer;
  }
</style>