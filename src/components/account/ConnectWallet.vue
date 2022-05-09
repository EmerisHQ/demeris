<template>
  <div class="connect-keplr">
    <div class="flex flex-col px-8 text-center" :class="type == 'welcome' ? 'py-8' : 'pb-8'">
      <template v-if="!isConnecting">
        <slot name="title">
          <img v-if="type !== 'welcome'" :src="keplrWalletLogo" alt="Keplr logo" class="w-12 mx-auto mb-8" />
          <h2 v-if="type === 'welcome'" class="text-3 font-bold">
            {{ $t('generic_cta.connectToEmeris') }}
          </h2>
          <h2 v-else class="text-3 font-bold">{{ $t('wallet.connect.modal1.title') }}</h2>
        </slot>

        <div class="flex-1 mt-8 leading-copy text-muted space-y-4">
          <slot name="description">
            <p>{{ $t('wallet.connect.modal1.text') }}</p>
          </slot>
        </div>

        <div class="flex items-center flex-col mt-12">
          <FeatureRunningConditional name="USE_EMERIS_EXTENSION">
            <template #deactivated>
              <Button :name="$t('wallet.connect.modal1.button')" @click="trySignIn" />
            </template>
            <div class="flex items-center flex-col gap-4">
              <Button
                :name="$t('wallet.connect.modal1.button')"
                @click="() => tryWalletSignIn(SupportedWallet.KEPLR)"
              />
              <Button
                :name="$t('wallet.connect.modal1.buttonEmeris')"
                @click="() => tryWalletSignIn(SupportedWallet.EMERIS)"
              />
            </div>
          </FeatureRunningConditional>
          <a
            v-if="type === 'welcome'"
            class="mt-4 font-medium hover:text-text p-1.5 transition-colors active:opacity-70"
            data-cy="tryTheDemoButtonConnect"
            @click="signInDemo"
          >
            {{ $t('generic_cta.tryTheDemo') }}
          </a>
          <a
            v-if="type !== 'welcome'"
            class="mt-4 font-medium hover:text-text p-1.5 transition-colors active:opacity-70"
            data-cy="tryTheDemoButtonConnect"
            @click="emitCancel"
          >
            {{ $t('generic_cta.cancel') }}
          </a>
        </div>
      </template>

      <div v-else class="flex flex-col items-center justify-center h-full w-full">
        <div class="flex-1 flex flex-col items-center justify-center">
          <Spinner :size="3" />
          <FeatureRunningConditional name="USE_EMERIS_EXTENSION">
            <template #deactivated>
              <span class="mt-6 text-muted">{{ $t('wallet.connect.modal1.opening') }}</span>
            </template>
            <span class="mt-6 text-muted"
              >{{ $t('wallet.connect.modal1.openingWallet') }} {{ capitalize(connectingWallet) }}</span
            >
          </FeatureRunningConditional>
          <p class="text-3 font-bold mt-2">{{ $t('wallet.connect.modal1.connecting') }}</p>
          <span class="mt-6 text-muted">{{
            $t('wallet.connect.modal1.connectingHelp', { extension: capitalize(connectingWallet) })
          }}</span>
        </div>
        <Button variant="link" :name="$t('generic_cta.cancel')" :click-function="cancel" class="mt-12" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { capitalize } from 'lodash';
import { computed, defineComponent, onMounted, ref, watch } from 'vue';

import keplrWalletLogo from '@/assets/images/keplr-wallet-logo.png';
import FeatureRunningConditional from '@/components/common/FeatureRunningConditional.vue';
import Button from '@/components/ui/Button.vue';
import { SupportedWallet } from '@/features/extension/types';
import { GlobalActionTypes, GlobalGetterTypes } from '@/store';
import { featureRunning } from '@/utils/FeatureManager';
import { useStore } from '@/utils/useStore';

import Spinner from '../ui/Spinner.vue';

export default defineComponent({
  name: 'ConnectWallet',

  components: {
    FeatureRunningConditional,
    Button,
    Spinner,
  },

  props: {
    type: {
      type: String,
      default: undefined,
    },
  },

  emits: ['cancel', 'connect', 'warning', 'try-demo'],

  // eslint-disable-next-line max-lines-per-function
  setup(_, { emit }) {
    const store = useStore();
    const isConnecting = ref(false);
    const isWarningAgreed = ref(null);
    const isWarningNeeded = ref(null);
    const connectingWallet = ref<SupportedWallet>(null);

    const emitCancel = () => {
      cancel();
      emit('cancel');
    };

    const cancel = () => {
      isConnecting.value = false;
    };

    const isSignedIn = computed(() => {
      return store.getters[GlobalGetterTypes.USER.isSignedIn];
    });

    const tryWalletSignIn = (walletType: SupportedWallet) => {
      if (!featureRunning('USE_EMERIS_EXTENSION')) throw new Error('should not be run with USE_EMERIS_EXTENSION off');
      connectingWallet.value = walletType;
      if (isWarningAgreed.value) {
        store.dispatch(GlobalActionTypes.USER.SIGN_IN_NEW, { walletType });
        isConnecting.value = true;
      } else {
        emit('warning');
      }
    };

    const trySignIn = () => {
      if (isWarningAgreed.value) {
        signIn();
      } else {
        emit('warning');
      }
    };

    const signIn = () => {
      store.dispatch(GlobalActionTypes.USER.SIGN_IN);
      isConnecting.value = true;
    };

    onMounted(() => {
      isWarningAgreed.value = window.localStorage.getItem('isWarningAgreed');
      isWarningNeeded.value = window.localStorage.getItem('isWarningNeeded');
    });

    const signInDemo = () => {
      store.dispatch(GlobalActionTypes.USER.SIGN_IN_WITH_WATCHER);
      isConnecting.value = true;
    };
    watch(isSignedIn, () => {
      if (isSignedIn.value) {
        emit('connect');
      }
    });

    return {
      isConnecting,
      emitCancel,
      cancel,
      keplrWalletLogo,
      trySignIn,
      signInDemo,
      tryWalletSignIn,
      SupportedWallet,
      connectingWallet,
      capitalize,
      signIn,
    };
  },
});
</script>
<style lang="scss" scoped>
a {
  cursor: pointer;
}
</style>
