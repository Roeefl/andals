<template>
  <BaseOverlay :isOpen="true" class="dice-container" :style="spinStyle">
    <div id="dice-container">
      <div v-for="(dice, di) in dice" :key="di" class="die" :class="`die-${di}`">
        <div v-for="(face, f) in Array(6).fill(0)" :key="f" class="face" :class="`face-${f + 1}`">
          <div v-for="(dot, d) in Array(f + 1).fill(0)" :key="d" class="dot" />
        </div>
      </div>
    </div>
    <audio ref="diceAudio">
      <source src="../../assets/audio/dice.mp3" type="audio/mpeg">
    </audio>
  </BaseOverlay>
</template>

<script>
  import BaseOverlay from '@/components/common/BaseOverlay';
  import BaseButton from '@/components/common/BaseButton';
  
  import { ROOM_TYPE_BASE_GAME, ROOM_TYPE_FIRST_MEN } from '@/services/colyseus';
  import { WILDLING_DICE_MAX } from '@/specs/dice';
  
  export default {
    name: 'RollingDice',
    components: {
      BaseOverlay,
      BaseButton
    },
    props: {
      type: {
        type: String,
        default: ROOM_TYPE_BASE_GAME
      }
    },
    data: () => ({
      spinStyle: { 
        '--spin-start': '0deg',
        '--spin-end': '360deg'
      },
      dice: [4, 3, 1]
    }),
    mounted() {
      // const diceRoller = setInterval(() => {
      //   const spinStart = Math.floor(Math.random() * 360) + 1;
      //   const spinEnd = Math.floor(Math.random() * 360) + 1;

      //   this.spinStyle['--spin-start'] = spinStart;
      //   this.spinStyle['--spin-end'] = spinEnd;
      // }, 300);

        //       if (this.type === ROOM_TYPE_FIRST_MEN) {
        //   const wildlingDice = Math.floor(Math.random() * WILDLING_DICE_MAX) + 1;
          
        //   this.dice = [
        //     ...this.dice,
        //     wildlingDice
        //   ];
        // }

      setTimeout(() => {
        // clearInterval(diceRoller);

        const randomDice = [
          Math.floor(Math.random() * 6) + 1,
          Math.floor(Math.random() * 6) + 1,
          Math.floor(Math.random() * WILDLING_DICE_MAX) + 1
        ];

        const { diceAudio } = this.$refs;
        if (diceAudio) diceAudio.play(); 

        this.$emit('finished', randomDice);
      }, 2000);
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  $face-size: 100px;
  $dot-size: $face-size * 0.225;
  
  $die-0-color: $warning;
  $die-1-color: $success;
  $die-2-color: $primary;

  #dice-container {
    perspective: 2000px;
    width: 40vw;
    height: 30vh;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    background: transparent;
  }

  .die {
    width: $face-size;
    height: $face-size;
    transform-style: preserve-3d;
    animation: spin 1s infinite;
// linear 1s
    &.die-0 {
      .face {
        background: $die-0-color;
      }
    }

    &.die-1 {
      .face {
        background: $die-1-color;
      }
    }

    &.die-2 {
      // animation-direction: reverse;

      .face {
        background: $die-2-color;
      }
    }

    &:hover {
      animation-play-state: paused;
    }

    .face {
      position: absolute;
      width: $face-size;
      height: $face-size;
      font-size: 40px;
      text-align: center;
      line-height: $face-size;
      border: 1px solid black;
      transform-style: preserve-3d;

      &:hover {
        background: $highlight;
      }

      .dot {
        position: absolute;
        width: $dot-size;
        height: $dot-size;
        border-radius: 50%;
        background: black;
        transform: translate(-50%, -50%);
      }
    }
  }

  .face-1 {
    transform: translateZ($face-size / -2) rotateY(180deg);

    & > .dot {
      left: 50%;
      top: 50%;
    }
  }

  .face-2 {
    transform: translateX(50%) rotateY(90deg);

    & > .dot:nth-child(1) {
        left: 25%;
        top: 50%;
    }

    & > .dot:nth-child(1) {
        left: 25%;
        top: 50%;
    }

    & > .dot:nth-child(2) {
        left: 75%;
        top: 50%;
    }
  }

  .face-3 {
    transform: translateX(-50%) rotateY(-90deg);

    & > .dot:nth-child(1) {
      left: 25%;
      top: 25%;
    }

    & > .dot:nth-child(2) {
      left: 50%;
      top: 50%;
    }

    & > .dot:nth-child(3) {
      left: 75%;
      top: 75%;
    }
  }

  .face-4 {
    transform: translateY(50%) rotateX(90deg);

    & > .dot:nth-child(1) {
      left: 25%;
      top: 25%
    }

    & > .dot:nth-child(2) {
      left: 75%;
      top: 25%
    }

    & > .dot:nth-child(3) {
      left: 25%;
      top: 75%
    }

    & > .dot:nth-child(4) {
      left: 75%;
      top: 75%
    }
  }

  .face-5 {
    transform: translateY(-50%) rotateX(-90deg);

    & > .dot:nth-child(1) {
      left: 25%;
      top: 25%
    }

    & > .dot:nth-child(2) {
      left: 75%;
      top: 25%
    }

    & > .dot:nth-child(3) {
      left: 25%;
      top: 75%
    }

    & > .dot:nth-child(4) {
      left: 75%;
      top: 75%
    }

    & > .dot:nth-child(5) {
      left: 50%;
      top: 50%
    }
  }

  .face-6 {
    transform: translateZ($face-size / 2);

    & > .dot:nth-child(1) {
      left: 25%;
      top: 25%
    }

    & > .dot:nth-child(2) {
      left: 75%;
      top: 25%
    }

    & > .dot:nth-child(3) {
      left: 25%;
      top: 50%
    }

    & > .dot:nth-child(4) {
      left: 75%;
      top: 50%
    }

    & > .dot:nth-child(5) {
      left: 25%;
      top: 75%
    }

    & > .dot:nth-child(6) {
      left: 75%;
      top: 75%
    }
  }
</style>