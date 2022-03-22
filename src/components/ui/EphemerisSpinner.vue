<template>
  <div>
    <div class="ephemeris relative flex items-center justify-center w-full">
      <img class="absolute ephemeris-1" :src="ring1" alt="Gold ephemeris ring" />
      <img class="absolute ephemeris-2" :src="ring2" alt="Gold ephemeris ring" />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

import ring1 from '@/assets/images/gold-ephemeris-ring-1.png';
import ring2 from '@/assets/images/gold-ephemeris-ring-2.png';

export default defineComponent({
  name: 'EphemerisSpinner',
  setup() {
    return { ring1, ring2 };
  },
});
</script>

<style lang="scss" scoped>
$ease-out: cubic-bezier(0.165, 0.84, 0.44, 1);

.ephemeris {
  margin-bottom: 50%;
  padding-top: 50%;
}

.ephemeris-1 {
  transform: rotate(143deg);
  width: 50%;
  animation: ephemeris-1 4s $ease-out infinite;
}

.ephemeris-2 {
  transform: rotate(150deg);
  width: 65%;
  animation: ephemeris-2 4s $ease-out infinite;
}

@keyframes ephemeris-1 {
  0% {
    transform: rotate(-37deg);
  }
  50% {
    transform: rotate(143deg);
  }
  100% {
    transform: rotate(323deg);
  }
}

@keyframes ephemeris-2 {
  0% {
    transform: rotate(150deg);
  }
  50% {
    transform: rotate(-30deg);
  }
  100% {
    transform: rotate(-210deg);
  }
}
</style>
