<template>
  <v-card :color="color">
    <v-card-title
      v-if="title"
      primary-title
      class="headline card-headline"
      :class="titleColor"
    >
      {{ title }}
      <BaseButton v-if="closeButton" icon iconName="close-box" class="close-button" iconSize="30px" @click="$emit('close')" />
    </v-card-title>
    <slot />
    <fragment v-if="cancel || approve">
      <v-divider />
      <v-card-actions class="card-actions">
        <BaseButton v-if="cancel" text :color="cancelColor" @click="$emit('cancel')" class="card-action">
          {{ cancelText }}
        </BaseButton>
        <BaseButton v-if="approve" text :color="approveColor" @click="$emit('approve')" class="card-action">
          {{ approveText }}
        </BaseButton>
      </v-card-actions>
    </fragment>
  </v-card>
</template>

<script>
  import BaseButton from '@/components/common/BaseButton';

  export default {
    name: 'ActionCard',
    components: {
      BaseButton
    },
    props: {
      title: {
        type: String,
        default: 'Card Title'
      },
      color: {
        type: String,
        default: 'secondary'
      },
      titleColor: {
        type: String,
        default: 'success'
      },
      cancel: {
        type: Boolean,
        default: true
      },
      cancelColor: {
        type: String,
        default: 'primary'
      },
      cancelText: {
        type: String,
        default: 'Cancel'
      },
      approve: {
        type: Boolean,
        default: true
      },
      approveColor: {
        type: String,
        default: 'highlight'
      },
      approveText: {
        type: String,
        default: 'Confirm'
      },
      closeButton: {
        type: Boolean,
        default: false
      }
    } 
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  .card-headline {
    justify-content: space-between;
  }

  .card-actions {
    display: grid;
    grid-template-columns: 50% 50%;

    // .card-action {
    //   height: 60px;
    // }
  }
</style>