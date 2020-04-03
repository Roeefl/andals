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
      <Button text :onClick="() => $emit('cancel')">
        Cancel
      </Button>
      <v-spacer />
      <Button text :onClick="() => $emit('approve')">
        Okey
      </Button>
    </v-card-actions>
  </v-card>
</template>

<script>
  import Button from '@/components/Button';

  export default {
    name: 'ActionCard',
    components: {
      Button
    },
    props: {
      title: {
        type: String,
        default: 'Card Title'
      }
    } 
  }
</script>
