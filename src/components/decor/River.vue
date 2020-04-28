<template>
  <div class="container">
    <div class="scene-wrapper">
      <div class="cloud-path">
        <div class="cloud-wrap cloud-wrap1">
          <div class="cloud-wrap-inner">
            <div class="bubble1"></div>
            <div class="bubble2"></div>
            <div class="bubble3"></div>
          </div>  
        </div>
        <div class="cloud-wrap cloud-wrap2">
          <div class="cloud-wrap-inner">
            <div class="bubble1"></div>
            <div class="bubble2"></div>
            <div class="bubble3"></div>
          </div>  
        </div>
        <div class="cloud-wrap cloud-wrap3">
          <div class="cloud-wrap-inner">
            <div class="bubble1"></div>
            <div class="bubble2"></div>
            <div class="bubble3"></div>
          </div>  
        </div>
      </div>
      <div class="rain-wrap" />
      <div class="ship ship2" />
      <div class="ship" />
      <div class="wave-wrap wave-small">
          <div v-for="(wave, w) in Array(9).fill(0)" :key="w" class="wave-block" />
      </div>
      <div class="wave-wrap wave-medium">
        <div v-for="(wave, w) in Array(9).fill(0)" :key="w" class="wave-block" />
      </div>
      <div class="wave-wrap wave-large">
        <div v-for="(wave, w) in Array(9).fill(0)" :key="w" class="wave-block" />
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

  @keyframes moonspin {
    0% {
      transform: rotate(0deg)
    }
    100% {
      transform: rotate(360deg)
    }
  }

  @keyframes float {
    0% {
      -webkit-transform: rotate(0deg) translate(-50%,0px);
              transform: rotate(0deg) translate(-50%,0px);
    }
    25% {
      -webkit-transform: rotate(1deg) translate(-50%,5px);
              transform: rotate(1deg) translate(-50%,5px);
    }
    
    50% {
      -webkit-transform: rotate(0deg) translate(-50%,10px);
              transform: rotate(0deg) translate(-50%,10px);
    }
    
    75% {
      -webkit-transform: rotate(-1deg) translate(-50%,5px);
              transform: rotate(-1deg) translate(-50%,5px);
    }
    
    100% {
      -webkit-transform: rotate(0deg) translate(-50%,0px);
              transform: rotate(0deg) translate(-50%,0px);
    }
  }

  @keyframes float-ship {
    0% {
      -webkit-transform: rotate(0deg) translate(-50%,0px);
              transform: rotate(0deg) translate(-50%,0px);
    }
    25% {
      -webkit-transform: rotate(4deg) translate(-50%,5px);
              transform: rotate(4deg) translate(-50%,5px);
    }
    
    50% {
      -webkit-transform: rotate(0deg) translate(-50%,10px);
              transform: rotate(0deg) translate(-50%,10px);
    }
    
    75% {
      -webkit-transform: rotate(-4deg) translate(-50%,5px);
              transform: rotate(-4deg) translate(-50%,5px);
    }
    
    100% {
      -webkit-transform: rotate(0deg) translate(-50%,0px);
              transform: rotate(0deg) translate(-50%,0px);
    }
  }

  @keyframes rain {
    0% {
      background-position:center 0; 
    }
    100% {
      background-position:center 200%;
    }
  }

  @keyframes thunder {
    0%,25%{
        background:#1b1b1b;
    }
    60% {
        background:#1b1b1b;
    }
    70%,71% {
        background:#797979;
    }
    78% {
        background:#1b1b1b;
    }
    80%,81% {
        background:#797979;
    }
    100% {
        background:#1b1b1b;
    }
  }

  @keyframes cloud {
    0% {
      left:102%; 
    }
    100% {
      left:-10%;
    }
  }

  .container {
    height: 100%;
  }

  .scene-wrapper {
    width: 100%;
    height: 100%;
    display: inline-block;
    overflow: hidden;
    position: relative;
    background: #1b1b1b;
    -webkit-animation: thunder 4s linear infinite;
    animation: thunder 4s linear infinite;
  }

  .wave-wrap {
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 300px;
    height: 50px;
    overflow: hidden;
    transform: translateX(-50%);

    &.wave-small {
      z-index: 10;
      -webkit-animation: float 3s linear infinite;
      animation: float 3s linear infinite;
    }

    &.wave-medium {
      bottom: 0;
      height: 75px;
      z-index: 9;
      -webkit-animation: float 4s linear infinite;
      animation: float 4s linear infinite;

      .wave-block {
        background:#198fbd;
        width: 30px;
        height: 75px;
      }
    }

    &.wave-large {
      bottom: 0;
      height: 100px;
      z-index: 8;
      -webkit-animation: float 3.25s linear infinite;
      animation: float 3.25s linear infinite;

      .wave-block {
        background: #0f6688;
        width: 50px;
        height: 100px;
      }
    }

    .wave-block {
      width: 25px;
      height: 50px;
      background:#7bd1f5;
      transform: rotate(45deg) translate(0%,50%);
      float: left;
      border-top-right-radius: 20px;
      border-top-left-radius: 50px;
    }
  }

  .moon {
    z-index:99;
    position:absolute;
    top: -10px;
    right: -10px;
    width: 80px;
    height: 80px;
    display:inline-block;
    border-radius:50%;
    background: rgba(240,240,240,1);
    background: -moz-linear-gradient(45deg, rgba(240,240,240,1) 0%, rgba(209,209,209,1) 71%, rgba(209,209,209,1) 100%);
    background: -webkit-gradient(left bottom, right top, color-stop(0%, rgba(240,240,240,1)), color-stop(71%, rgba(209,209,209,1)), color-stop(100%, rgba(209,209,209,1)));
    background: -webkit-linear-gradient(45deg, rgba(240,240,240,1) 0%, rgba(209,209,209,1) 71%, rgba(209,209,209,1) 100%);
    background: -o-linear-gradient(45deg, rgba(240,240,240,1) 0%, rgba(209,209,209,1) 71%, rgba(209,209,209,1) 100%);
    background: -ms-linear-gradient(45deg, rgba(240,240,240,1) 0%, rgba(209,209,209,1) 71%, rgba(209,209,209,1) 100%);
    background: linear-gradient(45deg, rgba(240,240,240,1) 0%, rgba(209,209,209,1) 71%, rgba(209,209,209,1) 100%);
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#f0f0f0', endColorstr='#d1d1d1', GradientType=1 );
    -webkit-animation: moonspin1 60s linear infinite;
    animation: moonspin 60s linear infinite;
  }

  .moon-inner{
    position:relative;
    width:100%;
    height:100%;
    border-radius: 50%;
  }
  .moon .big{
    content:"";
    width:25px;
    height:25px;
    display:inline-block;
    border-radius:50%;
    position:absolute;
    background: #b7b7b7;
  } 
  .moon .small{
    content: "";
    width: 15px;
    height: 15px;
    display: inline-block;
    border-radius: 50%;
    position: absolute;
    background: #c5c5c5;
  } 
  .moon .big.pit1{
    top: 25px;
    left: 8px;
    width: 25px;
    height: 25px;
    box-shadow: inset 2px 1px 0px 0px grey;
  }
  .moon .small.pit1{
    top: 10px;
    left: 45px;
    width: 15px;
    height: 15px;
    box-shadow: inset 0 0 2px 0px #0000003b;
  }
  .moon .big.pit2{
    top: 45px;
    left: 50px;
    width: 20px;
    height: 20px;
    box-shadow: inset -2px 0px 0px 0px grey;
  }
  .moon .small.pit2{
    top: 56px;
    left: 17px;
    width: 15px;
    height: 15px;
    box-shadow: inset 0 0 0px 1px #00000021;
  }
  .moon .small.pit3{
    top: 8px;
    left: 20px;
    width: 10px;
    height: 10px;
    box-shadow: inset 0 0 0px 1px #00000021;
  }
  .moon .small.pit4{
    top: 70px;
    left: 41px;
    width: 6px;
    height: 6px;
    box-shadow: inset 0 0 0px 1px #00000021;
  }

  .rain-wrap{
    width:150%;
    height:300%;
    background:url(http://i.imgur.com/9d6jd7S.png);
    background-size: 75px;
    opacity:0.5;
    -webkit-animation: rain 5s linear infinite;
            animation: rain 5s linear infinite;
    transform:rotate(5deg) translateX(-20%);
    z-index:10;
    position:relative;
  }

  .ship{ background:url(http://imgur.com/V6z8Tge.png);
    background-repeat:no-repeat;
    background-size: 80px;  
      position: absolute;
      width:80px;
      height:80px;
      bottom: 15px;
      left: 60%;
      transform: translateX(-50%) translateZ(0);
      z-index: 10;
    -webkit-animation: float-ship 3.75s linear infinite;
            animation: float-ship 3.75s linear infinite;
  }

  .ship2{ background:url(http://imgur.com/V6z8Tge.png);
    background-repeat:no-repeat;
    background-size: 45px;  
      position: absolute;
      width:45px;
      height:45px;
      bottom: 25px;
      left: 20%;
      transform: translateX(-50%) translateZ(0);
      z-index: 9;
    -webkit-animation: float-ship 2.75s linear infinite;
            animation: float-ship 2.75s linear infinite;
  }

  .cloud-path{
    position:absolute;
    top:0;
    left:0;
    width:100%;
    height:35%;
  }

  .cloud-wrap{
    position:absolute;
    top:0%;
    left:110%;
        width: 50px;
      height: 40px;
    overflow:hidden;
  }

  .cloud-wrap1{
    -webkit-animation: cloud 8s linear infinite;
    animation: cloud 8s linear infinite;
    z-index:15;
    top:2%;
  }

  .cloud-wrap2{
    -webkit-animation: cloud 17s ease-in-out infinite;
    animation: cloud 17s ease-in-out infinite;
    z-index:8;
    top:5%;
  }

  .cloud-wrap3{
    -webkit-animation: cloud 35s ease-in infinite;
    animation: cloud 35s ease-in infinite;
    z-index:5;
    top:8%;
  }

  .cloud-wrap-inner{
    position:relative;
    width:100%;
    height:100%;
  }

  .bubble1{
    position:absolute;
    bottom:0;
    left:0;
    width:100%;
    height:17px;
    background:#3c3c3c;
    border-radius: 25px;
  }

  .bubble2{
    position: absolute;
      bottom: 1px;
      left: 5px;
      width: 25px;
      height: 25px;
      background: #3c3c3c;
      border-radius: 50%;
  }

  .bubble3{
    width: 20px;
      height: 20px;
      background: #3c3c3c;
      border-radius: 50%;
      position: absolute;
      bottom: 3px;
      left: 23px;
  }
</style>