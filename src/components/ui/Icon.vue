<template>
  <!-- Displays an icon
		props: 
		  type: string (the icon to display)
		//-->
  <IconBase :width="width" :height="height" :icon-name="name" :view-box="viewBox">
    <component :is="currentIcon" v-if="isReady" />
  </IconBase>
</template>
<script lang="ts">
import { defineComponent, ref, shallowRef } from 'vue';

import IconBase from '@/components/common/Icons/IconBase.vue';
export default defineComponent({
  name: 'Icon',
  components: { IconBase },
  props: {
    name: {
      type: String,
      required: true,
    },
    width: {
      type: String,
      required: false,
      default: '24',
    },
    height: {
      type: String,
      required: false,
      default: '24',
    },
    viewBox: {
      type: String,
      requird: false,
      default: '0 0 24 24',
    },
  },

  setup(props) {
    const currentIcon = shallowRef('');
    const isReady = ref(false);
    import(`@/components/common/Icons/${props.name}.vue`).then(val => {
      currentIcon.value = val.default;
      isReady.value = true;
    });

    return {
      currentIcon,
      isReady,
    };
  },
});
</script>
<style lang="scss" scoped>
.icon {
  width: 2.4rem;
  height: 2.4rem;
}
</style>
