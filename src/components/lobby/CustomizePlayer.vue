<template>
  <v-dialog
    :value="isOpen"
    persistent
    width="400"
  >
    <ActionCard
      title="Customize Player"
      @cancel="$emit('close')"
      @approve="saveUserPreferences"
    >
      <form class="customize">
        <div class="inputs">
          <TextField :value="nickname" @input="nickname = $event" label="Choose a nickname" />
        </div>
        <div class="avatar">
          <h3>
            Select Avatar:
          </h3>
          <BaseCarousel :height="300" :images="avatars" :selected="avatar" @selected-image="avatar = $event" />
        </div>
        <div>
          <h3>
            Choose your in-game player color:
          </h3>
          <ColorPicker :initialColor="color" @update="color = $event" />
        </div>
      </form>
    </ActionCard>
  </v-dialog>
</template>

<script>
  import { mapState } from 'vuex';
  import firebaseService from '@/services/firebase';

  import ActionCard from '@/components/common/ActionCard';
  import TextField from '@/components/common/TextField';
  import ColorPicker from '@/components/common/ColorPicker';
  import BaseButton from '@/components/common/BaseButton';
  import BaseCarousel from '@/components/common/BaseCarousel';

  const avatars = Array(20).fill(0).map((avatar, a)=> ({
    src: `avatars/${a + 1}.png`
  }));

  export default {
    name: 'CustomizePlayer',
    components: {
      ActionCard,
      TextField,
      ColorPicker,
      BaseButton,
      BaseCarousel
    },
    props: {
      isOpen: {
        type: Boolean,
        default: false
      }
    },
    data: () => ({
      nickname: 'John Doe',
      color: '#409EFF',
      avatar: 0
    }),
    computed: mapState([
      'currentUser'
    ]),
    created() {
      this.avatars = avatars;

      this.nickname = this.currentUser.nickname;
      this.avatar = this.currentUser.avatar;
      this.color = this.currentUser.color;
    },
    methods: {
      saveUserPreferences: async function() {
        if (!this.currentUser || !this.currentUser.uid) return;

        this.$emit('close');
        const updatedUser = await firebaseService.updateProfile(this.nickname, this.color, this.avatar);
        this.$store.commit('setCurrentUser', updatedUser);
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  .customize {
    display: flex;
    flex-direction: column;
    align-items: center;

    .inputs {
      width: 100%;
    }

    .avatar {
      width: 100%;
    }
  }
</style>
