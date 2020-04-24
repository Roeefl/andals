<template>
  <v-dialog
    :value="isOpen"
    persistent
    width="400"
  >
   <ActionCard :title="`Confirm Purchase: ${type}`" @cancel="$emit('no')" @approve="$emit('yes')">
    <div v-if="!isFree">
      Build {{ type }} for:
      <div class="cost">
        <ResourceCard
          v-for="resource in resourceCardTypes"
          :key="resource"
          :resource="resource"
          :count="buildingCosts[type][resource]"
          v-show="buildingCosts[type][resource]"
        />
      </div>
    </div>
  </ActionCard>
  </v-dialog>
</template>

<script>
  import colyseusService from '@/services/colyseus';
  import { resourceCardTypes } from '@/specs/resources';

  import ResourceCard from '@/components/game/ResourceCard';
  import ActionCard from '@/components/common/ActionCard';

  export default {
    name: 'ConfirmMove',
    components: {
      ResourceCard,
      ActionCard
    },
    props: {
      isOpen: {
        type: Boolean,
        default: false
      },
      type: {
        type: String,
        required: true
      },
      isFree: {
        type: Boolean,
        default: false
      },
      isFlexible: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      buildingCosts: () => colyseusService.buildingCosts
    },
    created() {
      this.resourceCardTypes = resourceCardTypes;
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  .cost {
    display: flex;
  }
</style>
