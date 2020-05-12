<template>
  <div class="wrapper">
    <div class="cloud-bg"></div>
    <div class="mountain small">
      <svg class="peak" width="178" height="112">
        <polyline points="89,0 0,112 
                          40,95 56,112 
                          89,70 110,70
                          125,90 145,70" fill="#ffffff" stroke-width="1" stroke="#ffffff" />
      </svg>
    </div> 
    <ul class="clouds-list">
      <li class="cloud cloud-big cloud-light"></li> 
      <li class="cloud cloud-small cloud-light"></li> 
      <li class="cloud cloud-big cloud-dark"></li>  
      <li class="cloud cloud-small cloud-dark"></li> 
    </ul>  
    <div class="mountain">
      <svg class="peak" width="254" height="320">
        <polyline points="127,0 16,140 
                          26,140 56,110 
                          127,160 160,90
                          185,90 185,120
                          213,110 127,0" fill="#ffffff" stroke-width="1" stroke="#ffffff"/>
      </svg>
      <svg class="shadow">
      <polyline points="338,0 338,60 
                        300,135 300,200
                        370,250 320,380
                        260,350 150,600
                        773,550" fill="#51607D" stroke-width="1" stroke="#51607D"/>
      </svg>
    </div>
    <div class="hill hill-right"></div>
    <div class="hill hill-left"></div>
    <ul class="trees-list">
      <li class="tree tree-dark"></li>
      <li class="tree tree-dark"></li>
      <li class="tree tree-dark"></li>
      <li class="tree tree-dark"></li>
      <li class="tree tree-light"></li>
      <li class="tree tree-light"></li>
      <li class="tree tree-light"></li>
    </ul>     
  </div>
</template>

