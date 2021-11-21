import Vue from 'vue'
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'

const requireComponents = require.context(
  '@/components/basic',
  false,
  /\.vue$/
)

requireComponents.keys().forEach(fileName => {
  const componentConfig = requireComponents(fileName)

  const componentName = upperFirst(
    camelCase('Basic' + fileName.replace(/^\.\//, '').replace(/\.\w+$/, ''))
  )

  Vue.component(componentName, componentConfig.default || componentConfig)
})
