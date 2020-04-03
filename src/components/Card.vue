<template>
  <v-card>
    <v-card-title
      class="headline grey lighten-2"
      primary-title
    >
      {{ title }}
    </v-card-title>
    <slot />
    <v-divider />
    <v-card-actions>
      <Button text :onClick="onCancel">
        Cancel
      </Button>
      <v-spacer />
      <Button text :onClick="onAction">
        Okey
      </Button>
    </v-card-actions>
  </v-card>
</template>

<script>
  import Button from '@/components/Button';

  export default {
    name: 'Card',
    components: {
      Button
    },
    props: {
      title: {
        type: String,
        default: 'Card Title'
      },
      onAction: {
        type: Function,
        default: () => {}
      },
      onCancel: {
        type: Function,
        default: () => {}
      }
    } 
  }
</script>