<style scoped lang="scss">
  $dark-green: #044946;
  $light-green: #38845E;
  $cloud-color: #E4EFF3;

  .wrapper {
    background: #96DCF5;
    position: relative;
    overflow: hidden;
    width: 100%;
    height: 100%;
  }

  .cloud-bg {  
    position:absolute;
    top:40%;
    bottom:0;
    left:0;
    right:0;
    background-color:$cloud-color;

    &::before {
      content:'';
      position:absolute;
      height:4em;
      width:4em;
      background-color:$cloud-color;
      bottom:110%;
      left:250px;
      border-radius:50%;
      box-shadow: -100px 50px 0 4em $cloud-color, 
        -250px 100px 0 2em $cloud-color,
        75px 100px 0 5em $cloud-color,
        250px 25px 0 4em $cloud-color,
        370px 25px 0 0 $cloud-color,
        400px 125px 0 5em $cloud-color,
        500px 50px 0 2em $cloud-color,
        590px 75px 0 0 $cloud-color,
        690px 75px 0 3em $cloud-color;
    }
  }
  
  .peak {
    position:absolute;
    right:0;
    top:0;
    transform: translate(50%);
  }

  .shadow {
    position:absolute;
    right:0;
    top:0;
    transform: translate(50%);
    opacity:0.7;
    width: 676px;
    height: 540px;
  }

  .mountain {
    position:absolute;
    bottom:0;
    left:-90px;
    border-width:38em 30em;
    border-style:solid;
    border-color:transparent transparent #93A4B4 transparent;  

    &.small {
      position:absolute;
      bottom:0;
      left:30%;
      border-width:33em 26em;
      border-style:solid;
      border-color:transparent transparent #657084 transparent;

      &::after {
        content:'';
        position:absolute;
        left:100%;
        top:100%;
        border-width:33em 26em;
        border-style:solid;
        border-color:transparent transparent #474f5d #474f5d; 
        opacity:0.5;
      }
    }
  }

  .clouds-list {
    margin:0;
    padding:0;
    list-style:none;

    li {
      &:nth-child(1){
        top:55%;
        left:25%;   
        z-index:1;
      }
      &:nth-child(2){
        top:47%;
        left:43%;  
        z-index:1;
      }
      &:nth-child(3){
        top:50%;
        left:70%;  
        font-size:0.75em
      }
      &:nth-child(4){
        top:40%;
        left:55%;   
        font-size:0.75em
      }
    }
  }

  .cloud {
    -webkit-animation: move-cloud 20s linear infinite;
    animation: move-cloud 20s linear infinite;
    font-size:1.25em;

    position:absolute;  
    height:1em;
    border-radius:1em;

    &.cloud-big {
      width: 12.25em;

      &::before {
        content:'';
        position:absolute;
        bottom:40%;
        right:20%;
        height:1.25em;
        width:1.25em;
        border-radius:50%;
        background-color: inherit;
      }
    }

    &.cloud-small {
      width:5em;
      
      &::before {
        content:'';
        position:absolute;
        bottom:0;
        left:15%;
        height:2.25em;
        width:2.25em;
        border-radius:50%;
        background-color: inherit;
      }
    }

    &.cloud-dark {
      background: #BFD5E0;
      
      &.cloud-big {
        color:#BFD5E0;

        &::before{
          box-shadow:-1.5em -0.2em 0 0.5em currentColor,
            -6em -0.5em 0 0.75em currentColor,
            -8.75em -1.15em 0 1.5em currentColor;        
        }
      }
    }

    &.cloud-light {   
      background: #E4EFF3;

      &.cloud-big {
        color: #E4EFF3;
        
        &::before {
          box-shadow:-1.5em -0.2em 0 0.5em currentColor,
            -6em -0.5em 0 0.75em currentColor,
            -8.75em -1.15em 0 1.5em currentColor;        
        }
      }
    }
  }

  .hill {
    position:absolute;
    bottom:0;
    border-width:10em 20em;
    border-style: solid;

    &.hill-right {    
      right:0;    
      border-color:transparent $light-green $light-green transparent;
    }

    &.hill-left {
      z-index:2;
      left:0;
      border-color:transparent transparent $dark-green $dark-green;    
    }
  }

  .trees-list {
    list-style:none;
    padding:0;
    margin:0;

    li{
      &:nth-child(1){
      top:56%;
      left:25%;    
      }
      &:nth-child(2){
        font-size:0.75em;
        top:65%;
        left:32%;    
      }
      &:nth-child(3){
        font-size:1.25em;
        top:58%;
        left:73%;  
      }
      &:nth-child(4){
        font-size:1.25em;
        top:50%;
        left:88%;
      }
      &:nth-child(5){
        font-size:2em;
        top:40%;
        left:10%;
      }
      &:nth-child(6){
        font-size:0.75em;
        top:72%;
        left:55%;
      }
      &:nth-child(7){
        top:62%; 
        left:61%;
      }
    }
  }

  .tree {
    position:absolute;
    border-width:2.5em 1.5em;
    border-style:solid;

    &::before, &::after{
      content:'';
      position:absolute;    
      top:0;
      left:0;
      border-style:solid;
    }

    &::before{    
      border-width:3em 2em;
      transform:translate(-50%, -25%);
    }

    &::after{    
      border-width:3.5em 2.5em;    
      transform:translate(-50%, -5%);
    }

    &.tree-light{
      color:#38845E;
      border-color:transparent transparent currentColor transparent;
      &::before, &::after{
        border-color:transparent transparent currentColor transparent;
      }
    }
    &.tree-dark{
      color:#044946;
      border-color:transparent transparent currentColor transparent;
      &::before, &::after{
        border-color:transparent transparent currentColor transparent;
      }    
    }
  }

  @-webkit-keyframes move-cloud{
    0%{
      -webkit-transform:translateX(0);
      transform:translateX(0)
    }
    100%{
      -webkit-transform:translateX(-200%);
      transform:translateX(-200%)
    }
  }

  @keyframes move-cloud{
    0%{
      -webkit-transform:translateX(0);
      transform:translateX(0)
    }
    100%{
      -webkit-transform:translateX(-200%);
      transform:translateX(-200%)
    }
  }
</style>