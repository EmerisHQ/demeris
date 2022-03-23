// npx vitest src/components/common/FeatureRunningConditional.spec.ts
import { mount } from '@vue/test-utils';

import { loadFeaturesRunning } from '../../utils/FeatureManager';
import FeatureRunningConditional from './FeatureRunningConditional.vue';

test('should render with env when activated', () => {
  loadFeaturesRunning();
  const wrapper = mount(FeatureRunningConditional, {
    props: { name: 'MY_ENABLED_FEATURE' },
    slots: { default: '<h1>Enabled</h1>' },
  });
  expect(wrapper.html()).toBe('<h1>Enabled</h1>');
});

test('should render with env when deactivated', () => {
  loadFeaturesRunning();

  const wrapper = mount(FeatureRunningConditional, {
    props: { name: 'MY_DISABLED_FEATURE' },
    slots: { deactivated: '<h1>Disabled</h1>' },
  });
  expect(wrapper.html()).toBe('<h1>Disabled</h1>');
});
