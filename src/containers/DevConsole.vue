<template>
  <v-treeview open-on-click :items="nodes" class="dev-console" />
</template>

<script>
  import { mapState } from 'vuex';

  export default {
    name: 'DevConsole',
    computed: {
      nodes: function() {
        return [
          {
            id: 'root',
            name: 'Root',
            children: this.parseObject(this.roomState)
          }
        ];
      },
      ...mapState([
        'roomState'
      ])
    },
    created() {
      console.log(Object.entries(this.roomState));
    },
    methods: {
      parseObject: function(obj) {
        return Object
          .entries(obj)
          .map(([key, value]) => {
            let children = [];
            let stringValue = ''

            if (Array.isArray(value)) children = value.map((child, c) => ({ id: c, name: [c, child].join(': '), children: [] }));
            else if (typeof value === 'object') children = [];
            else stringValue = value;

            return {
              id: key,
              name: [key, stringValue].join(': '),
              children
            };
          });
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '@/styles/partials';

  .dev-console {
    font-size: $font-size-md;
  }
</style>
