<template>
  <v-card class="app-header overflow-hidden" :class="{ 'in-game': isInGame }">
    <v-app-bar
      absolute
      :color="isInGame ? 'transparent' : 'primary'"
      shrink-on-scroll
      prominent
      scroll-target="#page"
      class="app-bar"
    >
      <section class="header-buttons">
        <div v-for="item in links" :key="item.key" class="header-item" :class="{ 'home': item.key === 'lobby' }">
          <router-link v-if="!!item.to" :to="item.to" class="router-link">
            <img v-if="item.img" :src="require(`../assets/${item.img}`)" :alt="item.key" />
            <h3 v-if="item.title" class="item-title">
              {{ item.title }}
            </h3>
          </router-link>
          <ChoiceDialog v-else buttonColor="transparent" :iconName="item.icon" :iconColor="item.iconColor || (isInGame ? 'primary' : 'success')" :title="item.title" :hasCancel="false" :width="item.width">
            <AppSettings v-if="item.key === 'settings'" />
            <div v-if="item.key === 'console'" /> <!-- <DevConsole /> -->
            <BuildingCosts v-if="item.key === 'buildingCosts'"/>
          </ChoiceDialog>
        </div>
      </section>
      <section v-if="!isInGame" class="current-route">
        <h2>
          {{ this.$route.name }}
        </h2>
      </section>
      <section v-if="!isInGame" class="additional-actions">
        <BaseButton v-for="(action, a) in actions" :key="a" icon :iconName="action.icon" iconSize="24px" />
        <div class="profile-section">
          <BaseMenu
            buttonColor="secondary"
            iconColor="primary"
            iconName="account-circle"
            :buttonText="nickname"
            :items="profileActions"
            @item-clicked="$emit($event)"
          />
        </div>
      </section>
    </v-app-bar>
  </v-card>
</template>

<script>
  import AppSettings from '@/containers/AppSettings';
  import DevConsole from '@/containers/DevConsole';
  import ChoiceDialog from '@/components/common/ChoiceDialog';
  import BuildingCosts from '@/components/interface/BuildingCosts';
  import BaseButton from '@/components/common/BaseButton';
  import BaseMenu from '@/components/common/BaseMenu';

  const links = [
    {
      key: 'lobby',
      to: '/lobby',
      img: 'logo.png'
    },
    {
      key: 'settings',
      icon: 'cog',
      width: 420,
      title: 'Preferences'
    },
    {
      key: 'console',
      icon: 'console',
      width: 1400,
      title: 'Developer Console'
    },
    {
      key: 'buildingCosts',
      icon: 'city',
      width: 520,
      title: 'Building Costs',
      iconColor: 'highlight'
    }
  ];

  const actions = [
    // {
    //   icon: 'magnify'
    // },
    // {
    //   icon: 'heart'
    // },
 /*    {
      icon: 'dots-vertical'
    } */
  ];

  export default {
    name: 'AppHeader',
    components: {
      AppSettings,
      DevConsole,
      ChoiceDialog,
      BuildingCosts,
      BaseButton,
      BaseMenu
    },
    props: {
      isLoggedIn: {
        type: Boolean,
        default: false
      },
      nickname: {
        type: String,
        default: null
      }
    },
    computed: {
      isInGame: function() {
        return this.$route.name === 'Room';
      },
      profileActions: function() {
        return [
          {
            name: 'customize',
            title: 'Customize Player',
            icon: 'wrench',
            emit: 'customize-player',
            disabled: !this.isLoggedIn
          },
          {
            name: 'login',
            title: this.isLoggedIn ? 'Log Out' : 'Log In',
            icon: this.isLoggedIn ? 'logout' : 'login',
            emit: 'login'
          }
        ]
      }
    },
    created() {
      this.links = links;
      this.actions = actions;
    }
  }
</script>

<style lang="scss">
  @import '@/styles/partials';

  .app-header {
    height: $header-height;

    &.in-game {
      width: 15% !important;
      box-shadow: none !important;

      .app-bar {
        box-shadow: none !important;
      }

      .v-toolbar__content { 
        display: flex;
        justify-content: center;
      }
    }

    .app-bar {
      color: $secondary;
      height: $header-height !important;
      padding: 0;

      .header-buttons {
        display: flex;
      }
    }

    .v-toolbar__content {
      padding: 0 $spacer * 2;
      height: $header-height !important;
      overflow-y: hidden;
      display: grid;
      grid-template-columns: 45% 10% 45%;
      align-items: center !important;

      .current-route {
        justify-self: center;
      }

      .additional-actions {
        justify-self: end; 
        display: flex;

        .profile-section {
          margin-left: $spacer * 2;
        }
      }
    }
  }

  .header-item {
    width: 60px;
    height: 60px;
    border-radius: 100px;
    display: flex;
    justify-content: center;
    align-items: center;

    &.home {
      width: auto;
      margin-right: $spacer * 2;
    }

    .router-link {
      display: flex;

      .item-title {
        margin-left: $spacer;
        height: 32px;
        display: flex;
        align-items: flex-end;
        text-decoration: underline;
        font-size: $font-size-sm;
      }
    }
  }

  .header-item {
    & + & {
      margin-left: $spacer / 2;
    }
  }


  .app-header {
    &.in-game {
      .header-item {
        margin-left: 0;
      }
    }
  }
</style>
