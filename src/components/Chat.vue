<template>
  <div class="messages">
    <h2>
      Chat Messages
    </h2>
    <form class="form" @submit="sendMessage">
      <input v-model="newMessage" placeholder="Say hello..." />
      <Button type="submit" :disabled="!newMessage.length">
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
      sendMessage: function(e) {
        e.preventDefault();
        
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
    max-height: 320px;
    overflow-y: auto;

    .form {
      display: flex;
    }
  }
</style>