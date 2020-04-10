<template>
  <v-card>
    <v-card-title
      primary-title
      class="headline grey lighten-2"
    >
      {{ title }}
    </v-card-title>
    <slot />
    <v-divider />
    <v-card-actions>
      <BaseButton text v-if="cancel" @click="() => $emit('cancel')">
        {{ cancelText }}
      </BaseButton>
      <v-spacer />
      <BaseButton text v-if="approve" @click="() => $emit('approve')">
        {{ approveText }}
      </BaseButton>
    </v-card-actions>
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
