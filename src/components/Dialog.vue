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
    <Card :title="title" :onAction="() => isOpen = false" :onCancel="() => isOpen = false">
      <slot />
    </Card>
  </v-dialog>
</template>

<script>
  import Card from '@/components/Card';
  import Button from '@/components/Button';
  import Icon from '@/components/Icon';

  export default {
    name: 'Modal',
    components: {
      Card,
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
        default: 400
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
