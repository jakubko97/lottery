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
function formatDateToTimer (stringDate) {
  if (stringDate) {
    const date = new Date(stringDate)
    var year = date.toLocaleString(['sk'], { year: 'numeric' })
    var month = date.toLocaleString(['sk'], { month: '2-digit' })
    var day = date.toLocaleString(['sk'], { day: '2-digit' })
    var hour = date.toLocaleString(['sk'], { hour: '2-digit' })
    var minute = date.toLocaleString(['sk'], { minute: '2-digit' })
    month = month.replace('.', '')
    day = day.replace('.', '')
    if (minute < 10) {
      minute = '0' + minute
    }

    return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + '00'
  } else {
    return ''
  }
}

const utils = {
  formatDate: (stringDate) => formatDate(stringDate),
   formatDateToTimer: (stringDate) => formatDateToTimer(stringDate)
}

export default utils

Vue.prototype.$utils = utils
