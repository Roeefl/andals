<template>
  <div class="customize">
    <form>
      <TextField :value="nickname" @input="nickname = $event" label="Choose a nickname" />
      <div>
        <span>
           Choose your in-game player color:
        </span>
        <ColorPicker :initialColor="color" @update="color = $event" />
      </div>
    </form>
  </div>
</template>

<script>
  import TextField from '@/components/common/TextField';
  import ColorPicker from '@/components/common/ColorPicker';
  import BaseButton from '@/components/common/BaseButton';

  export default {
    name: 'CustomizePlayer',
    components: {
      TextField,
      ColorPicker,
      BaseButton
    },
    props: {
      storedName: {
        type: String,
        default: 'John Doe'
      },
      storedColor: {
        type: String,
        default: '#409EFF'
      }
    },
    data: () => ({
      nickname: '',
      color: '#409EFF'
    }),
     watch: {
      storedName: function(newName) {
        if (newName !== this.nickname) this.nickname = newName; // reverted by cancelling the dialog
      },
      storedColor: function(newColor) {
        if (newColor !== this.color) this.color = newColor; // reverted by cancelling the dialog
      }
    },
    created() {
      this.nickname = this.storedName;
      this.color = this.storedColor;
    },
    updated() {
      const updatedProfile = {
        nickname: this.nickname,
        color: this.color
      };

      this.$emit('saved', updatedProfile)
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
