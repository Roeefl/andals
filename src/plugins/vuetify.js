import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import colors from 'vuetify/lib/util/colors';

import VuejsDialog from 'vuejs-dialog';
import VuejsDialogMixin from 'vuejs-dialog/dist/vuejs-dialog-mixin.min.js';
import 'vuejs-dialog/dist/vuejs-dialog.min.css';

Vue.use(Vuetify);

Vue.use(VuejsDialog, {
  okText: 'Yes',
  cancelText: 'No',
  animation: 'fade'
});

export default new Vuetify({
  theme: {
    dark: true,
    themes: {
      dark: {
        primary: colors.blueGrey.lighten4,
        secondary: colors.grey.darken4,
        error: colors.purple.darken4,
        warning: colors.pink.lighten2,
        info: colors.indigo.lighten3,
        success: colors.indigo.lighten1,
        highlight: colors.green.darken4
      },
    },
  },
});
