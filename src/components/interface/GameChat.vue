<template>
  <fragment>
     <v-tabs v-if="channels.length > 0" @change="setChannel">
      <v-tab v-for="(channel, c) in channels" :key="c">
        {{ channel }}
      </v-tab>
    </v-tabs>
    <MessageList title="Chat" :messages="channelMessages" class="messages-container">
      <li v-for="(msg, i) in channelMessages" :key="i">
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
      channels: {
        type: Array,
        default: () => []
      },
      messages: {
        type: Array,
        default: []
      },
      myPlayerSessionId: {
        type: String,
        default: ''
      }
    },
    data: () => ({
      currentChannel: 'game',
      newMessage: ''
    }),
    computed: {
      channelMessages: function() {
        if (!this.channels.length) return this.messages;
        return this.messages.filter(({ channel }) => channel === this.currentChannel);
      }
    },
    methods: {
      sendMessage: function(e) {
        e.preventDefault();
        
        this.$emit('send-message', { channel: this.currentChannel, message: this.newMessage });
        this.newMessage = '';
      },
      setChannel: function(channelIndex) {
        this.currentChannel = this.channels[channelIndex]
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
    width: 90%;

    & > * {
      margin: 0 $spacer;
    }
  }
</style>