<template>
  <!-- <ActionCard
    :title="title"
    :cancel="false"
    :approve="!autoConfirm && !!selectedResource"
    @approve="$emit('resource-selected', selectedResource)"
  > -->
  <div class="select-resource">
    <ResourceCard
      v-for="resource in resourceCardTypes"
      :key="resource"
      hideCount
      :resource="resource"
      :clickable="!disabled"
      @clicked="toggleSelectedResource(resource)"
    />
  </div>
  <!-- </ActionCard> -->
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
      title: {
        type: String,
        default: 'Select Resource'
      },
      disabled: {
        type: Boolean,
        default: false
      },
      autoConfirm: {
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

        if (this.autoConfirm)
          this.$emit('resource-selected', this.selectedResource);
      }
    }
  }
</script>
