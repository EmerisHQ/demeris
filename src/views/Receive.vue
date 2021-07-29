<template>
  <div class="receive">
    <header class="receive__header">
      <button v-if="state.selectedAsset" class="receive__header__button" @click="goBack">
        <Icon name="ArrowLeftIcon" :icon-size="1.6" />
      </button>

      <div v-if="state.selectedAsset" class="receive__header__title">
        <h2 class="s-2">Receive <Denom :name="state.selectedAsset.base_denom" /></h2>
        <p class="receive__header__title__label">on <ChainName :name="state.selectedAsset.on_chain" /></p>
      </div>

      <router-link to="/" class="receive__header__button close-button">
        <Icon name="CloseIcon" :icon-size="1.6" />
      </router-link>
    </header>

    <main class="receive__main">
      <template v-if="!state.selectedAsset">
        <div class="receive__main__select">
          <DenomSelectModal title="Receive" :assets="balances" :show-balance="true" @select="assetSelectHandler" />
        </div>
      </template>

      <template v-else-if="state.selectedAsset && recipientAddress">
        <div class="receive__main__asset">
          <p class="receive__main__asset__title w-bold">Which assets can I use?</p>
          <div class="receive__main__asset__qr" :style="gradientStyle">
            <div class="receive__main__asset__qr__code">
              <QrCode :value="recipientAddress" width="160" :color="gradientStyle.color" />
            </div>
          </div>
          <div>
            <p class="receive__main__asset__label s-minus w-bold">Your address</p>
            <Address :address="recipientAddress" :chain-name="state.selectedAsset.on_chain" readonly />
          </div>
        </div>
      </template>
    </main>
  </div>
</template>

<script lang="ts">
import { reactive, ref, toRefs } from '@vue/reactivity';
import { computed, watch } from '@vue/runtime-core';
import { useStore } from 'vuex';

import ChainName from '@/components/common/ChainName.vue';
import Denom from '@/components/common/Denom.vue';
import DenomSelectModal from '@/components/common/DenomSelectModal.vue';
import QrCode from '@/components/common/QrCode.vue';
import Address from '@/components/ui/Address.vue';
import Icon from '@/components/ui/Icon.vue';
import useAccount from '@/composables/useAccount';
import symbolsData from '@/data/symbols';
import { Balance, Balances } from '@/types/api';
import { getOwnAddress, hexToRGB } from '@/utils/basic';
import { parseCoins }  from '@/utils/basic';

const defaultColors = {
  primary: '#E1E1E1',
  secondary: '#F4F4F4',
  tertiary: '#F9F9F9',
};

