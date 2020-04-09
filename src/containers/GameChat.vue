<template>
  <MessageList title="Chat" :messages="messages" class="messages-container">
    <li v-for="(msg, i) in messages" :key="i">
      <div>
        {{ msg.sender }}: {{ msg.message }}
      </div>
    </li>
    <form @submit="sendMessage" class="new-message">
      <TextField dark :value="newMessage" @input="newMessage = $event" label="Say hi..." />
      <Button type="submit" color="success" :disabled="!newMessage.length">
        Send
      </Button>
    </form>
  </MessageList>
</template>

<script>
  import colyseusService from '@/services/colyseus';
  import { MESSAGE_CHAT } from '@/store/constants';

  import MessageList from '@/components/common/MessageList';
  import Button from '@/components/common/Button';
  import TextField from '@/components/common/TextField';

  export default {
    name: 'GameChat',
    components: {
      MessageList,
      Button,
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
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .new-message {
    position: sticky;
    bottom: 0;
    background: rgba(black, 0.8);
    color: white;
    z-index: $zindex-chat;
    flex: 1;
    display: flex;
    align-items: center;

    & > * {
      margin: 0 $spacer;
    }
  }
</style>