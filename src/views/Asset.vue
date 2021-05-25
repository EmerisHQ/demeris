<template>
  <AppLayout>
    <div class="flex space-x-16 mb-10">
      <div class="flex flex-col space-y-14 w-2/4">
        <section class="flex flex-col space-y-4">
          <div>
            <button class="font-bold py-2">
              All assets
            </button>
          </div>

          <div class="flex space-x-12">
            <div class="flex flex-col space-y-2">
              <h2 class="text-2xl font-bold">300 ATOM</h2>
              <h1 class="text-5xl font-bold">$13,184.45</h1>
              <span class="text-green-700 text-medium">
                <span>15% (+$1,719.71)</span>
              </span>
            </div>

            <dl class="flex flex-col justify-between">
              <div>
                <dt class="text-gray-700">Available</dt>
                <dd class="font-bold text-xl">$1,310.36</dd>
              </div>

              <div>
                <dt class="text-gray-700">Price</dt>
                <dd class="font-bold text-xl">$20.50</dd>
              </div>
            </dl>
          </div>
        </section>

        <section class="flex flex-col space-y-10">
          <div class="flex items-center justify-between">
            <h2 class="text-2xl font-bold">Chains</h2>
            <button class="p-2">
              <PlusIcon class="w-8 h-8" />
            </button>
          </div>

          <!-- Move to a component -->
          <ul class="w-full flex flex-col space-y-8">
            <li class="w-full flex items-center space-x-4">
              <div class="flex-1 flex space-x-4 items-center">
                <span class="w-9 h-9 bg-gray-200 rounded-full" />
                <span class="font-bold">Cosmos Hub</span>
              </div>
              <span class="w-1/3 text-right">
                277.52 ATOM
              </span>
              <div class="w-1/3 flex space-x-4 items-center">
                <span class="flex-1 text-right font-bold">
                  $3,690.50
                </span>
                <button class="w-9 h-9 rounded-full bg-white shadow-lg flex items-center justify-center p-2">
                  <DotsIcon />
                </button>
              </div>
            </li>

            <li class="w-full flex items-center space-x-4">
              <div class="flex-1 flex space-x-4 items-center">
                <span class="w-9 h-9 bg-gray-200 rounded-full" />
                <span class="font-bold">zen hub</span>
              </div>
              <span class="w-1/3 text-right">
                27312317.52 ATOM
              </span>
              <div class="w-1/3 flex space-x-4 items-center">
                <span class="flex-1 text-right font-bold">
                  $100.32
                </span>
                <button class="w-9 h-9 rounded-full bg-white shadow-lg flex items-center justify-center p-2">
                  <DotsIcon />
                </button>
              </div>
            </li>
          </ul>
        </section>

        <section class="flex flex-col space-y-8">
          <div class="flex items-center justify-between">
            <h2 class="text-2xl font-bold">Staking</h2>
            <button class="p-2">
              <PlusIcon class="w-8 h-8" />
            </button>
          </div>

          <div class="px-6 py-5 rounded-lg shadow-xl flex items-center space-x-4">
            <span class="flex-1 font-bold">Rewards</span>
            <span class="text-gray-700">0.495 ATOM</span>
            <span class="font-bold">+$10.15</span>
            <button class="px-5 py-3 rounded-3xl bg-black text-white font-medium">Claim</button>
          </div>

          <ul class="w-full flex flex-col space-y-8">
            <li class="w-full flex items-center space-x-4">
              <div class="flex-1 flex items-center space-x-4">
                <span class="rounded-lg bg-gray-200 font-medium text-lg w-10 h-10 flex items-center justify-center">
                  N
                </span>
                <span class="flex-1 font-bold">
                  nylira
                </span>
              </div>

              <span class="w-1/3 text-gray-700 text-right">
                82.46 ATOM
              </span>

              <div class="w-1/3 flex items-center space-x-4 justify-end">
                <span>$1,690.50</span>
                <button class="p-2"><ChevronDownIcon class="w-4 h-4" /></button>
              </div>
            </li>

            <li class="w-full flex items-center space-x-4">
              <div class="flex-1 flex items-center space-x-4">
                <span class="rounded-lg bg-gray-200 font-medium text-lg w-10 h-10 flex items-center justify-center">
                  K
                </span>
                <span class="flex-1 font-bold">
                  KalpaTech
                </span>
              </div>

              <span class="w-1/3 text-gray-700 text-right">
                28.8 ATOM
              </span>

              <div class="w-1/3 flex items-center space-x-4 justify-end">
                <span>$590.50</span>
                <button class="p-2"><ChevronDownIcon class="w-4 h-4" /></button>
              </div>
            </li>
          </ul>
        </section>

        <section class="flex flex-col space-y-8">
          <div class="flex items-center justify-between">
            <h2 class="text-2xl font-bold">Pools</h2>
            <button class="p-2">
              <PlusIcon class="w-8 h-8" />
            </button>
          </div>
        </section>
      </div>

      <div>
        Swap
      </div>
    </div>
  </AppLayout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import ChevronDownIcon from '@/components/common/Icons/ChevronDownIcon.vue';
import DotsIcon from '@/components/common/Icons/DotsIcon.vue';
import PlusIcon from '@/components/common/Icons/PlusIcon.vue';
import AppLayout from '@/layouts/AppLayout.vue';

export default defineComponent({
  name: 'Asset',

  components: {
    AppLayout,
    DotsIcon,
    PlusIcon,
    ChevronDownIcon,
  },
});
</script>
