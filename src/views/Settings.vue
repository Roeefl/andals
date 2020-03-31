<template>
  <div class="settings">
    <h1>
      Settings Page
    </h1>
    <div>
      <input v-model="nickname" placeholder="Choose a nickname..." />
      <div>
        <span>
           Choose your in-game player color:
        </span>
        <ColorPicker :initialColor="profile.color" @update="color = $event" />
      </div>
      <Button :onClick="submit">
        Save
      </Button>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import colyseusService from '@/services/colyseus';
  import ColorPicker from '@/components/ColorPicker';
  import Button from '@/components/Button';

  export default {
    name: 'Settings',
    components: {
      ColorPicker,
      Button
    },
    data: function() {
      return {
        nickname: '',
        color: '#409EFF'
      }
    },
    created() {
      this.nickname = this.profile.nickname;
      this.color = this.profile.color;
    },
    computed: mapState([
      'profile'
    ]),
    methods: {
      submit: function() {
        if (!this.nickname || !this.nickname.length) return;

        const updatedProfile = {
          nickname: this.nickname,
          color: this.color
        };

        this.$store.commit('updateProfile', updatedProfile);
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  .settings {
    display: flex;
    flex-direction: column;
    // justify-content: center;
  }
</style>
