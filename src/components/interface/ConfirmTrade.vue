<template>
  <v-dialog
    :value="isOpen"
    persistent
    width="400"
  >
   <ActionCard :title="`Confirm trade with ${withWho}`" @cancel="$emit('no')" @approve="$emit('yes')" />
  </v-dialog>
</template>

<script>
  import ActionCard from '@/components/common/ActionCard';

  export default {
    name: 'ConfirmTrade',
    components: {
      ActionCard
    },
    props: {
      isOpen: {
        type: Boolean,
        default: false
      },
      withWho: {
        type: String,
        required: true
      }
    }
  }
</script>
