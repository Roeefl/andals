<template>
  <ul class="base-grid">
    <li class="grid-item grid-header">
      <span v-for="(column, c) in columns" :key="`column-${c}`">
        {{ column.title }}
      </span>
    </li>
    <li v-for="(item, i) in items" :key="`item-${i}`" class="grid-item">
      <span v-for="(column, c) in columns" :key="`item-${i}-column-${c}`">
        {{ item[column.key] }}
      </span>
      <BaseButton
        v-for="({ key, name, icon, emitValue, isDisabled, disabledKey }, a) in itemActions"
        :key="`item-${i}-action-${a}`"
        :disabled="(isDisabled && isDisabled(item)) || item[disabledKey]"
        :iconName="icon"
        @click="$emit(key, item[emitValue])"
        class="item-action"
      >
        {{ name }}
      </BaseButton>
    </li>
  </ul>
</template>

<script> 
  import BaseButton from '@/components/common/BaseButton';

  export default {
    name: 'BaseGrid',
    components: {
      BaseButton
    },
    props: {
      columns: {
        type: Array,
        default: []
      },
      items: {
        type: Array,
        default: []
      },
      itemActions: {
        type: Array,
        default: []
      }
    }
  }
</script>

<style scoped lang="scss">
 @import '@/styles/partials';
 
 .base-grid {
   display: flex;
   flex-direction: column;

   .grid-item {
      display: grid;
      grid-template-rows: auto;
      grid-template-columns: repeat(7, 1fr);
      justify-items: center;
      align-items: center;
      background: rgba($info, 0.7);
      color: $secondary;
      padding: $spacer;

      &.grid-header {
        background: rgba($success, 0.7);
        color: $primary;
      }

      .item-action {
        width: 80%;
      }
    }
  }
</style>
