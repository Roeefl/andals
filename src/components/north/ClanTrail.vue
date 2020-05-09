<template>
  <div class="clan-trail">
    <div class="trail-symbol">
      <div class="trail-value">
        {{ value }}
      </div>
    </div>
  </div>
</template>

<script>
  import BaseIcon from '@/components/common/BaseIcon';

  export default {
    name: 'ClanTrail',
    components: {
      BaseIcon
    },
    props: {
      value: {
        type: String,
        required: true
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  $symbol-color: rgba(black, 0.8);
  $symbol-size: 24px;

  .clan-trail {
    position: relative;
  }

  .trail-symbol {
    z-index: $zindex-interface;
    width: 0;
    height: 0;
    border: $symbol-size solid transparent;
    border-bottom-color: $symbol-color;
    position: relative;
    // transform: translateY(-60%);
    top: $symbol-size * -1.25;

    &:after {
      content: '';
      position: absolute;
      left: -$symbol-size;
      top: $symbol-size;
      width: 0;
      height: 0;
      border: $symbol-size solid transparent;
      border-top-color: $symbol-color;
    }
  }

  .trail-value {
    width: 32px;
    z-index: $zindex-interface + 1;
    font-weight: 700;
    position: absolute;
    top: $spacer;
    left: -$spacer * 1.3;
    text-align: center;
  }
</style>
