<template>
  <div class="mountains">
    <div class="mountains-top" />
    <div class="mountain-shadow" />
  </div>
</template>

<style scoped lang="scss">
  @import '@/styles/partials';

  .mountains {
    width: 0;
    height: 0;
    border-left: 172px solid transparent;
    border-right: 172px solid transparent;
    border-bottom: 330px solid #cacdcc;

    &::after {
      content: '';
      position: absolute;
      width: 0;
      height: 0;
      border-left: 132px solid transparent;
      border-right: 132px solid transparent;
      border-bottom: 271px solid #bacedb;
      top: 63px; left: -9px;
    }
    
    &::before {
      content: '';
      position: absolute;
      width: 0;
      height: 0;
      border-left: 152px solid transparent;
      border-right: 152px solid transparent;
      border-bottom: 291px solid #c5d5ea;
      top: 45px; left: 99px;
    }

    .mountains-top {
      position: absolute;
      width: 0;
      height: 0;
      border-left: 45px solid transparent;
      border-right: 45px solid transparent;
      border-bottom: 90px solid white;
      top: 0; left: -45px;
      z-index: 2;

      &::before {
        content: '';
        position: absolute;
        width: 0;
        height: 0;
        border-left: 33px solid transparent;
        border-right: 33px solid transparent;
        border-bottom: 70px solid white;
        top: 63px; left: 89px;
      }

      &::after {
        content: '';
        position: absolute;
        width: 0;
        height: 0;
        border-left: 44px solid transparent;
        border-right: 44px solid transparent;
        border-bottom: 80px solid white;
        top: 50px; left: 207px;
      }
    }

    .mountain-shadow {
      position: absolute;
      width: 0;
      height: 0;
      border-bottom: 330px solid rgba(0, 0, 0, 0.3);
      border-right: 172px solid transparent;
      z-index: 2;

      &::before {
        content: '';
        position: absolute;
        width: 0;
        height: 0;
        border-bottom: 270px solid rgba(0, 0, 0, 0.3);
        border-right: 121px solid transparent;
        top: 60px; left: 123px;
        z-index: 2;
      }

      &::after {
        content: '';
        position: absolute;
        width: 0;
        height: 0;
        border-bottom: 291px solid rgba(0, 0, 0, 0.3);
        border-right: 152px solid transparent;
        top: 40px; left: 251px;
        z-index: 2;
      }
    }
  }
</style>