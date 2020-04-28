<template>
  <v-menu :open-on-hover="isHover" :value="isForceOpen ? true : undefined" offset-y bottom>
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
    <v-list>
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
          color="primary"
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

<style scoped lang="scss">
  @import '@/styles/partials';

  .base-menu-item {
    .menu-item-title {
      color: $primary;
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
