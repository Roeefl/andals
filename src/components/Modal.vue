<template>
  <el-dialog :title="title" :visible="isOpen" @close="closeModal">
    <span>
      {{ title }}
    </span>
    <slot />
    <span slot="footer" class="dialog-footer">
      <Button color="primary" :onClick="closeModal">
        Okey!
      </Button>
    </span>
  </el-dialog>
</template>

<script>
  import Button from '@/components/Button';

  export default {
    name: 'Modal',
    components: {
      Button
    },
    props: {
      isOpen: {
        type: Boolean,
        default: false
      },
      title: {
        type: String,
        default: 'Modal'
      }
    },
    methods: {
      closeModal: function() {
        this.$store.commit('closeModal');
      }
    }
  };
</script>
