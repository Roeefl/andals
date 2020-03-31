<template>
  <div class="messages">
    <h2>
      Chat Messages
    </h2>
    <form class="form">
      <input v-model="newMessage" placeholder="Say hello..." />
      <Button :onClick="sendMessage" :disabled="!newMessage.length">
        Send
      </Button>
    </form>
    <ul>
      <li v-for="(msg, i) in messages" :key="i">
        <div class="message">
          {{ msg.sender }}: {{ msg.message }}
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  import colyseusService from '@/services/colyseus';
  import { MESSAGE_CHAT } from '@/store/constants';
  import Button from '@/components/Button';

  export default {
    name: 'Chat',
    components: {
      Button
    },
    props: {
      messages: {
        type: Array,
        default: []
      }
    },
    data: () => ({
      newMessage: ''
    }),
    methods: {
      sendMessage: function() {
        colyseusService.room.send({
          type: MESSAGE_CHAT,
          message: this.newMessage
        });
        this.newMessage = '';
      },
    }
  }
</script>

<style scoped lang="scss">
  .messages { 
    display: flex;
    flex-direction: column;
    color: white;

    .form {
      display: flex;
    }
  }
</style>