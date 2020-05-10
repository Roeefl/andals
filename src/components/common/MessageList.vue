<template>
  <div @scroll="isScrollNeeded = true">
    <h2 v-if="title">
      {{ title }}
    </h2>
    <ul ref="messages" class="messages" @scroll="isScrollNeeded = true">
      <slot />
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'MessageList',
    props: {
      title: {
        type: String,
        default: null
      },
      messages: {
        type: Array,
        default: []
      }
    },
    data: () => ({
      isScrollNeeded: true
    }),
    watch: {
      messages: function(newMessages, oldMessages) {
        if (newMessages.length > oldMessages.length) {
          // @TODO: Add another condition only for GameChat:
          // newMessages[newMessages.length - 1].senderSessionId === this.myPlayerSessionId
          setTimeout(
            () => this.goToBottom(),
            200
          );
        }
      }
    },
    methods: {
      goToBottom() {
        let { messages } = this.$refs;
        messages.scrollTop = messages.scrollHeight;
        this.isScrollNeeded = false;
      }
    }
  }
</script>

<style scoped lang="scss">
  .messages {
    flex: 1;
    display: flex;
    flex-direction: column;
    max-height: 90%;
    overflow-y: auto;
    position: relative;
  }
</style>