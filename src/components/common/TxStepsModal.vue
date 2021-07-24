<template>
  <div class="denom-select-modal-wrapper" :class="{ 'elevation-panel': asWidget, 'tx-steps--widget': asWidget }">
    <GobackWithClose v-if="asWidget" @goback="emitHandler('goback')" @close="emitHandler('close')" />

    <template v-if="isTransferConfirmationOpen">
      <TransferInterstitialConfirmation
        :action="actionName"
        :step="data[0]"
        @continue="isTransferConfirmationOpen = false"
      />
    </template>

    <template v-else>
      <div class="title s-2 w-bold">
        {{ currentData.title }}
      </div>

      <div v-if="currentData && currentData.fees" class="detail">
        <PreviewSwap v-if="currentData.data.name === 'swap'" :step="currentData.data" :fees="currentData.fees" />
        <PreviewAddLiquidity
          v-else-if="['addliquidity', 'createpool'].includes(currentData.data.name)"
          :step="currentData.data"
          :fees="currentData.fees"
        />
        <PreviewWithdrawLiquidity
          v-else-if="currentData.data.name === 'withdrawliquidity'"
          :step="currentData.data"
          :fees="currentData.fees"
        />
        <PreviewRedeem
          v-else-if="currentData.data.name === 'redeem'"
          :step="currentData.data"
          :fees="currentData.fees"
        />
        <PreviewTransfer v-else :step="currentData.data" :fees="currentData.fees" />
      </div>

      <div class="warn s-minus w-normal" :class="currentData.isSwap ? '' : 'warn-transfer'">
        Non-revertable transactions. Prices not guaranteed etc.
      </div>

      <div class="button-wrapper">
        <Button :name="'Confirm and continue'" :status="'normal'" :click-function="confirm" />
      </div>
      <Modal
        v-if="feeWarning.feeWarning"
        class="fee-warning-modal"
        :modal-variant="asWidget ? 'bottom' : 'full'"
        @close="
          () => {
            feeWarning.feeWarning = false;
          }
        "
      >
        <div class="fee-warning-modal__icon-warning">
          <WarningIcon />
        </div>
        <template v-if="feeWarning.missingFees.length > 0">
          <div class="fee-warning-modal__title">{{ $t('components.feeWarningModal.missingMany') }}</div>
          <div class="fee-warning-modal__content">{{ $t('components.feeWarningModal.missingManyText') }}</div>
          <div class="fee-warning-modal__list">
            <div v-for="missing in feeWarning.missingFees" :key="missing.denom" class="fee-warning-modal__list__item">
              <CircleSymbol :chain-name="missing.chain_name" :denom="missing.denom" size="sm" variant="asset" />
              <div class="fee-warning-modal__list__item__amount">
                <AmountDisplay :amount="{ denom: missing.denom, amount: missing.amount }" />
              </div>
            </div>
          </div>
        </template>
        <template v-if="feeWarning.ibcWarning">
          <div class="fee-warning-modal__title">
            {{ $t('components.feeWarningModal.ibcWarning', { denom: feeWarning.ibcDetails.denom }) }}
          </div>
          <div class="fee-warning-modal__content">
            {{
              $t('components.feeWarningModal.ibcWarningText', {
                ibcDenom: feeWarning.ibcDetails.ibcDenom,
                chain: feeWarning.ibcDetails.chain_name,
                denom: feeWarning.ibcDetails.denom,
              })
            }}
          </div>
          <Button :name="$t('generic_cta.cancel')" />
          <Button :name="$t('generic_cta.proceed')" />
        </template>
        <template #buttons>
          <template v-if="feeWarning.missingFees.length == 1 && feeWarning.missingFees[0].denom == 'uatom'">
            <ModalButton
              :name="$t('generic_cta.cancel')"
              :click-function="
                () => {
                  emitHandler('close');
                }
              "
            />
            <ModalButton :name="$t('generic_cta.getAtom')" />
          </template>
          <template
            v-if="
              feeWarning.missingFees.length > 1 ||
                (feeWarning.missingFees.length == 1 && feeWarning.missingFees[0].denom != 'uatom')
            "
          >
            <ModalButton
              :name="$t('generic_cta.understand')"
              :click-function="
                () => {
                  emitHandler('close');
                }
              "
            />
          </template>
          <template v-if="feeWarning.ibcWarning">
            <ModalButton
              :name="$t('generic_cta.cancel')"
              :click-function="
                () => {
                  emitHandler('close');
                }
              "
            />
            <ModalButton
              :name="$t('generic_cta.proceed')"
              :click-function="
                () => {
                  feeWarning.feeWarning = false;
                }
              "
            />
          </template>
        </template>
      </Modal>
    </template>

    <TxHandlingModal
      v-if="isTxHandlingModalOpen"
      :modal-variant="asWidget ? 'bottom' : 'full'"
      :status="txstatus"
      :has-more="hasMore"
      :tx="transaction"
      :is-final="isFinal"
      @next="nextTx"
      @retry="
        () => {
          retry = true;
          nextTx();
        }
      "
      @close="
        () => {
          nextTx();
          toggleTxHandlingModal();
        }
      "
      @done="
        () => {
          emitHandler('done');
          if (transaction.name == 'swap') {
            emitHandler('reset');
          } else {
            nextTx();
            goBack();
          }
        }
      "
      @reset="emitHandler('reset')"
    />
  </div>
