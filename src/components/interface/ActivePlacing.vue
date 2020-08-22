<script>
  import GamePiece from '@/components/game/GamePiece';

  export default {
    name: 'ActivePlacing',
    components: {
      GamePiece
    },
    props: {
      type: {
        type: String,
        required: true
      },
      color: {
        type: String,
        default: '#43A047'
      }
    },
    created() {
      document.body.onmousemove = this.followCursor;
    },
    destroyed() {
      document.body.onmousemove = undefined;
    },
    methods: {
      followCursor: function(e) {
        const event = e || window.event;

        const { activePlacing } = this.$refs;
        if (!activePlacing) return;

        activePlacing.style.left = (event.clientX + 20) + 'px';
        activePlacing.style.top = (event.clientY + 20) + 'px';
      }
    }
  }
</script>

<template>
  <div id="active-placing" ref="activePlacing">
    <GamePiece 
      :type="type"
      :showCount="false"
      :color="color"
      size="60px"
    />
  </div>
</template>

<style scoped lang="scss">
  @import '@/styles/partials';

  #active-placing {
    position: absolute;
    z-index: $zindex-screen-overlay;
  }
</style>
