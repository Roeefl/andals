<template>
  <v-dialog
    :value="isOpen"
    width="400"
    @click:outside="$emit('close')"
  >
    <ActionCard
      title="Customize Player"
      @cancel="$emit('close')"
      @approve="saveUserPreferences"
    >
      <form class="customize">
        <div class="inputs">
          <h3>
            Choose your nickname:
          </h3>
          <TextField :value="nickname" @input="nickname = $event" :label="null" class="nickname" />
        </div>
        <div class="avatar">
          <h3>
            Select Avatar:
          </h3>
          <BaseCarousel :height="300" :images="avatars" :selected="avatar" @selected-image="avatar = $event" />
        </div>
        <div class="choose-color">
          <h3>
            Choose your in-game player color:
          </h3>
          <ColorPicker :initialColor="color" @update="color = $event" class="color-picker" />
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
    padding: $spacer;

    & > * {
      width: 100%;
    }

    .nickname {
      width: 75%;
    }
    
    .color-picker {
      margin: $spacer auto;
    }
  }
</style>
