<template>
  <v-dialog v-model="isOpen" :width="width">
    <template v-slot:activator="{ on }">
      <BaseButton :on="on" :color="buttonColor" class="activator">
        <slot name="activate" />
        <BaseIcon
          size="x-large"
          color="white"
          :name="iconName"
          v-if="iconName"
          class="icon"
        />
        <img v-if="assetName" :src="require(`../../assets/${assetName}`)" :alt="assetName" />
        {{ buttonText }}
      </BaseButton>
    </template>
    <ActionCard :title="title" :cancel="hasCancel" @cancel="onCancel" :approveText="approveText" :approve="hasApprove" @approve="onApprove">
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
      buttonColor: {
        type: String,
        default: 'primary'
      },
      hasCancel: {
        type: Boolean,
        default: true
      },
      hasApprove: {
        type: Boolean,
        default: true
      },
      approveText: {
        type: String,
        default: 'Confirm'
      },
      iconName: {
        type: String,
        default: null
      },
      assetName: {
        type: String,
        default: null
      },
      title: {
        type: String,
        default: null
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

  .icon {
    margin-right: $spacer;
  }

  .activator {
    width: 100%;
    height: 100% !important;
    min-width: auto !important;
    box-shadow: none;
  }
</style>
