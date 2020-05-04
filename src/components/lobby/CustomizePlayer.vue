<template>
  <ActionCard
    title="Customize Player"
    :cancel="!isSignup"
    @cancel="$emit('close')"
    :approveText="isSignup ? 'Sign Up' : 'Confirm'"
    @approve="save"
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
      isSignup: {
        type: Boolean,
        default: false
      }
    },
    data: () => ({
      nickname: 'John Doe',
      color: '#409EFF',
      avatar: 1
    }),
    computed: mapState([
      'currentUser'
    ]),
    created() {
      this.avatars = avatars;

      if (!this.isSignup) {
        this.nickname = this.currentUser.nickname;
        this.avatar = this.currentUser.avatar;
        this.color = this.currentUser.color;
      } else {
        const rawUser = firebaseService.auth.currentUser;
        this.nickname = rawUser.displayName || this.nickname;
      }
    },
    methods: {
      createUser: async function() {
        const addedDbuser = await firebaseService.addUser(this.nickname, this.color, this.avatar);
        this.$emit('created', addedDbuser);
      },
      save: async function() {
        if (this.isSignup)
          return this.createUser();

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
