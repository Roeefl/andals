<template>
  <v-card>
    <v-card-title
      v-if="title"
      primary-title
      class="headline grey lighten-2"
    >
      {{ title }}
    </v-card-title>
    <slot />
    <fragment v-if="cancel || approve">
      <v-divider />
      <v-card-actions class="card-actions">
        <BaseButton text v-if="cancel" color="red" @click="() => $emit('cancel')">
          {{ cancelText }}
        </BaseButton>
        <v-spacer />
        <BaseButton text v-if="approve" color="success" @click="() => $emit('approve')">
          {{ approveText }}
        </BaseButton>
      </v-card-actions>
    </fragment>
  </v-card>
</template>

<script>
  import BaseButton from '@/components/common/BaseButton';

  export default {
    name: 'ActionCard',
    components: {
      BaseButton
    },
    props: {
      title: {
        type: String,
        default: 'Card Title'
      },
      cancel: {
        type: Boolean,
        default: true
      },
      cancelText: {
        type: String,
        default: 'Cancel'
      },
      approve: {
        type: Boolean,
        default: true
      },
      approveText: {
        type: String,
        default: 'Confirm'
      }
    } 
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  .card-actions {
    display: flex;
    flex-flow: row wrap;
  }
</style>