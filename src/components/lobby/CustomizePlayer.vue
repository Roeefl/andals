<template>
  <div class="customize">
    <form>
      <TextField :value="nickname" @input="$emit('update-nickname', $event)" label="Choose a nickname" />
      <div class="avatar">
        <h3>
          Select Avatar:
        </h3>
        <BaseCarousel :height="300" :images="avatars" :selected="avatar" @selected-image="$emit('update-avatar', $event)" />
      </div>
      <div>
        <h3>
           Choose your in-game player color:
        </h3>
        <ColorPicker :initialColor="color" @update="$emit('update-color', $event)" />
      </div>
    </form>
  </div>
</template>

<script>
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
      TextField,
      ColorPicker,
      BaseButton,
      BaseCarousel
    },
    props: {
      nickname: {
        type: String,
        default: 'John Doe'
      },
      color: {
        type: String,
        default: '#409EFF'
      },
      avatar: {
        type: Number,
        default: 0
      }
    },
    created() {
      this.avatars = avatars;
    },
    mounted() {
      console.log(this.nickname, this.color, this.avatar);
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  .customize {
    display: flex;
    flex-direction: column;
  }
</style>
