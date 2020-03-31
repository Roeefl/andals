<template>
  <v-dialog v-model="isOpen" :width="width">
    <template v-slot:activator="{ on }">
      <Button :on="on" color="red lightn-2" dark>
        {{ buttonText }}
      </Button>
    </template>
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
        <v-spacer></v-spacer>
        <Button text :onClick="() => isOpen = false">
          Okey
        </Button>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import Button from '@/components/Button';

  export default {
    name: 'Modal',
    components: {
      Button
    },
    props: {
      buttonText: {
        type: String,
        default: 'Open'
      },
      title: {
        type: String,
        default: 'Modal'
      },
      width: {
        type: Number,
        default: 500
      }
    },
    data: () => ({
      isOpen: false
    })
  };
</script>
