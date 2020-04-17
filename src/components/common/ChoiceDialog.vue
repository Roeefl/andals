<template>
  <v-dialog v-model="isOpen" :width="width">
    <template v-slot:activator="{ on }">
      <BaseButton :on="on" :color="buttonColor" class="activator">
        <BaseIcon
          size="x-large"
          color="white"
          :name="iconName"
          v-if="iconName"
          class="test"
        />
        <img v-if="assetName" :src="require(`../../assets/${assetName}`)" :alt="assetName" />
        {{ buttonText }}
      </BaseButton>
    </template>
    <ActionCard :title="title" :cancel="hasCancel" @cancel="onCancel" @approve="onApprove">
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

  .test {
    margin-right: $spacer;
  }

  .activator {
    box-shadow: none;
  }
</style>
