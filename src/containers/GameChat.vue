<template>
  <fragment>
    <MessageList title="Chat" :messages="messages" class="messages-container">
      <li v-for="(msg, i) in messages" :key="i">
        <div>
          {{ msg.sender }}: {{ msg.message }}
        </div>
      </li>
    </MessageList>
    <form @submit="sendMessage" class="new-message">
      <TextField :value="newMessage" @input="newMessage = $event" label="Say hi..." />
      <BaseButton type="submit" color="success" :disabled="!newMessage.length">
        Send
      </BaseButton>
    </form>
  </fragment>
</template>

<script>
  import colyseusService from '@/services/colyseus';
  import { MESSAGE_CHAT } from '@/constants';

  import MessageList from '@/components/common/MessageList';
  import BaseButton from '@/components/common/BaseButton';
  import TextField from '@/components/common/TextField';

  export default {
    name: 'GameChat',
    components: {
      MessageList,
      BaseButton,
      TextField
    },
    props: {
      messages: {
        type: Array,
        default: []
      },
      myPlayerSessionId: {
        type: String,
        required: true
      }
    },
    data: () => ({
      newMessage: ''
    }),
    methods: {
      sendMessage: function(e) {
        e.preventDefault();
        
        colyseusService.room.send({
          type: MESSAGE_CHAT,
          message: this.newMessage
        });

        this.newMessage = '';
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';
  $zindex-chat: 25;

  .messages-container {
    padding: $spacer / 2;
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .new-message {
    position: absolute;
    bottom: 0px;
    left: 0px;
    background: $success;
    color: $primary;
    z-index: $zindex-chat;
    display: flex;
    align-items: center;

    & > * {
      margin: 0 $spacer;
    }
  }
</style>