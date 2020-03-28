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
        <el-color-picker v-model="color" />
      </div>
      <Button color="primary" :onClick="submit">
        Save
      </Button>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import colyseusService from '@/services/colyseus';
  import Button from '@/components/Button';

  export default {
    name: 'Settings',
    components: {
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
      submit: function(e) {
        console.log(e);
        e.preventDefault();
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

Four sets of wooden player pieces in four different colors each containing five settlements, four cities, and 15 roads.
25 development cards consisting of 14 knight/soldier cards, 6 progress cards, and 5 victory points.
Resource cards of each terrain hex except for the desert.
Four building costs cards, one for each player.
"Longest Road" and "Largest Army" award cards.
Two dice, one red, one yellow.
Extra harbor pieces for placement of random harbors (optional).

