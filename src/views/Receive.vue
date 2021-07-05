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

      <template v-else>
        <div class="receive__main__asset">
          <p class="receive__main__asset__title w-bold">Which assets can I use?</p>
          <div class="receive__main__asset__qr">
            <div class="receive__main__asset__qr__code">
              <QrCode :value="recipientAddress" width="160" />
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
import { reactive } from '@vue/reactivity';
import { computed } from '@vue/runtime-core';
import { useStore } from 'vuex';

import ChainName from '@/components/common/ChainName.vue';
import Denom from '@/components/common/Denom.vue';
import DenomSelectModal from '@/components/common/DenomSelectModal.vue';
import QrCode from '@/components/common/QrCode.vue';
import Address from '@/components/ui/Address.vue';
import Icon from '@/components/ui/Icon.vue';
import useAccount from '@/composables/useAccount';
import { Balance, Balances } from '@/types/api';

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

    const nativeBalances = computed(() => {
      const result = [];
      // TODO: Check if denom is native to its chain
      for (const balance of allBalances.value) {
        if (!result.some((item) => item.base_denom === balance.base_denom)) {
          result.push(balance);
        }
      }
      return result;
    });

    const state = reactive({
      selectedAsset: undefined,
    });

    const recipientAddress = computed(() => {
      return store.getters['demeris/getOwnAddress']({ chain_name: state.selectedAsset.on_chain });
    });

    const goBack = () => {
      state.selectedAsset = undefined;
    };

    const assetSelectHandler = (asset: Balance) => {
      state.selectedAsset = asset;
    };

    return { balances: nativeBalances, state, recipientAddress, goBack, assetSelectHandler };
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
