<template>
  <v-dialog v-model="isOpen" :width="width">
    <template v-slot:activator="{ on }">
      <BaseButton :on="on" :color="buttonColor" :disabled="disabled" class="activator">
        <slot name="activate" />
        <BaseIcon
          size="x-large"
          :color="iconColor"
          :name="iconName"
          v-if="iconName"
          class="icon"
        />
        <img v-if="assetName" :src="require(`../../assets/${assetName}`)" :alt="assetName" />
        {{ buttonText }}
      </BaseButton>
    </template>
    <ActionCard
      :title="title"
      :cancel="hasCancel"
      :cancelColor="cancelColor"
      :cancelText="cancelText"
      @cancel="onCancel"
      :approveText="approveText"
      :approveColor="approveColor"
      :approve="hasApprove"
      @approve="onApprove"
      class="action-card"
    >
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
        default: 'info'
      },
      iconColor: {
        type: String,
        default: 'white'
      },
      hasCancel: {
        type: Boolean,
        default: true
      },
      cancelColor: {
        type: String,
        default: undefined,
      },
      cancelText: {
        type: String,
        default: 'Cancel'
      },
      hasApprove: {
        type: Boolean,
        default: true
      },
      approveColor: {
        type: String,
        default: undefined,
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
      },
      disabled: {
        type: Boolean,
        default: false
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

  .action-card {
    display: flex;
    flex-direction: column;

    .card-action {
      width: 100%;
    }
  }
</style>
