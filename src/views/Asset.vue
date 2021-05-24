<template>
  <AppLayout>
    <div class="flex flex-col space-y-8">
      <div class="flex flex-col space-y-4">
        <button class="font-bold py-2">
          All assets
        </button>

        <div class="flex space-x-12">
          <div class="flex flex-col space-y-2">
            <h2 class="text-2xl">300 ATOM</h2>
            <h1 class="text-5xl">$13,184.45</h1>
            <span class="text-green-700">
              <span>15% (+$,719.71)</span>
            </span>
          </div>

          <dl class="flex flex-col justify-between">
            <div>
              <dt class="text-gray-700">Available</dt>
              <dd class="font-bold text-lg">$1,310.36</dd>
            </div>

            <div>
              <dt class="text-gray-700">Price</dt>
              <dd class="font-bold text-lg">$20.50</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import AppLayout from '@/layouts/AppLayout.vue';

export default defineComponent({
  name: 'Asset',

  components: {
    AppLayout,
  },
});
</script>
