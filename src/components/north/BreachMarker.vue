<template>
  <div class="breach-marker">
    <h1>
      Wall Breach Tracker
    </h1>
    <div class="tracker">
      <div v-for="(lvl, l) in levels" :key="l" class="breach-level" :class="{ 'active': l === wallBreaches }">
        <span class="level-number">
          {{ l }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
  const levels = [0, 1, 2, 3];

  export default {
    name: 'BreachMarker',
    props: {
      wallBreaches: {
        type: Number,
        default: 0
      }
    },
    created() {
      this.levels = levels;
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  .breach-marker {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding-bottom: $spacer;

    .tracker {
      flex: 1;
      display: flex;
      flex-direction: column;

      .breach-level {
        background: $primary;
        color: $secondary;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 25%;

        &.active {
          background: $success;
          color: $primary;
          font-weight: 900;
        }
        
        .level-number {
          font-size: $font-size-md;
        }
      }
    }
  }

  .breach-level {
    & + & {
      border-top: 2px solid black;
    }
  }
</style>
