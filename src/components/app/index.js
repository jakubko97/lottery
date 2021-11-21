import Vue from 'vue'
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'

const requireComponents = require.context(
  '@/components/app',
  false,
  /\.vue$/
)

requireComponents.keys().forEach(fileName => {
  const componentConfig = requireComponents(fileName)

  const componentName = upperFirst(
    camelCase('App' + fileName.replace(/^\.\//, '').replace(/\.\w+$/, ''))
  )

  Vue.component(componentName, componentConfig.default || componentConfig)
})
