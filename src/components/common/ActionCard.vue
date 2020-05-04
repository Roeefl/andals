<template>
  <v-card :color="color" :light="light">
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
        <div class="card-action">
          <BaseButton :clickable="cancel" text :color="cancelColor" @click="$emit('cancel')">
            {{ cancelText }}
          </BaseButton>
        </div>
        <div class="card-action">
          <BaseButton v-if="approve" text :color="approveColor" @click="$emit('approve')">
            {{ approveText }}
          </BaseButton>
        </div>
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
      light: {
        type: Boolean,
        default: false
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

    .card-action {
      display: flex;
      justify-content: center;
    }
  }
</style>