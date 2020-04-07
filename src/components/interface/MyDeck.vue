<template>
  <v-dialog
    :value="isOpen"
    persistent
    width="600"
  >
    <ActionCard title="My Deck" @cancel="$emit('close')" @approve="$emit('close')">
      <Deck :deck="deck" />
    </ActionCard>
  </v-dialog>
</template>

<script>
  import ActionCard from '@/components/common/ActionCard';
  import Deck from '@/components/game/Deck';

  export default {
    name: 'MyDeck',
    components: {
      ActionCard,
      Deck
    },
    props: {
      isOpen: {
        type: Boolean,
        default: false
      },
      deck: {
        type: Object,
        default: function() {
          return {};
        }
      }
    }
  }
</script>
