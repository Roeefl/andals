<template>
  <Button icon>
    <Icon
      size="x-large"
      :name="resouceCardNameToIcon[resource]"
      :color="resourceCardColors[resource]"
    />
    <NumberBadge :color="resourceCardColors[resource]" :content="count" />
  </Button>
</template>

<script>
  import { resouceCardNameToIcon, resourceCardColors } from '@/utils/tileManifest';

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
      this.resouceCardNameToIcon = resouceCardNameToIcon;
      this.resourceCardColors = resourceCardColors;
    }
  }
</script>
