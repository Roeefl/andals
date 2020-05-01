<template>
  <v-menu :open-on-hover="isHover" :value="isForceOpen ? true : undefined" :offset-y="isVertical" :offset-x="!isVertical" bottom>
    <template v-slot:activator="{ on }">
      <BaseButton :on="on" :color="buttonColor" class="activator">
        <BaseIcon
          v-if="iconName"
          size="x-large"
          :name="iconName"
          :color="iconColor"
        />
        {{ buttonText }}
      </BaseButton>
    </template>
    <v-list color="primary">
      <v-list-item
        v-for="(item, i) in items"
        :key="i"
        :disabled="item.disabled"
        @click="$emit('item-clicked', item.emit)"
        class="base-menu-item"
        :class="{ 'disabled': item.disabled }"
      >
        <BaseIcon
          v-if="item.icon"
          :name="item.icon"
          size="large"
          color="secondary"
          class="menu-item-icon"
        />
        <v-list-item-title class="menu-item-title">
          {{ item.title || item.name }}
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
  import BaseButton from '@/components/common/BaseButton';
  import BaseIcon from '@/components/common/BaseIcon';
  
  export default {
    name: 'BaseMenu',
    components: {
      BaseButton,
      BaseIcon
    },
    props: {
      items: {
        type: Array,
        required: true
      },
      isVertical: {
        type: Boolean,
        default: true
      },
      isHover: {
        type: Boolean,
        default: true
      },
      isForceOpen: {
        type: Boolean,
        default: false 
      },
      buttonColor: {
        type: String,
        default: 'primary'
      },
      buttonText: {
        type: String,
        default: ''
      },
      iconName: {
        type: String,
        default: null
      },
      iconColor: {
        type: String,
        default: 'secondary'
      }
    }
  }
</script>

<style lang="scss">
  @import '@/styles/partials';

  .v-menu__content {
    z-index: $zindex-app-header + 1 !important;
    margin-top: 2px;
  }

  .base-menu-item {
    .menu-item-title {
      color: $secondary;
    }
    
    &.disabled {
      opacity: 0.6;
      
      .menu-item-title {
        color: $error;
      }
    }
  }

  .menu-item-icon {
    margin-right: $spacer;
  }
</style>
