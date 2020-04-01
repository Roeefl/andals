<template>
  <v-dialog v-model="isOpen" :width="width">
    <template v-slot:activator="{ on }">
      <Button :on="on" color="purple">
        <Icon
          size="x-large"
          color="white"
          :name="iconName"
          v-if="iconName"
          class="test"
        />
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
  import Icon from '@/components/Icon';

  export default {
    name: 'Modal',
    components: {
      Button,
      Icon
    },
    props: {
      buttonText: {
        type: String,
        default: ''
      },
      iconName: {
        type: String,
        default: null
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

<style scoped lang="scss">
  @import '@/styles/partials';

  .test {
    margin-right: $spacer;
  }
</style>
