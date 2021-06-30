<template>
  <AppLayout>
    <div class="home">
      <div>
        <div class="p-10 flex flex-col space-y-8 w-1/2 mx-auto">
          <AssetChainsIndicator :balances="balances" denom="uatom" :max-chains-count="4" />
          <AssetChainsIndicator :balances="balances" denom="uakt" :max-chains-count="4" />
        </div>

        <div class="p-10 flex flex-col space-y-8 w-1/3 mx-auto">
          <Alert status="error" message="Error" />
          <Alert status="warning" message="Warning" />
          <Alert status="info" message="Info" />
        </div>

        <div class="p-10 flex flex-col space-y-8 w-1/3 mx-auto">
          <Address address="cosmos1c9x3ymwqwegu3fzdlvn5pgk7cqglze0zzn9xkg" chain-name="Cosmos Hub" readonly />
          <Address v-model:address="address" chain-name="Terra" />
        </div>

        <div class="p-10 flex flex-col space-y-8 container mx-auto">
          <Pools :pools="pools" />
        </div>

        <div class="p-10 flex flex-col space-y-8 w-1/3 mx-auto">
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

        <div class="p-10 flex flex-row w-1/3 mx-auto icons">
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
          <Button name="Send Message" @click="sendMessage" />
        </div>
        <template v-if="action">
          <TxStepsModal :data="action" fee-level="average" />
        </template>
        <div class="p-10 flex flex-col space-y-8 w-1/3 mx-auto">
          <Button name="Send Transaction From Step" @click="sendStepTx" />
        </div>
        <div class="p-10 flex flex-col space-y-8 w-1/3 mx-auto">
          <Button name="Open Confirmation" @click="modalIsOpen = 'confirmation'" />
          <Confirmation
            :open="modalIsOpen === 'confirmation'"
            title="Discard transfer?"
            description="Your KAVA will remain on Kava chain, will not be transferred to Cosmos Hub, and will not be swapped."
            no-text="Cancel"
            yes-text="Discard"
            @close="modalIsOpen = false"
            @no="modalIsOpen = false"
          />

          <Button name="Open Modal Fullscreen" @click="modalIsOpen = 'fullscreen'" />
          <Modal :open="modalIsOpen === 'fullscreen'" variant="fullscreen" @close="modalIsOpen = false">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni placeat accusamus, quam repudiandae odio
            similique recusandae. Vitae aspernatur eos ad dignissimos, architecto odio quod optio reprehenderit, omnis
            nihil eveniet molestiae!
          </Modal>

          <div
            class="border rounded-lg overflow-hidden elevation-card relative p-10"
            :style="{ width: '30rem', height: '30rem' }"
          >
            <Button name="Send Transaction" @click="modalIsOpen = 'send'" />

            <Modal :open="modalIsOpen === 'send'" variant="bottom" @close="modalIsOpen = false">
              Signing transaction...
            </Modal>
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
import TxStepsModal from '@/components/common/TxStepsModal.vue';
import Pools from '@/components/liquidity/Pools.vue';
import Address from '@/components/ui/Address.vue';
import Alert from '@/components/ui/Alert.vue';
import Button from '@/components/ui/Button.vue';
import Confirmation from '@/components/ui/Confirmation.vue';
import Input from '@/components/ui/Input.vue';
import Modal from '@/components/ui/Modal.vue';
import AppLayout from '@/layouts/AppLayout.vue';
import { useStore } from '@/store';
import { GlobalDemerisActionTypes } from '@/store/demeris/action-types';
import { GasPriceLevel, IBCForwardsData, Pool, StepTransaction } from '@/types/actions';
import { actionHandler, feeForStepTransaction, msgFromStepTransaction } from '@/utils/actionHandler';

export default defineComponent({
  components: {
    AssetChainsIndicator,
    Pools,
    AppLayout,
    Address,
    Alert,
    TxStepsModal,
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
    Confirmation,
  },
  setup() {
    const store = useStore();

    const balances = computed(() =>
      store.getters['demeris/getBalances']({ address: store.getters['demeris/getKeplrAddress'] }),
    );
    const action = ref(null);
    const pools: Pool[] = [
      {
        id: 1,
        reserve_coin_denoms: ['uatom', 'ukava'],
        reserve_account_address: '',
        pool_coin_denom: 'atom',
        type_id: 1,
      },
      {
        id: 1,
        reserve_coin_denoms: ['uatom', 'urune'],
        reserve_account_address: '',
        pool_coin_denom: 'atom',
        type_id: 1,
      },
      {
        id: 1,
        reserve_coin_denoms: ['uluna', 'urune'],
        reserve_account_address: '',
        pool_coin_denom: 'luna',
        type_id: 1,
      },
    ];
    const sendMessage = async () => {
      const steps = await actionHandler({
        name: 'transfer',
        params: {
          from: {
            amount: {
              amount: '10000000',
              denom: 'uatom',
            },
            chain_name: 'cosmos-hub',
          },
          to: {
            chain_name: 'akash',
          },
        },
      });
      console.log(steps);
      action.value = steps;
    };
    const sendStepTx = async () => {
      const stepTx = {
        name: 'ibc_forward',
        status: 'pending',
        data: {
          amount: { amount: '1000000', denom: 'uakt' },
          from_chain: 'akash',
          to_chain: 'cosmos-hub',
          to_address: store.getters['demeris/getOwnAddress']({ chain_name: 'cosmos-hub' }),
          through: 'channel-0',
        } as IBCForwardsData,
      } as StepTransaction;
      /*
        {
          name: 'createpool',
          status: 'pending',
          data: {
            coinA: {
              amount: '10000000',
              denom: 'ibc/4129EB76C01ED14052054BB975DE0C6C5010E12FFD9253C20C58BCD828BEE9A5',
            },
            coinB: { amount: '10000000', denom: 'uatom' },
          } as CreatePoolData,
        } as StepTransaction;
      /*
      const stepTx = {
        name: 'transfer',
        status: 'pending',
        data: {
          amount: { amount: '20', denom: 'uatom' },
          chain_name: 'cosmos-hub',
          to_address: 'cosmos1y6pay0rku23fe6v249k5wy042p9tm3pzwxyveg',
        } as TransferData,
      } as StepTransaction;
      */

      let res = await msgFromStepTransaction(stepTx as StepTransaction);
      const feeOptions = await feeForStepTransaction(stepTx as StepTransaction);
      const fee = {
        amount: [{ amount: '' + feeOptions[0].amount[GasPriceLevel.AVERAGE], denom: feeOptions[0].denom }],
        gas: '300000',
      };

      let tx = await store.dispatch(GlobalDemerisActionTypes.SIGN_WITH_KEPLR, {
        msgs: [res.msg],
        chain_name: res.chain_name,
        fee,
        registry: res.registry,
        memo: 'a memo',
      });

      let result = await store.dispatch(GlobalDemerisActionTypes.BROADCAST_TX, tx);
      const txPromise = store.dispatch(GlobalDemerisActionTypes.GET_TX_STATUS, {
        subscribe: true,
        params: { chain_name: res.chain_name, ticket: result.ticket },
      });

      return txPromise;
    };
    const address = ref('terra1c9x3ymwqwegu3fzdlvn5pgk7cqglze0zzn9xkg');
    const modalIsOpen = ref(false);

    return { balances, pools, address, modalIsOpen, sendMessage, sendStepTx, action };
  },
});
</script>
<style lang="scss" scoped>
.icons {
  font-size: 1.6rem;
  color: red;
}
</style>
