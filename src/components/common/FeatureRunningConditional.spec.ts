import { mount } from '@vue/test-utils';

import { loadFeaturesRunning } from '@/utils/FeatureManager';

import FeatureRunningConditional from './FeatureRunningConditional.vue';

const env = { ...import.meta.env };

afterEach(() => {
  import.meta.env = env;
});

test('should render with import.meta.env when activated', () => {
  import.meta.env.FEATURE_MY_TEST = 'true';
  loadFeaturesRunning();

  const wrapper = mount(FeatureRunningConditional, {
    props: { name: 'MY_TEST' },
    slots: { default: '<h1>Enabled</h1>' },
  });
  expect(wrapper.html()).toBe('<h1>Enabled</h1>');
});

test('should render with import.meta.env when deactivated', () => {
  import.meta.env.FEATURE_MY_TEST = 'false';
  loadFeaturesRunning();

  const wrapper = mount(FeatureRunningConditional, {
    props: { name: 'MY_TEST' },
    slots: { deactivated: '<h1>Disabled</h1>' },
  });
  expect(wrapper.html()).toBe('<h1>Disabled</h1>');
});
