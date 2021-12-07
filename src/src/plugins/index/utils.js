import Vue from 'vue'
import i18n from '@/plugins/i18n'

function formatDate (stringDate) {
  if (stringDate) {
    const date = new Date(stringDate)
    return date.toLocaleString([i18n.locale], { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })
  } else {
    return ''
  }
}

const utils = {
  formatDate: (stringDate) => formatDate(stringDate)
}

export default utils

Vue.prototype.$utils = utils
