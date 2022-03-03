import { mount } from '@vue/test-utils'

import { loadFeaturesRunning } from '@/utils/FeatureManager'

import FeatureRunningConditional from './FeatureRunningConditional.vue'

const env = { ...process.env }

afterEach(() => {
  process.env = env
})

test('should render with process.env when activated', () => {
  process.env.VUE_APP_FEATURE_MY_TEST = 'true'
  loadFeaturesRunning()

  const wrapper = mount(FeatureRunningConditional, {
    props: { name: 'MY_TEST' },
    slots: { default: '<h1>Enabled</h1>' },
  })
  expect(wrapper.html()).toBe('<h1>Enabled</h1>')
})

test('should render with process.env when deactivated', () => {
  process.env.VUE_APP_FEATURE_MY_TEST = 'false'
  loadFeaturesRunning()

  const wrapper = mount(FeatureRunningConditional, {
    props: { name: 'MY_TEST' },
    slots: { deactivated: '<h1>Disabled</h1>' },
  })
  expect(wrapper.html()).toBe('<h1>Disabled</h1>')
})
