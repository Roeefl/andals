import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import colors from 'vuetify/lib/util/colors';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    dark: true,
    themes: {
      dark: {
        primary: colors.blueGrey.lighten4,
        secondary: colors.grey.darken4,
        error: colors.pink.darken3,
        warning: colors.red.lighten2,
        info: colors.indigo.lighten3,
        success: colors.indigo.lighten1,
        highlight: colors.teal.lighten2
      },
    },
  },
});
