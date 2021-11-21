import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

const numberFormats = {
  EUR: {
    currency: {
      style: 'currency',
      currency: 'EUR',
      currencyDisplay: 'symbol'
    }
  },
  USD: {
    currency: {
      style: 'currency',
      currency: 'USD',
      currencyDisplay: 'symbol'
    }
  }
}

const i18n = new VueI18n({
  numberFormats,
  locale: 'sk',
  fallbackLocale: 'sk',
  silentTranslationWarn: true
})
export default i18n