export default {
  name: 'Receive',
  components: { Address, ChainName, Denom, Icon, DenomSelectModal, QrCode },

  setup() {
    const { balances } = useAccount();

    const store = useStore();

    const verifiedDenoms = computed(() => {
      return store.getters['demeris/getVerifiedDenoms'];
    });

    const allBalances = computed<Balances>(() => {
      return [
        ...(balances.value as Balances),
        ...verifiedDenoms.value.map((denom) => ({
          base_denom: denom.name,
          on_chain: denom.chain_name,
          amount: 0,
        })),
      ];
    });

    for (const testbalance of allBalances.value) {
      console.log("allBalance ", testbalance);
    }

    

    const nativeBalances = computed(() => {
      const result = [];
      const ibcBalances = [];

      console.log("length", result.length);

      
        // we can prob improve complexity of this with maps 
      for (const balance of allBalances.value) {
        if (!result.some((item) => item.base_denom === balance.base_denom)) {
          // Check if denom is native to its chain

          if (!balance.ibc) {
            result.push(balance);
            continue;
          }

          if (Object.keys(balance.ibc).length == 0) {
            result.push(balance);
          }

          if (Object.keys(balance.ibc).length > 0) {
            ibcBalances.push(balance);
          }
          
        } else {
          if (balance.ibc) {
            if (Object.keys(balance.ibc).length > 0) {
              const index = ibcBalances.findIndex((item) => item.base_denom === balance.base_denom);
              if (index != -1) {

                ibcBalances[index].amount = (+parseCoins(ibcBalances[index].amount)[0].amount + +parseCoins(balance.amount)[0].amount) + parseCoins(ibcBalances[index].amount)[0].denom;
              } else {
                ibcBalances.push(balance);
              }
            }
          } 
        } 
      }

      console.log("ibcbalances length", ibcBalances.length);

      for (const ibcBalance of ibcBalances) {
        console.log("ibcBalanc", ibcBalance);
        const index = result.findIndex((item) => item.base_denom === ibcBalance.base_denom);
        if (index != -1) {
          console.log("index", index);
          
          //result[index].amount = (+parseCoins(result[index].amount)[0].amount + +parseCoins(ibcBalance.amount)[0].amount) + parseCoins(result[index].amount)[0].denom;
          console.log("infamount1", ibcBalances[index].amount);
        }
      }
      

      return result;
    });

    const state = reactive({
      selectedAsset: undefined,
      recipientAddress: undefined,
    });

    const generateBackground = (colors: Record<string, string>) => {
      const hexArray = Object.values(colors).reverse();
      const positions = hexArray.length > 2 ? ['0%', '49%', '82%'] : ['0%', '82%'];
      const colorStops = [];

      for (const [index, hex] of Object.entries(hexArray)) {
        colorStops.push(`rgb(${hexToRGB(hex)}) ${positions[index]}`);
      }

      return `radial-gradient(
					ellipse farthest-corner at 16.67% 16.67%,
					${colorStops.join(',')}
				)`;
    };

    const gradientStyle = computed(() => {
      const colors = symbolsData[state.selectedAsset?.base_denom]?.colors;
      return {
        background: generateBackground(colors || defaultColors),
        color: colors ? '#ffffff' : '#000000',
      };
    });

    const goBack = () => {
      state.selectedAsset = undefined;
    };

    const assetSelectHandler = (asset: Balance) => {
      state.selectedAsset = asset;
    };

    const { selectedAsset, recipientAddress } = toRefs(state);
    watch(selectedAsset, async (value) => {
      if (value) {
        state.recipientAddress = await getOwnAddress({ chain_name: state.selectedAsset.on_chain });
      } else {
        state.recipientAddress = undefined;
      }
    });

    console.log ("native balances ")

    return { balances: nativeBalances, gradientStyle, state, recipientAddress, goBack, assetSelectHandler };
  },
};
</script>

<style lang="scss">
.receive {
  position: relative;
  height: 100vh;

  .denom-select-modal-wrapper,
  .chain-select-wrapper {
    box-shadow: none;
    position: relative;
    height: 100%;
  }

  .denom-select-modal-wrapper {
    // Close icon
    .title-with-goback > .icon:first-child {
      visibility: hidden;
    }
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 3rem 4rem;
    background: var(--bg);

    &__button {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 0.8rem;
      padding: 0.6rem;
    }

    .close-button {
      margin-left: auto;
    }

    &__title {
      text-align: center;

      &__label {
        color: var(--muted);
      }
    }

    &__title + .close-button {
      margin-left: 0;
    }
  }

  &__main {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 3rem;

    &__select {
      position: absolute;
      top: 0;
      width: 100%;
      max-width: 44rem;
      height: 100%;

      .denom-select-modal {
        height: 100%;
      }
    }

    &__asset {
      width: 100%;
      max-width: 36rem;

      &__title {
        text-align: center;
      }

      &__qr {
        width: 100%;
        height: 38rem;
        background: var(--border-trans);
        border-radius: 1rem;
        margin: 3.2rem auto;

        &__code {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }

      &__label {
        margin-bottom: 0.8rem;
      }
    }
  }
}
</style>