</template>
<script lang="ts">
import { parseCoins } from '@cosmjs/amino';
import { computed, defineComponent, onMounted, PropType, ref, watch } from 'vue';
import { RouteLocationRaw, useRouter } from 'vue-router';
import { useStore } from 'vuex';

import AmountDisplay from '@/components/common/AmountDisplay.vue';
import CircleSymbol from '@/components/common/CircleSymbol.vue';
import GobackWithClose from '@/components/common/headers/GobackWithClose.vue';
import WarningIcon from '@/components/common/Icons/ExclamationIcon.vue';
import TxHandlingModal from '@/components/common/TxHandlingModal.vue';
import Button from '@/components/ui/Button.vue';
import Modal from '@/components/ui/Modal.vue';
import ModalButton from '@/components/ui/ModalButton.vue';
import PreviewAddLiquidity from '@/components/wizard/previews/PreviewAddLiquidity.vue';
import PreviewRedeem from '@/components/wizard/previews/PreviewRedeem.vue';
import PreviewSwap from '@/components/wizard/previews/PreviewSwap.vue';
import PreviewTransfer from '@/components/wizard/previews/PreviewTransfer.vue';
import PreviewWithdrawLiquidity from '@/components/wizard/previews/PreviewWithdrawLiquidity.vue';
import TransferInterstitialConfirmation from '@/components/wizard/TransferInterstitialConfirmation.vue';
import useAccount from '@/composables/useAccount';
import { GlobalDemerisActionTypes } from '@/store/demeris/action-types';
import {
  CreatePoolData,
  FeeTotals,
  GasPriceLevel,
  IBCForwardsData,
  Step,
  StepTransaction,
  TransferData,
} from '@/types/actions';
import { Balances } from '@/types/api';
import { Amount } from '@/types/base';
import {
  feeForStep,
  feeForStepTransaction,
  msgFromStepTransaction,
  validateStepFeeBalances,
} from '@/utils/actionHandler';

