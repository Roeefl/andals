<template>
  <v-dialog
    :value="isOpen"
    persistent
    width="600"
  >
    <ActionCard
      title="Select Monopoly Resource"
      :cancel="false"
      :approve="!!selectedResource"
      @approve="$emit('resource-selected', selectedResource)"
    >
      <ResourceCard
        v-for="resource in resourceCardTypes"
        :key="resource"
        hideCount
        :resource="resource"
        @clicked="toggleSelectedResource(resource)"
      />
    </ActionCard>
  </v-dialog>
</template>

<script>
  import { resourceCardTypes } from '@/specs/resources';
  
  import ActionCard from '@/components/common/ActionCard';
  import ResourceCard from '@/components/game/ResourceCard';

  export default {
    name: 'SelectResource',
    components: {
      ActionCard,
      ResourceCard
    },
    props: {
      isOpen: {
        type: Boolean,
        default: false
      }
    },
    data: () => ({
      selectedResource: null
    }),
    created() {
      this.resourceCardTypes = resourceCardTypes;
    },
    methods: {
      toggleSelectedResource: function(resource) {
        this.selectedResource = this.selectedResource === resource
          ? null
          : resource;
      }
    }
  }
</script>
