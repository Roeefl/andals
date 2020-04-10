<template>
  <v-dialog v-model="isOpen" :width="width">
    <template v-slot:activator="{ on }">
      <BaseButton :on="on" color="primary">
        <BaseIcon
          size="x-large"
          color="white"
          :name="iconName"
          v-if="iconName"
          class="test"
        />
        {{ buttonText || title }}
      </BaseButton>
    </template>
    <ActionCard :title="title" @cancel="onCancel" @approve="onApprove">
      <slot />
    </ActionCard>
  </v-dialog>
</template>

<script>
  import ActionCard from '@/components/common/ActionCard';
  import BaseButton from '@/components/common/BaseButton';
  import BaseIcon from '@/components/common/BaseIcon';

  export default {
    name: 'ChoiceDialog',
    components: {
      ActionCard,
      BaseButton,
      BaseIcon
    },
    props: {
      buttonText: {
        type: String,
        default: null
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
    }),
    methods: {
      onCancel: function() {
        this.isOpen = false;
        this.$emit('cancel');
      },
      onApprove: function() {
        this.isOpen = false;
        this.$emit('approve');
      }
    }
  };
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  .test {
    margin-right: $spacer;
  }
</style>
