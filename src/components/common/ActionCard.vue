<template>
  <v-card :color="color">
    <v-card-title
      v-if="title"
      primary-title
      class="headline success"
      :style="{ background: titleColor }"
    >
      {{ title }}
    </v-card-title>
    <slot />
    <fragment v-if="cancel || approve">
      <v-divider />
      <v-card-actions class="card-actions">
        <BaseButton text v-if="cancel" color="primary" @click="$emit('cancel')" class="card-action">
          {{ cancelText }}
        </BaseButton>
        <v-spacer />
        <BaseButton text v-if="approve" color="highlight" @click="$emit('approve')" class="card-action">
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
      cancelText: {
        type: String,
        default: 'Cancel'
      },
      approve: {
        type: Boolean,
        default: true
      },
      approveText: {
        type: String,
        default: 'Confirm'
      }
    } 
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  .card-actions {
    display: grid;
    grid-template-columns: 40% 20% 40%;

    // .card-action {
    //   height: 60px;
    // }
  }
</style>