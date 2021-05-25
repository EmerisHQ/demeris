<template>
  <AppLayout>
    <div class="flex space-x-16 mb-10">
      <div class="flex flex-col space-y-35 w-2/4">
        <section class="flex flex-col space-y-12">
          <div>
            <button class="font-bold py-4 flex items-center space-x-2">
              <span><ArrowLeftIcon class="w-12 h-12" /></span>
              <span>All assets</span>
            </button>
          </div>

          <div class="flex space-x-30 items-baseline">
            <div class="flex flex-col space-y-2">
              <h2 class="text-xl font-bold">300 ATOM</h2>
              <h1 class="text-2xl font-bold">$13,184.45</h1>
              <span class="text-green-700 text-medium">
                <span>15% (+$1,719.71)</span>
              </span>
            </div>

            <dl class="flex flex-col space-y-16 justify-between">
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
        </section>

        <section class="flex flex-col space-y-16">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-bold">Chains</h2>
            <button class="p-5">
              <PlusIcon class="w-11 h-11" />
            </button>
          </div>

          <!-- TODO: Move to a component -->
          <ul class="w-full flex flex-col space-y-16">
            <li class="w-full flex items-center space-x-8">
              <div class="flex-1 flex space-x-8 items-center">
                <span class="w-16 h-16 bg-gray-200 rounded-full" />
                <span class="font-bold">Cosmos Hub</span>
              </div>
              <span class="w-1/3 text-right">
                277.52 ATOM
              </span>
              <div class="w-1/3 flex space-x-8 items-center">
                <span class="flex-1 text-right font-bold">
                  $3,690.50
                </span>
                <button class="w-16 h-16 rounded-full bg-white shadow flex items-center justify-center p-4">
                  <DotsIcon />
                </button>
              </div>
            </li>

            <li class="w-full flex items-center space-x-8">
              <div class="flex-1 flex space-x-8 items-center">
                <span class="w-16 h-16 bg-gray-200 rounded-full" />
                <span class="font-bold">THORChain</span>
              </div>
              <span class="w-1/3 text-right">
                22.47 ATOM
              </span>
              <div class="w-1/3 flex space-x-8 items-center">
                <span class="flex-1 text-right font-bold">
                  $460.70
                </span>
                <button class="w-16 h-16 rounded-full bg-white shadow flex items-center justify-center p-4">
                  <DotsIcon />
                </button>
              </div>
            </li>
          </ul>
        </section>

        <section class="flex flex-col space-y-16">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-bold">Staking</h2>
            <button class="p-5">
              <PlusIcon class="w-11 h-11" />
            </button>
          </div>

          <div class="px-12 py-8 rounded-md shadow-lg flex items-center space-x-8">
            <span class="flex-1 font-bold">Rewards</span>
            <span class="text-gray-700">0.495 ATOM</span>
            <span class="font-bold">+$10.15</span>
            <button class="px-12 py-6 rounded-3xl bg-black text-white font-medium">Claim</button>
          </div>

          <ul class="w-full flex flex-col space-y-16">
            <li class="w-full flex items-center space-x-8">
              <div class="flex-1 flex items-center space-x-8">
                <span class="rounded-sm bg-gray-200 font-medium text-lg w-20 h-20 flex items-center justify-center">
                  N
                </span>
                <span class="flex-1 font-bold">
                  nylira
                </span>
              </div>

              <span class="w-1/3 text-gray-700 text-right">
                82.46 ATOM
              </span>

              <div class="w-1/3 flex items-center space-x-8 justify-end">
                <span class="font-bold">$1,690.50</span>
                <button class="p-2"><ChevronDownIcon class="w-8 h-8" /></button>
              </div>
            </li>

            <li class="w-full flex items-center space-x-8">
              <div class="flex-1 flex items-center space-x-8">
                <span class="rounded-sm bg-gray-200 font-medium text-lg w-20 h-20 flex items-center justify-center">
                  K
                </span>
                <span class="flex-1 font-bold">
                  KalpaTech
                </span>
              </div>

              <span class="w-1/3 text-gray-700 text-right">
                28.8 ATOM
              </span>

              <div class="w-1/3 flex items-center space-x-8 justify-end">
                <span class="font-bold">$590.50</span>
                <button class="p-2"><ChevronDownIcon class="w-8 h-8" /></button>
              </div>
            </li>
          </ul>
        </section>

        <section class="flex flex-col space-y-8">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-bold">Pools</h2>
            <button class="p-5">
              <PlusIcon class="w-11 h-11" />
            </button>
          </div>
        </section>
      </div>

      <div class="flex items-start justify-center">
        <LiquiditySwap class="w-2/3" />
      </div>
    </div>
  </AppLayout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import ArrowLeftIcon from '@/components/common/Icons/ArrowLeftIcon.vue';
import ChevronDownIcon from '@/components/common/Icons/ChevronDownIcon.vue';
import DotsIcon from '@/components/common/Icons/DotsIcon.vue';
import PlusIcon from '@/components/common/Icons/PlusIcon.vue';
import LiquiditySwap from '@/components/LiquiditySwap.vue';
import AppLayout from '@/layouts/AppLayout.vue';

export default defineComponent({
  name: 'Asset',

  components: {
    AppLayout,
    DotsIcon,
    PlusIcon,
    ArrowLeftIcon,
    ChevronDownIcon,
    LiquiditySwap,
  },
});
</script>
