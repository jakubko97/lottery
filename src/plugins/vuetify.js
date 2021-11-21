import Vue from 'vue'
import Vuetify from 'vuetify/lib'

import i18n from '@/plugins/i18n'
import theme from './theme'

Vue.use(Vuetify)

const vuetify = new Vuetify({
  icons: {
    iconfont: 'mdi'
  },
  theme,
  lang: {
    t: (key, ...params) => i18n.t(key, params)
  }
})

export default vuetify
