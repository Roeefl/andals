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
      <Button text @click="() => $emit('cancel')">
        {{ cancelText }}
      </Button>
      <v-spacer />
      <Button text @click="() => $emit('approve')" v-if="approve">
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
