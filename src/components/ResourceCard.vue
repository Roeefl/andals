<template>
  <v-card max-width="300" class="resource-card">
    <Button icon>
      <Icon
        size="x-large"
        :name="resourceCardNameToIcon[resource]"
        :color="resourceCardColors[resource]"
      />
      <NumberBadge :color="resourceCardColors[resource]" :content="count" />
    </Button>
  </v-card>
</template>

<script>
  import { resourceCardNameToIcon, resourceCardColors } from '@/utils/tileManifest';

  import Button from '@/components/Button';
  import Icon from '@/components/Icon';
  import NumberBadge from '@/components/NumberBadge';

  export default {
    name: 'ResourceCard',
    components: {
      Button,
      Icon,
      NumberBadge
    },
    props: {
      resource: {
        type: String,
        required: true
      },
      count: {
        type: [Number, String],
        default: '0'
      }
    },
    created: function() {
      this.resourceCardNameToIcon = resourceCardNameToIcon;
      this.resourceCardColors = resourceCardColors;
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';
  
  .resource-card {
    height: 50px;
    padding: 0 $spacer / 4;
  }
</style>