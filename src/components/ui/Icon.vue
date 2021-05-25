<template>
  <!-- Displays an icon
		props: 
		  type: string (the icon to display)
		//-->
  <IconBase width="24" height="24" :icon-name="name">
    <component :is="currentIcon" v-if="isReady" />
  </IconBase>
</template>
<script lang="ts">
import { defineComponent, shallowRef } from 'vue';

import IconBase from '@/components/common/Icons/IconBase.vue';
export default defineComponent({
  name: 'Icon',
  components: { IconBase },
  props: {
    name: {
      type: String,
      required: true,
    },
  },

  setup(props) {
    const currentIcon = shallowRef('');
    let isReady = false;
    import(`@/components/common/Icons/${props.name}.vue`).then(val => {
      currentIcon.value = val.default;
      isReady = true;
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
