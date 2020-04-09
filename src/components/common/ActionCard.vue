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
      <Button text v-if="cancel" @click="() => $emit('cancel')">
        {{ cancelText }}
      </Button>
      <v-spacer />
      <Button text v-if="approve" @click="() => $emit('approve')">
        {{ approveText }}
      </Button>
    </v-card-actions>
  </v-card>
</template>

<script>
  import Button from '@/components/common/Button';

  export default {
    name: 'ActionCard',
    components: {
      Button
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
        default: 'Okey'
      }
    } 
  }
</script>
