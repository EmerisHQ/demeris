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

        <div class="p-10 flex flex-col space-y-8 w-1/4 mx-auto">
          <Address address="cosmos1c9x3ymwqwegu3fzdlvn5pgk7cqglze0zzn9xkg" chain-name="Cosmos Hub" readonly />
          <Address v-model:address="address" chain-name="Terra" />
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

        <div class="p-10 flex flex-col space-y-8 w-1/3 mx-auto">
          <div
            class="border rounded-lg overflow-hidden elevation-card relative p-10"
            :style="{ width: '30rem', height: '30rem' }"
          >
            <Button name="Send Transaction" @click="modalIsOpen = true" />

            <Modal :open="modalIsOpen" variant="bottom" @close="modalIsOpen = false"> Signing transaction... </Modal>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';

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
import Address from '@/components/ui/Address.vue';
import Alert from '@/components/ui/Alert.vue';
import Button from '@/components/ui/Button.vue';
import Input from '@/components/ui/Input.vue';
import Modal from '@/components/ui/Modal.vue';
import AppLayout from '@/layouts/AppLayout.vue';
import { useStore } from '@/store';
import { Pool } from '@/types/actions';

export default defineComponent({
  components: {
    AssetChainsIndicator,
    Pools,
    AppLayout,
    Address,
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
    Modal,
    Button,
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

    const address = ref('terra1c9x3ymwqwegu3fzdlvn5pgk7cqglze0zzn9xkg');
    const modalIsOpen = ref(false);

    return { balances, pools, address, modalIsOpen };
  },
});
</script>
<style lang="scss" scoped>
.icons {
  font-size: 1.6rem;
  color: red;
}
</style>
