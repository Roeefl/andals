<template>
  <!-- <ActionCard
    :title="title"
    :cancel="false"
    :approve="!autoConfirm && !!selectedResource"
    @approve="$emit('resource-selected', selectedResource)"
  > -->
  <div class="select-container">
    <div v-if="!asCarousel" key="flat-select" class="select-resource">
      <ResourceCard
        v-for="resource in resourceCardTypes"
        :key="resource"
        hideCount
        :resource="resource"
        :clickable="enabled"
        @clicked="toggleSelectedResource(resource)"
      />
    </div>
    <v-carousel
      v-else
      key="carousel-select"
      hide-delimiters
      show-arrows
      :cycle="false"
      height="auto"
      :value="selectedResource"
      @change="$emit('resource-selected', resourceCardTypes[$event])"
      class="carousel"
    >
    <v-carousel-item v-for="resource in resourceCardTypes" :key="resource" class="carousel-item">
      <ResourceCard hideCount :resource="resource" /> 
    </v-carousel-item>
  </v-carousel>
  </div>
  <!-- </ActionCard> -->
</template>

<script>
  import { resourceCardTypes } from '@/specs/resources';
  
  import ActionCard from '@/components/common/ActionCard';
  import ResourceCard from '@/components/game/ResourceCard';

  export default {
    name: 'ResourceSelect',
    components: {
      ActionCard,
      ResourceCard
    },
    props: {
      title: {
        type: String,
        default: 'Select Resource'
      },
      enabled: {
        type: Boolean,
        default: true
      },
      autoConfirm: {
        type: Boolean,
        default: false
      },
      asCarousel: {
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

<style scoped lang="scss">
  @import '@/styles/partials';

  .select-resource {
    display: flex;
  }

  .carousel-item {
    width: 100%;
    display: flex;
    justify-content: center;
  }
</style>