<template>
  <AppLayout>
    <div class="home">
      <div>
        <div class="p-10 flex flex-col space-y-8 w-1/2 mx-auto">
          <AssetChainsIndicator :balances="balances" denom="stake" :max-chains-count="4" />
        </div>

        <div class="p-10 flex flex-col space-y-8 w-1/5 mx-auto">
          <Alert status="error" message="Error" />
          <Alert status="warning" message="Warning" />
          <Alert status="info" message="Info" />
        </div>

        <div class="p-10 flex flex-col space-y-8 container mx-auto">
          <Pools :pools="pools" />
        </div>

        <div class="p-10 flex flex-col space-y-8 w-1/5 mx-auto">
          <Input placeholder="Example 1">
            <template #start>
              <AlertIcon />
            </template>
          </Input>

          <Input placeholder="Example 2">
            <template #end>
              <AlertIcon />
            </template>
          </Input>

          <Input placeholder="Example 3" hint="My hint message" />
        </div>

        <div class="p-10 flex flex-row w-1/5 mx-auto icons">
          <AlertIcon />
          <ArrowDownIcon />
          <ArrowUpIcon />
          <ArrowLeftIcon />
          <ArrowRightIcon />
          <CaretDownIcon />
          <CaretUpIcon />
          <CaretLeftIcon />
          <CaretRightIcon />
          <CloseIcon />
          <SwapLRIcon />
          <SwapUDIcon />
          <SendIcon />
          <ReceiveIcon />
          <HintIcon />
          <MenuIcon />
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

import AssetChainsIndicator from '@/components/assets/AssetChainsIndicator';
import AlertIcon from '@/components/common/Icons/AlertIcon.vue';
import ArrowDownIcon from '@/components/common/Icons/ArrowDownIcon.vue';
import ArrowLeftIcon from '@/components/common/Icons/ArrowLeftIcon.vue';
import ArrowRightIcon from '@/components/common/Icons/ArrowRightIcon.vue';
import ArrowUpIcon from '@/components/common/Icons/ArrowUpIcon.vue';
import CaretDownIcon from '@/components/common/Icons/CaretDownIcon.vue';
import CaretLeftIcon from '@/components/common/Icons/CaretLeftIcon.vue';
import CaretRightIcon from '@/components/common/Icons/CaretRightIcon.vue';
import CaretUpIcon from '@/components/common/Icons/CaretUpIcon.vue';
import CloseIcon from '@/components/common/Icons/CloseIcon.vue';
import HintIcon from '@/components/common/Icons/HintIcon.vue';
import MenuIcon from '@/components/common/Icons/MenuIcon.vue';
import ReceiveIcon from '@/components/common/Icons/ReceiveIcon.vue';
import SendIcon from '@/components/common/Icons/SendIcon.vue';
import SwapLRIcon from '@/components/common/Icons/SwapLRIcon.vue';
import SwapUDIcon from '@/components/common/Icons/SwapUDIcon.vue';
import Pools from '@/components/liquidity/Pools.vue';
import Alert from '@/components/ui/Alert.vue';
import Input from '@/components/ui/Input.vue';
import AppLayout from '@/layouts/AppLayout.vue';
import { useStore } from '@/store';
import { Pool } from '@/types/actions';

export default defineComponent({
  components: {
    AssetChainsIndicator,
    Pools,
    AppLayout,
    Alert,
    AlertIcon,
    ArrowDownIcon,
    ArrowUpIcon,
    ArrowLeftIcon,
    ArrowRightIcon,
    CaretDownIcon,
    CaretUpIcon,
    CaretLeftIcon,
    CaretRightIcon,
    CloseIcon,
    HintIcon,
    SwapLRIcon,
    SwapUDIcon,
    SendIcon,
    ReceiveIcon,
    MenuIcon,
    Input,
  },
  setup() {
    const store = useStore();

    const balances = computed(() =>
      store.getters['demeris/getBalances']({ address: store.getters['demeris/getKeplrAddress'] }),
    );

    const pools: Pool[] = [
      {
        id: 1,
        reserveCoinDenoms: ['atom', 'kava'],
        reserveAccountAddress: '',
        poolCoinDenom: 'atom',
        typeId: 1,
      },
      {
        id: 1,
        reserveCoinDenoms: ['atom', 'rune'],
        reserveAccountAddress: '',
        poolCoinDenom: 'atom',
        typeId: 1,
      },
      {
        id: 1,
        reserveCoinDenoms: ['luna', 'rune'],
        reserveAccountAddress: '',
        poolCoinDenom: 'luna',
        typeId: 1,
      },
    ];

    return { balances, pools };
  },
});
</script>
<style lang="scss" scoped>
.icons {
  font-size: 1.6rem;
  color: red;
}
</style>
