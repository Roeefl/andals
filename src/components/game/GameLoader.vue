<template>
  <div class="contenedor">
    <div class="sky" />
    <div class="cerros">
      <div class="nieve" />
    </div>
    <div class="cerros3" />
    <div class="base" />
    <div class="chi" />
    <div class="casa">
      <div class="ventanas">
        <div class="ventanas3" />
      </div>
    </div>
    <div class="chi3" />
    <div class="casa3">
      <div class="ventanas7">
        <div class="ventanas9" />
      </div>
    </div>
    <div class="chi7" />
    <div class="casa7">
      <div class="ventanas">
        <div class="ventanas3" />
      </div>
    </div>
    <ul>
      <li>
        <div class="arbol3" />
        <div class="arbol" />
      </li>
      <li>
        <div class="arbol3" />
        <div class="arbol" />
      </li>
      <li>
        <div class="arbol3" />
        <div class="arbol" />
      </li>
      <li>
        <div class="arbol3" />
        <div class="arbol" />
      </li>
    </ul>
    <Snowflakes :count="30" />
  </div>
</template>

<script>
  import Snowflakes from '@/components/decor/Snowflakes';

  export default {
    name: 'GameLoader',
    components: {
      Snowflakes
    }
  }
</script>

<style scoped lang="scss">
  body {
    background: black;
  }

  .sky {
    position: absolute;
    width: 500px;
    height: 30px;
    border-radius: 30px;
    background: #121212;
    margin: 121px 152px;
  }
  .sky::before {
    content: '';
    position: absolute;
    width: 300px;
    height: 30px;
    border-radius: 30px;
    background: #121212;
    margin: 30px 152px;
  }
  .sky::after {
    content: '';
    position: absolute;
    width: 231px;
    height: 30px;
    border-radius: 30px;
    background: #121212;
    margin: 60px 112px;
  }
  .cerros {
    position: absolute;
    width: 0;
    height: 0;
    border-left: 172px solid transparent;
    border-right: 172px solid transparent;
    border-bottom: 330px solid #cacdcc;
    margin: 201px 102px;
  }
  .cerros::after {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border-left: 132px solid transparent;
    border-right: 132px solid transparent;
    border-bottom: 271px solid #bacedb;
    margin: 63px -9px;
  }
  .cerros::before {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border-left: 152px solid transparent;
    border-right: 152px solid transparent;
    border-bottom: 291px solid #c5d5ea;
    margin: 45px 99px;
  }
  .cerros3 {
    position: absolute;
    width: 0;
    height: 0;
    border-bottom: 330px solid rgba(0, 0, 0, 0.3);
    border-right: 172px solid transparent;
    margin: 201px 273px;
    z-index: 333;
  }
  .cerros3::before {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border-bottom: 291px solid rgba(0, 0, 0, 0.3);
    border-right: 121px solid transparent;
    margin: 40px 123px;
    z-index: 333;
  }
  .cerros3::after {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border-bottom: 291px solid rgba(0, 0, 0, 0.3);
    border-right: 152px solid transparent;
    margin: 40px 251px;
    z-index: 333;
  }
  .nieve {
    position: absolute;
    width: 0;
    height: 0;
    border-left: 45px solid transparent;
    border-right: 45px solid transparent;
    border-bottom: 90px solid white;
    margin: 0 -45px;
    z-index: 333;
  }
  .nieve::before {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border-left: 33px solid transparent;
    border-right: 33px solid transparent;
    border-bottom: 70px solid white;
    margin: 63px 89px;
  }
  .nieve::after {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border-left: 44px solid transparent;
    border-right: 44px solid transparent;
    border-bottom: 80px solid white;
    margin: 50px 207px;
  }
  .base {
    position: absolute;
    width: 800px;
    height: 45px;
    border-radius: 90px;
    background: white;
    margin: 530px 0;
  }
  .base::before {
    content: '';
    position: absolute;
    width: 800px;
    height: 30px;
    border-radius: 90px;
    background: #c5d5ea;
    margin: 40px 0;
  }
  .casa,
  .casa3,
  .casa7 {
    position: absolute;
    width: 102px;
    height: 80px;
  }
  .casa {
    background: #dd33b0;
    border-right: 5px solid #ce08a6;
    margin: 450px 221px;
    z-index: 999;
  }
  .casa3 {
    background: #33007c;
    border-right: 5px solid #16002d;
    margin: 450px 345px;
    z-index: 999;
  }
  .casa7 {
    background: #0063dd;
    border-right: 5px solid #003989;
    margin: 450px 470px;
    z-index: 999;
  }
  .casa::before,
  .casa3::before,
  .casa7::before {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border-left: 65px solid transparent;
    border-right: 65px solid transparent;
    border-bottom: 60px solid white;
    margin: -50px -12px;
  }
  .casa::after,
  .casa3::after,
  .casa7::after {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border-left: 53px solid transparent;
    border-right: 53px solid transparent;
    border-bottom: 50px solid #dd33b0;
    margin: -39px 0px;
  }
  .casa::after {
    border-bottom: 50px solid #dd33b0;
  }
  .casa3::after {
    border-bottom: 50px solid #33007c;
  }
  .casa7::after {
    border-bottom: 50px solid #0063dd;
  }
  .ventanas,
  .ventanas7 {
    position: absolute;
    width: 21px;
    height: 30px;
    border-radius: 30px 30px 0 0;
    background: #333;
    border: 2px solid #eaeaea;
    margin: 3px 12px;
    z-index: 999;
  }
  .ventanas::before,
  .ventanas7::before {
    content: '';
    position: absolute;
    width: 21px;
    height: 30px;
    border-radius: 30px 30px 0 0;
    border: 2px solid #eaeaea;
    margin: -1px 30px;
  }
  .ventanas::before {
    background: #edca4e;
  }
  .ventanas7::before {
    background: #333;
  }
  .ventanas::after,
  .ventanas7::after {
    content: '';
    position: absolute;
    width: 21px;
    height: 30px;
    border-radius: 30px 30px 0 0;
    background: #333;
    border: 2px solid #eaeaea;
    margin: 0px 60px;
  }
  .ventanas::after {
    background: #333;
  }
  .ventanas7::after {
    background: #edca4e;
  }
  .ventanas3,
  .ventanas9 {
    position: absolute;
    width: 30px;
    height: 40px;
    border-radius: 30px 30px 0 0;
    background: #333;
    border: 2px solid #eaeaea;
    margin: 35px -6px;
  }
  .ventanas3::before,
  .ventanas9::before {
    content: '';
    position: absolute;
    width: 21px;
    height: 30px;
    border-radius: 30px 30px 0 0;
    background: #333;
    border: 2px solid #eaeaea;
    margin: 0px 35px;
  }
  .ventanas3::before {
    background: #333;
  }
  .ventanas9::before {
    background: #edca4e;
  }
  .ventanas3::after,
  .ventanas9::after {
    content: '';
    position: absolute;
    width: 21px;
    height: 30px;
    border-radius: 30px 30px 0 0;
    border: 2px solid #eaeaea;
    margin: 0px 65px;
  }
  .ventanas3::after {
    background: #edca4e;
  }
  .ventanas9::after {
    background: #333;
  }
  .chi,
  .chi3,
  .chi7 {
    position: absolute;
    width: 9px;
    height: 21px;
    background: gray;
    border-top: 3px solid white;
  }
  .chi {
    margin: 412px 305px;
  }
  .chi3 {
    margin: 412px 430px;
  }
  .chi7 {
    margin: 412px 553px;
  }
  .contenedor {
    position: relative;
    width: 800px;
    height: 600px;
    background: #0c0c0c;
    margin: 121px auto;
    overflow: hidden;
  }
  ul {
    position: absolute;
    width: 3000px;
    height: 121px;
    list-style: none;
    margin: 421px 0;
    z-index: 999;
  }
  ul li {
    display: inline-block;
  }
  ul li:nth-child(1),
  ul li:nth-child(2),
  ul li:nth-child(3),
  ul li:nth-child(4) {
    width: 0;
    height: 0;
    border-bottom: 30px solid white;
    border-left: 30px solid transparent;
  }
  ul li:nth-child(1) {
    margin: 53px 90px;
  }
  ul li:nth-child(2) {
    margin: 53px -221px;
  }
  ul li:nth-child(3) {
    margin: 53px 760px;
  }
  ul li:nth-child(4) {
    margin: 53px -690px;
  }
  ul li:nth-child(1)::before,
  ul li:nth-child(2)::before,
  ul li:nth-child(3)::before,
  ul li:nth-child(4)::before {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border-bottom: 30px solid gray;
    border-right: 30px solid transparent;
  }
  ul li:nth-child(1)::after,
  ul li:nth-child(2)::after,
  ul li:nth-child(3)::after,
  ul li:nth-child(4)::after {
    content: '';
    position: absolute;
    width: 9px;
    height: 12px;
    background: gray;
    margin: 45px -3px;
  }
  .arbol {
    position: absolute;
    width: 0;
    height: 0;
    border-bottom: 21px solid white;
    border-left: 21px solid transparent;
    margin: -9px -21px;
  }
  .arbol::before {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border-bottom: 21px solid gray;
    border-right: 21px solid transparent;
  }
  .arbol3 {
    position: absolute;
    width: 0;
    height: 0;
    border-bottom: 33px solid white;
    border-left: 33px solid transparent;
    margin: 12px -33px;
  }
  .arbol3::before {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border-bottom: 33px solid gray;
    border-right: 33px solid transparent;
  }
</style>
