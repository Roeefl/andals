<template>
  <div class="scene">
    <div class="background">
      <div class="stars">
        <div v-for="(star, s) in Array(200).fill(0)" :key="s" class="star" />
      </div>
      <div class="moon"></div>
      <div class="mountains">
        <div v-for="(mountain, m) in Array(4).fill(0)" :key="m" class="star" />
      </div>
      <div class="sea">
        <div v-for="(wave, w) in Array(30).fill(0)" :key="w" class="star" />
        <div class="boat">
          <div class="sail"></div>
          <div class="sail"></div>
          <div class="base"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'River',
    props: {
      size: {
        type: Number,
        default: 102
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  $x-dark: #3006c7;
  $dark: #3a37d4;
  $medium: #4a9bff;
  $light: #dee0ff;
  $x-light: #ffffff;
  $aqua: #9eeaff;
  $grey: #9e9ebe;
  $yellow: #fffcd1;
  $boatSpeed: 40s;

  .background {
    background: $x-dark;
    background-image: linear-gradient(
      $x-dark 0%,
      $dark 10%,
      $medium 60%,
      $aqua 90%
    );
    width: 100%;
    height: 100%;
    overflow: hidden;
    z-index: 1;
  }

  .sea {
    background: $x-dark;
    background-image: linear-gradient(
      to top,
      $x-dark 0%,
      $dark 30%,
      $medium 60%,
      $aqua 90%
    );
    width: 100%;
    height: 250px;
    bottom: 0;
    left: 0;
    z-index: 4;
    .wave {
      height: 3px;
      background-color: $x-light;
      border-radius: 100%;
      opacity: 0.2;
      animation: wave 4s linear infinite;
    }
    @for $i from 1 through (30) {
      $size: random(170) + 50px;
      .wave:nth-of-type(#{$i}) {
        width: $size;
        bottom: random(170) + px;
        left: random(100) + vw;
        opacity: random(5) * 0.1;
        animation-delay: random(3) + s;
      }
    }
  }

  .stars {
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
    .star {
      background-color: $light;
      box-shadow: 0px 0px 15px 1px white;
      animation: twinkle 3s ease-in-out infinite;
    }
  }

  @for $i from 1 through (200) {
    $size: random(3)+px;
    .star:nth-of-type(#{$i}) {
      border-radius: 50%;
      top: random(100)+vh;
      left: random(100)+vw;
      width: $size;
      height: $size;
      animation-delay: random(5)+s;
    }
  }

  .moon {
    width: 80px;
    height: 80px;
    top: 25%;
    right: 10%;
    border-radius: 50%;
    z-index: 2;
    background-color: $x-light;
    box-shadow: 0 0 10px $x-light, 0 0 20px $x-light, 0 0 30px $x-light, 0 0 40px $x-light, 0 0 50px $aqua, 0 0 100px $x-light;
  }

  .mountains {
    width: 100%;
    height: 250px;
    bottom: 162px;
    z-index: 3;
    
    .mountain {
      width: 250px;
      height: 250px;
      background-color: $medium;
      right: 50px;
      bottom: -40px;
      transform: rotate(45deg);
      border-radius: 3px;
      &:after {
        width: 100%;
        height: 100%;
        opacity: 0.7;
        background-image: linear-gradient(135deg, #3006c7 0%, #56a7ff 30%, $aqua 40%);
      }
    }
    
    .mountain:nth-child(2) {
      right: 220px;
      width: 240px;
      height: 240px;
      z-index: 2;
    }
    
    .mountain:nth-child(3) {
      right: 350px;
      width: 260px;
      height: 260px;
    }
    
    .mountain:nth-child(4) {
      right: 130px;
      width: 200px;
      height: 200px;
      z-index: 3;
      bottom: -70px;
      &:after {
        background-image: linear-gradient(135deg, #3006c7 0%, #56a7ff 15%, $aqua 25%);
      }
    }
  }

  .boat {
    width: 90px;
    height: 90px;
    bottom: 90px;
    animation: boat $boatSpeed linear infinite;
    &:after {
      background-image: linear-gradient(
        90deg,
        transparentize($x-light, 0.3) 30%,
        rgba(255, 255, 255, 0) 100%
      );
      width: 200px;
      height: 8px;
      top: 105px;
      left: 20px;
      border-radius: 40%;
      z-index: -1;
    }
    &:before {
      width: 92px;
      height: 50px;
      left: 25px;
      bottom: -70px;
      background-image: linear-gradient(
        to bottom,
        transparentize($x-dark, 0.2) 30%,
        transparentize($x-dark, 1) 100%
      );
      z-index: -1;
      animation: boatShadow $boatSpeed linear infinite;
    }

    .base {
      width: 110px;
      height: 25px;
      bottom: -20px;
      clip-path: polygon(0 0, 100% 0, 100% 100%, 20% 100%);
      background-color: $x-dark;
    }
    .sail:nth-child(1) {
      width: 90px;
      height: 80px;
      left: 5px;
      clip-path: polygon(50% 0%, 0% 100%, 50% 100%);
      background: linear-gradient($light 0%, $x-dark 60%);
    }
    .sail:nth-child(2) {
      width: 80px;
      height: 70px;
      left: 15px;
      bottom: 10px;
      transform: scaleX(-1);
      clip-path: polygon(50% 0%, 0% 100%, 50% 100%);
      background: linear-gradient($light 0%, $x-dark 60%);
    }
  }

  @keyframes twinkle {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.3;
    }
  }

  @keyframes wave {
    0%,
    100% {
      transform: translateX(0);
    }
    50% {
      transform: translateX(-80px);
    }
  }
  @keyframes boat {
    0% {
      transform: translateX(120vw) scale(0.8);
    }
    80%,
    100% {
      transform: translateX(-10vw) scale(0.8);
    }
  }
  @keyframes boatShadow {
    0% {
      transform: skewX(35deg) translateX(15px);
    }
    50%,
    100% {
      transform: skewX(-55deg) translateX(-40px);
    }
  }

  @keyframes lightRotate {
    0%,
    100% {
      // initial and final state
      transform: perspective(500px) rotateY(0deg);
    }
    25% {
      //rotates to the back
      transform: perspective(500px) rotateY(35deg);
    }
    75% {
      // rotates to the front
      transform: perspective(500px) rotateY(-35deg);
    }
  }

  @keyframes lightGlow {
    50% {
      opacity: 0;
    }
    75% {
      opacity: 0.7;
    }
  }
</style>