export default defineComponent({
  name: 'TxStepsModal',
  components: {
    GobackWithClose,
    PreviewTransfer,
    WarningIcon,
    PreviewRedeem,
    PreviewAddLiquidity,
    PreviewWithdrawLiquidity,
    PreviewSwap,
    Button,
    ModalButton,
    TxHandlingModal,
    Modal,
    CircleSymbol,
    AmountDisplay,
    TransferInterstitialConfirmation,
  },
  props: {
    actionName: {
      type: String,
      required: true,
    },
    data: {
      type: Array as PropType<Step[]>,
      required: true,
    },
    gasPriceLevel: {
      type: String as PropType<GasPriceLevel>,
      required: true,
    },
    backRoute: {
      type: [Object, String] as PropType<RouteLocationRaw>,
      default: undefined,
    },
    asWidget: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['goback', 'close', 'transacting', 'failed', 'complete', 'reset', 'finish', 'done'],
  setup(props, { emit }) {
    const router = useRouter();
    const goBack = () => {
      if (props.backRoute) {
        router.push(props.backRoute);
        return;
      }
      router.go(-1);
    };
    const fees = ref([]);
    const retry = ref(false);
    const store = useStore();
    const hasMore = ref(false);
    const isFinal = ref(false);
    const isTransferConfirmationOpen = ref(false);
    const { balances } = useAccount();
    const feeWarning = ref({
      missingFees: [],
      ibcWarning: false,
      feeWarning: false,
      ibcDetails: {
        ibcDenom: '',
        chain_name: '',
        denom: '',
      },
    });
    onMounted(async () => {
      fees.value = await Promise.all(
        (props.data as Step[]).map(async (step) => {
          return await feeForStep(step, props.gasPriceLevel as GasPriceLevel);
        }),
      );
    });
    watch(
      () => props.data,
      async (newData) => {
        fees.value = await Promise.all(
          (newData as Step[]).map(async (step) => {
            return await feeForStep(step, props.gasPriceLevel as GasPriceLevel);
          }),
        );
      },
    );
    const txToResolve = ref({});
    const isTxHandlingModalOpen = ref(false);
    const toggleTxHandlingModal = () => {
      isTxHandlingModalOpen.value = !isTxHandlingModalOpen.value;
    };
    const transaction = ref({});
    const nextTx = () => {
      txToResolve.value['resolver']();
    };
    const currentStep = ref(0);
    const txstatus = ref('keplr-sign');
    const currentData = computed(() => {
      const currentStepData = props.data[currentStep.value];

      const modifiedData = {
        isSwap: false,
        title: '',
        fees: {},
        data: currentStepData,
      } as {
        isSwap: boolean;
        title: string;
        fees: FeeTotals;
        data: Step;
      };
      switch (currentStepData.name) {
        case 'swap':
          modifiedData.isSwap = true;
          modifiedData.title = 'Review your swap details';
          break;
        case 'transfer':
          modifiedData.isSwap = false;
          modifiedData.title = 'Review your transfer details';
          break;
        case 'redeem':
          break;
        case 'addliquidity':
          modifiedData.title = 'Review your pool liquidity details';
          break;
        case 'withdrawliquidity':
          modifiedData.title = 'Review your withdraw liquidity details';
          break;
        case 'createpool':
          modifiedData.title = 'Review your pool liquidity details';
          break;
      }
      modifiedData.fees = fees.value[currentStep.value];

      return modifiedData;
    });

    watch(
      () => currentData.value,
      async (newData) => {
        const toCheckBalances: Balances = JSON.parse(JSON.stringify(balances.value));
        feeWarning.value = await validateStepFeeBalances(newData.data, toCheckBalances, newData.fees);
      },
    );
    const confirm = async () => {
      let abort = false;

      for (let [i, stepTx] of currentData.value.data.transactions.entries()) {
        if (!abort) {
          if (currentStep.value == (props.data as Step[]).length - 1) {
            isFinal.value = true;
          }
          do {
            retry.value = false;
            transaction.value = stepTx;
            if (currentData.value.data.transactions.length > i + 1) {
              hasMore.value = true;
            } else {
              hasMore.value = false;
            }
            isTxHandlingModalOpen.value = true;
            txstatus.value = 'keplr-sign';
            let txToResolveResolver;
            const txToResolvePromise = {
              promise: new Promise((resolve) => {
                txToResolveResolver = resolve;
              }),
              resolver: txToResolveResolver,
            };

            txToResolve.value = txToResolvePromise;
            let res = await msgFromStepTransaction(stepTx);
            const feeOptions = await feeForStepTransaction(stepTx);
            const fee = {
              amount: [
                {
                  amount: '' + parseFloat(feeOptions[0].amount[props.gasPriceLevel as GasPriceLevel]) * 300000,
                  denom: feeOptions[0].denom,
                },
              ],
              gas: '300000',
            };
            let tx;
            try {
              tx = await store.dispatch(GlobalDemerisActionTypes.SIGN_WITH_KEPLR, {
                msgs: [res.msg],
                chain_name: res.chain_name,
                fee,
                registry: res.registry,
                memo: 'a memo',
              });
            } catch (e) {
              console.error(e);
              txstatus.value = 'keplr-reject';
              await txToResolve.value['promise'];
              continue;
            }
            if (tx) {
              emit('transacting');
              txstatus.value = 'transacting';
              let result;
              try {
                result = await store.dispatch(GlobalDemerisActionTypes.BROADCAST_TX, tx);
              } catch (e) {
                emit('failed');
                txstatus.value = 'failed';
                await txToResolve.value['promise'];
                abort = true;
                continue;
              }
              try {
                let status = await store.dispatch(GlobalDemerisActionTypes.GET_TX_STATUS, {
                  subscribe: true,
                  params: { chain_name: res.chain_name, ticket: result.ticket },
                });

                while (
                  status != 'complete' &&
                  status != 'failed' &&
                  status != 'IBC_receive_success' &&
                  status != 'Tokens_unlocked_timeout' &&
                  status != 'Tokens_unlocked_ack'
                ) {
                  console.log(status);
                  status = await store.getters['demeris/getTxStatus']({
                    chain_name: res.chain_name,
                    ticket: result.ticket,
                  });
                }
                // TODO: deal with status here
                console.log(status);
                emit('complete');
                txstatus.value = 'complete';

                await txToResolve.value['promise'];
              } catch (e) {
                console.log(e);
                emit('failed');
                txstatus.value = 'failed';
                await txToResolve.value['promise'];
                abort = true;
                continue;
              }
            }
          } while (retry.value);
        }
        isTxHandlingModalOpen.value = false;
      }
      if (currentStep.value == (props.data as Step[]).length - 1) {
        // At the end, emit completion
        emit('finish');
      } else {
        currentStep.value = currentStep.value + 1;
      }
    };
    const emitHandler = (event) => {
      emit(event);
    };

    watch(
      props,
      () => {
        let shouldOpenConfirmation = false;

        if (props.actionName === 'move') {
          shouldOpenConfirmation = true;
        } else if (props.actionName === 'transfer') {
          if (props.data?.[0]?.transactions[0]?.name.includes('ibc')) {
            shouldOpenConfirmation = true;
          }
        } else if (['swap', 'addliquidity'].includes(props.actionName)) {
          shouldOpenConfirmation = props.data.length > 1;
        }

        isTransferConfirmationOpen.value = shouldOpenConfirmation;
      },
      { immediate: true },
    );

    return {
      isTransferConfirmationOpen,
      emitHandler,
      txstatus,
      confirm,
      toggleTxHandlingModal,
      currentData,
      goBack,
      isTxHandlingModalOpen,
      nextTx,
      transaction,
      retry,
      hasMore,
      isFinal,
      feeWarning,
    };
  },
});
</script>

<style lang="scss" scoped>
.denom-select-modal-wrapper {
  position: relative;
  width: 100%;
  /* height: 55.8rem; */

  margin-bottom: 5rem;
  top: 0;
  left: 0;

  overflow: hidden;

  background-color: var(--surface);
  z-index: 10;

  &.tx-steps--widget > .title {
    text-align: left;
  }

  .title {
    padding: 0 2.4rem 2.4rem;
    text-align: center;
  }

  .amount-info {
    display: flex;
    justify-content: space-between;

    color: var(--text);

    padding: 0 2.4rem;
    margin-bottom: 1.6rem;
    &__type {
      &-subtitle {
        color: var(--muted);
      }
    }
    &__detail {
      color: var(--text);
      &__coin {
        display: flex;
        align-items: center;
        &-image {
          width: 2rem;
          height: 2rem;
        }
        &-amount {
          padding: 0 0.8rem;
        }
      }
      &-chain {
        text-align: right;
      }
    }
  }

  .divider {
    margin: 0 2.4rem;
    height: 1px;
    background-color: var(--border-trans);
  }

  .detail {
    padding: 0 2.4rem;
    &__title {
      color: var(--text);
      padding: 1.6rem 0;
    }

    &__row {
      display: flex;
      justify-content: space-between;
      padding-bottom: 1.6rem;

      &-key {
        display: flex;
        align-items: center;
        color: var(--muted);

        div {
          margin-right: 0.4rem;
        }
      }
    }
  }

  .detail-transfer {
    @extend .detail;

    .detail__title {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .icon {
      font-size: 1.6rem;
      color: var(--muted);
    }
  }

  .warn {
    margin: 0 2.4rem;
    padding: 1.2rem;
    border: 1px solid var(--border-trans);
    color: var(--muted);
    border-radius: 8px;
  }

  .warn-transfer {
    border: none;
    padding: 0;
  }

  .button-wrapper {
    padding: 2.8rem 2.4rem 2.4rem;
  }
  .fee-warning-modal {
    text-align: center;
    &__icon {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 2.4rem 0;

      &-warning {
        font-size: 4.2rem;
        display: flex;
        justify-content: center;
        color: var(--warning);
      }
    }
    &__title {
      font-size: 2.1rem;
      font-weight: bold;
      margin: 3rem 0rem;
      padding: 0rem 2rem;
    }
    &__content {
      opacity: 0.67;
      margin-bottom: 3rem;
      font-size: 1.6rem;
      &__header {
        text-align: center;
      }
    }
    &__list {
      margin-bottom: 3rem;
      padding-left: 39%;
      &__item {
        display: flex;
        margin: 1rem 0rem;
        align-items: center;
        .circle-symbol {
          margin-right: 1rem;
        }
        &__amount {
          font-weight: bold;
          font-size: 1.6rem;
        }
      }
    }
  }
}
</style>
