<template>
  <div>
    <ConnectWalletModal
      :open="connectModalOpen"
      @close="
        () => {
          connectModalOpen = false;
        }
      "
    />
    <div
      class="w-full top-0 left-0 z-10"
      :class="{
        'relative overflow-hidden bg-surface shadow-panel rounded-2xl': variant === 'widget',
        'flex-1 flex flex-col items-stretch': variant !== 'widget',
      }"
    >
      <GobackWithClose v-if="variant === 'widget'" @goback="emitHandler('close')" @close="emitHandler('close')" />
      <template v-if="!isTxHandlingModalOpen && isTransferConfirmationOpen">
        <TransferInterstitialConfirmation
          :action="actionName"
          :step="data[0]"
          @continue="
            isTransferConfirmationOpen = false;
            interstitialProceed = true;
          "
        />
      </template>

      <template v-else>
        <div v-show="!isTxHandlingModalOpen || variant === 'widget'" class="w-full max-w-lg mx-auto">
          <h1 class="font-bold" :class="variant === 'widget' ? 'px-6 text-2 text-left' : 'py-8 text-3 text-center'">
            {{ currentData.title }}
          </h1>

          <div v-if="currentData && currentData.fees" :class="variant === 'widget' ? 'px-6 py-6' : 'py-8'">
            <PreviewSwap
              v-if="currentData.data.name === 'swap'"
              :step="currentData.data"
              :fees="currentData.fees"
              :context="variant"
              :class="{ '-text-1': variant === 'widget' }"
            />
            <PreviewAddLiquidity
              v-else-if="['addliquidity', 'createpool'].includes(currentData.data.name)"
              :step="currentData.data"
              :fees="currentData.fees"
              :context="variant"
            />
            <PreviewWithdrawLiquidity
              v-else-if="currentData.data.name === 'withdrawliquidity'"
              :step="currentData.data"
              :fees="currentData.fees"
              :context="variant"
            />
            <PreviewRedeem
              v-else-if="currentData.data.name === 'redeem'"
              :step="currentData.data"
              :fees="currentData.fees"
              :context="variant"
            />
            <PreviewTransfer
              v-else
              :step="currentData.data"
              :fees="currentData.fees"
              :gas-price-level="gasPriceLevel"
              :context="variant"
              :class="{ '-text-1': variant === 'widget' }"
            />
          </div>

          <div class="max-w-md mx-auto -text-1 text-muted text-center leading-copy px-6">
            Once executed, transactions cannot be reverted. By continuing, you agree to our
            <a class="underline" href="https://emeris.com/terms" rel="noopener noreferrer">Terms of Service</a>.
          </div>

          <div class="py-6 max-w-sm mx-auto" :class="{ 'px-6': variant === 'widget' }">
            <Button v-if="!isDemoAccount" :name="'Confirm and continue'" variant="primary" :click-function="confirm" />
            <Button v-else :name="'Connect Wallet'" variant="primary" :click-function="confirm" />
          </div>
        </div>
        <Modal
          v-if="feeWarning.feeWarning"
          class="text-center"
          :variant="variant === 'widget' ? 'bottom' : 'dialog'"
          :fullscreen="variant === 'default'"
          @close="
            () => {
              feeWarning.feeWarning = false;
            }
          "
        >
          <template v-if="feeWarning.missingFees.length > 0">
            <div class="text-1 font-bold mb-4">{{ $t('components.feeWarningModal.missingMany') }}</div>
            <div class="text-muted leading-copy mb-4">{{ $t('components.feeWarningModal.missingManyText') }}</div>
            <div class="mb-8 flex flex-col items-center">
              <div v-for="missing in feeWarning.missingFees" :key="missing.denom" class="flex py-4 items-center">
                <CircleSymbol
                  :chain-name="missing.chain_name"
                  :denom="missing.denom"
                  size="sm"
                  variant="asset"
                  class="mr-4"
                />
                <div class="font-bold">
                  <AmountDisplay :amount="{ denom: missing.denom, amount: missing.amount }" />
                </div>
              </div>
            </div>
          </template>
          <template v-if="feeWarning.ibcWarning && feeWarning.missingFees.length == 0">
            <div class="text-1 font-bold mb-4">
              {{ $t('components.feeWarningModal.ibcWarning', { denom: feeWarning.ibcDetails.denom }) }}
            </div>
            <div class="text-muted leading-copy mb-8">
              {{
                $t('components.feeWarningModal.ibcWarningText', {
                  ibcDenom: feeWarning.ibcDetails.ibcDenom,
                  chain: feeWarning.ibcDetails.chain_name,
                  denom: feeWarning.ibcDetails.denom,
                })
              }}
            </div>
          </template>
          <template #buttons>
            <template v-if="feeWarning.missingFees.length == 1 && feeWarning.missingFees[0].denom == 'uatom'">
              <ModalButton
                :name="$t('generic_cta.cancel')"
                :click-function="
                  () => {
                    feeWarning.feeWarning = false;
                  }
                "
              />
              <ModalButton
                :name="$t('generic_cta.getAtom')"
                :click-function="
                  () => {
                    goMoon();
                  }
                "
              />
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
                    feeWarning.feeWarning = false;
                  }
                "
              />
            </template>
            <template v-if="feeWarning.ibcWarning && feeWarning.missingFees.length == 0">
              <ModalButton
                :name="$t('generic_cta.cancel')"
                :click-function="
                  () => {
                    feeWarning.feeWarning = false;
                  }
                "
              />
              <ModalButton
                :name="$t('generic_cta.proceed')"
                :click-function="
                  () => {
                    feeWarning.feeWarning = false;
                    acceptedWarning = true;
                    confirm();
                  }
                "
              />
            </template>
          </template>
        </Modal>
      </template>

      <TxHandlingModal
        v-if="isTxHandlingModalOpen"
        :variant="variant === 'widget' ? 'modal' : 'step'"
        :status="txstatus"
        :tx-result="txResult"
        :has-more="hasMore"
        :tx="transaction"
        :is-final="isFinal"
        :error-details="errorDetails"
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
            if (transaction.name == 'swap') {
              emitHandler('reset');
            } else {
              nextTx();
              if (!hasMore) {
                goBack();
              }
            }
          }
        "
        @reset="emitHandler('reset')"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, onMounted, PropType, ref, toRefs, watch } from 'vue';
import { RouteLocationRaw, useRouter } from 'vue-router';
import { useStore } from 'vuex';

import ConnectWalletModal from '@/components/account/ConnectWalletModal.vue';
import AmountDisplay from '@/components/common/AmountDisplay.vue';
import CircleSymbol from '@/components/common/CircleSymbol.vue';
import GobackWithClose from '@/components/common/headers/GobackWithClose.vue';
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
import useEmitter from '@/composables/useEmitter';
import { GlobalDemerisActionTypes } from '@/store/demeris/action-types';
import { FeeTotals, GasPriceLevel, Step } from '@/types/actions';
import { Balances, TransactionDetailResponse } from '@/types/api';
import {
  ensureTraceChannel,
  feeForStep,
  feeForStepTransaction,
  getStepTransactionDetailFromResponse,
  msgFromStepTransaction,
  validateStepFeeBalances,
} from '@/utils/actionHandler';
export default defineComponent({
  name: 'TxStepsModal',
  components: {
    GobackWithClose,
    PreviewTransfer,
    PreviewRedeem,
    PreviewAddLiquidity,
    PreviewWithdrawLiquidity,
    PreviewSwap,
    Button,
    ModalButton,
    TxHandlingModal,
    Modal,
    CircleSymbol,
    ConnectWalletModal,
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
    variant: {
      type: String as PropType<'default' | 'widget'>,
      default: 'default',
    },
  },
  emits: ['goback', 'close', 'transacting', 'failed', 'complete', 'reset', 'finish'],
  setup(props, { emit }) {
    const emitter = useEmitter();
    const isSignedIn = computed(() => {
      return store.getters['demeris/isSignedIn'];
    });
    const interstitialProceed = ref(false);
    const mpDomain = ref('https://buy.moonpay.io');
    const mpParams = computed(() => {
      return {
        apiKey: 'pk_live_C5H29zimSfFDzncZqYM4lQjuqZp2NNke',
        currencyCode: 'atom',
        walletAddress: store.getters['demeris/getOwnAddress']({ chain_name: 'cosmos-hub' }),
        baseCurrencyCode: 'usd',
        // baseCurrencyAmount: '50',
      };
    });
    const mpQuery = computed(() => {
      return new URLSearchParams(mpParams.value).toString();
    });
    const mpUrl = computed(() => {
      return mpDomain.value + '/?' + mpQuery.value;
    });
    const goMoon = () => {
      if (isSignedIn.value) {
        window.open(mpUrl.value, '', 'height=480,width=320');
      } else {
        emitter.emit('toggle-settings-modal');
      }
    };
    const router = useRouter();
    const goBack = () => {
      if (props.backRoute) {
        router.push(props.backRoute);
        return;
      }
      router.go(-1);
    };
    const fees = ref([]);
    const connectModalOpen = ref(false);
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
    const txResult = ref(null);
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
    const errorDetails = ref(undefined);
    const acceptedWarning = ref(false);
    const currentData = computed(() => {
      const currentStepData = props.data[currentStep.value];
      console.log(currentStepData);
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
          modifiedData.title = 'Review your pool liquidity provision';
          break;
        case 'withdrawliquidity':
          modifiedData.title = 'Review your liquidity withdrawal';
          break;
        case 'createpool':
          modifiedData.title = 'Review your liquidity pool provision';
          break;
      }
      modifiedData.fees = fees.value[currentStep.value];

      return modifiedData;
    });

    watch(
      () => currentData.value,
      async (newData) => {
        const toCheckBalances: Balances = JSON.parse(JSON.stringify(balances.value));
        feeWarning.value = await validateStepFeeBalances(
          newData.data,
          toCheckBalances,
          newData.fees,
          props.gasPriceLevel,
        );
        interstitialProceed.value = false;
      },
    );
    const isDemoAccount = computed(() => {
      return store.getters['demeris/isDemoAccount'];
    });
    const confirm = async () => {
      if (isDemoAccount.value) {
        connectModalOpen.value = true;
        return;
      }
      let abort = false;
      if ((feeWarning.value.ibcWarning || feeWarning.value.missingFees.length > 0) && !acceptedWarning.value) {
        feeWarning.value.feeWarning = true;
      } else {
        for (let [i, stepTx] of currentData.value.data.transactions.entries()) {
          if (!abort) {
            const isLastTransaction = i === currentData.value.data.transactions.length - 1;
            const isLastStep = currentStep.value === props.data.length - 1;

            if (isLastTransaction && isLastStep) {
              isFinal.value = true;
            } else {
              isFinal.value = false;
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
              let res = await msgFromStepTransaction(stepTx, props.gasPriceLevel);
              const feeOptions = await feeForStepTransaction(stepTx);
              const fee = {
                amount: [
                  {
                    amount:
                      '' +
                      parseFloat(feeOptions[0].amount[props.gasPriceLevel as GasPriceLevel]) *
                        store.getters['demeris/getGasLimit'],
                    denom: feeOptions[0].denom,
                  },
                ],
                gas: '400000',
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
                errorDetails.value = {
                  message: e.message,
                };
                txstatus.value = 'keplr-reject';
                await txToResolve.value['promise'];
                continue;
              }
              if (tx) {
                errorDetails.value = undefined;
                emit('transacting');
                txstatus.value = 'transacting';
                let result;
                try {
                  await ensureTraceChannel(stepTx);
                  result = await store.dispatch(GlobalDemerisActionTypes.BROADCAST_TX, tx);
                } catch (e) {
                  console.error(e);
                  errorDetails.value = {
                    message: e?.message,
                    ticket: result?.ticket,
                  };
                  emit('failed');
                  txstatus.value = 'failed';
                  await txToResolve.value['promise'];
                  abort = true;
                  continue;
                }
                try {
                  let txResultData = await store.dispatch(GlobalDemerisActionTypes.GET_TX_STATUS, {
                    subscribe: true,
                    params: { chain_name: res.chain_name, ticket: result.ticket },
                  });

                  let delayStatus = null;
                  let failStatus = null;

                  while (
                    txResultData.status != 'complete' &&
                    txResultData.status != 'failed' &&
                    txResultData.status != 'IBC_receive_failed' &&
                    txResultData.status != 'IBC_receive_success' &&
                    txResultData.status != 'Tokens_unlocked_timeout' &&
                    txResultData.status != 'Tokens_unlocked_ack'
                  ) {
                    txResultData = await store.getters['demeris/getTxStatus']({
                      chain_name: res.chain_name,
                      ticket: result.ticket,
                    });

                    if (stepTx.name.startsWith('ibc')) {
                      if (txResultData.status === 'transit') {
                        delayStatus = setTimeout(() => {
                          txstatus.value = 'delay';
                        }, 60000);
                        failStatus = setTimeout(() => {
                          txstatus.value = 'unknown';
                        }, 310000);
                        console.log('setTimeOut', delayStatus);
                      } else if (txResultData.status === 'IBC_receive_failed') {
                        txstatus.value = 'IBC_receive_failed';
                        clearTimeout(delayStatus);
                      } else {
                        clearTimeout(delayStatus);
                        clearTimeout(failStatus);
                      }
                    }

                    console.log(txResultData.status);
                  }

                  if (!['IBC_receive_success', 'complete'].includes(txResultData.status)) {
                    const details = {
                      status: txResultData.status,
                      ticket: result.ticket,
                    };

                    if (txResultData.error) {
                      details['message'] = txResultData.error;
                    }
                    errorDetails.value = details;
                    throw new Error(txResultData.error || txResultData.status);
                  }

                  errorDetails.value = undefined;

                  let txhash: string;
                  let chain_name: string;

                  if (txResultData.status === 'IBC_receive_success') {
                    const ticketData = txResultData.tx_hashes?.find((item) => item.Status === 'IBC_receive_success');
                    txhash = ticketData.TxHash;
                    chain_name = ticketData.Chain;
                  } else {
                    txhash = result.ticket;
                    chain_name = res.chain_name;
                  }

                  const txsResponse: TransactionDetailResponse = await store.dispatch(
                    GlobalDemerisActionTypes.GET_TXS,
                    { txhash, chain_name },
                  );

                  const txsResponseFees = {
                    [chain_name]: txsResponse?.tx.auth_info.fee.amount.reduce((acc, item) => {
                      acc[item.denom] = item.amount;
                      return acc;
                    }, {}),
                  };

                  if (!txResultData.error) {
                    if (['swap', 'addliquidity', 'withdrawliquidity'].includes(currentData.value.data.name)) {
                      //Get end block events
                      let endBlockEvent = await store.dispatch(GlobalDemerisActionTypes.GET_END_BLOCK_EVENTS, {
                        height: txResultData.height,
                        stepType: currentData.value.data.name,
                      });

                      if (endBlockEvent) {
                        let resultData = endBlockEvent;

                        switch (currentData.value.data.name) {
                          case 'swap':
                            resultData = {
                              swappedPercent:
                                (Number(endBlockEvent.exchanged_offer_coin_amount) /
                                  (Number(endBlockEvent.remaining_offer_coin_amount) +
                                    Number(endBlockEvent.exchanged_offer_coin_amount))) *
                                100,
                              demandCoinSwappedAmount: endBlockEvent.exchanged_demand_coin_amount,
                              demandCoinDenom: endBlockEvent.demand_coin_denom,
                              remainingOfferCoinAmount: endBlockEvent.remaining_offer_coin_amount,
                              offerCoinDenom: endBlockEvent.offer_coin_denom,
                            };
                            break;
                        }

                        txResult.value = resultData;
                      }
                    } else if (txsResponse) {
                      const txResponseDetail = getStepTransactionDetailFromResponse(txsResponse);

                      if (txResponseDetail) {
                        txResult.value = {
                          name: currentData.value.data.name,
                          transactions: [
                            {
                              data: txResponseDetail,
                              //@ts-ignore
                              name: transaction.value.name,
                            },
                          ],
                        };
                      }
                    }

                    txResult.value.fees = txsResponseFees;
                  }

                  // TODO: deal with status here
                  emit('complete');
                  txstatus.value = 'complete';

                  await txToResolve.value['promise'];
                } catch (e) {
                  console.error(e);
                  if (errorDetails.value === undefined) {
                    errorDetails.value = e.message;
                  }
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
      }
    };

    const emitHandler = (event) => {
      emit(event);
    };

    const refProps = toRefs(props);

    watch(
      refProps,
      () => {
        if (!interstitialProceed.value) {
          let shouldOpenConfirmation = false;

          if (props.actionName === 'move') {
            shouldOpenConfirmation = true;
          } else if (props.actionName === 'transfer') {
            if (props.data?.[0]?.transactions[0]?.name.includes('ibc')) {
              shouldOpenConfirmation = true;
            }
          } else if (['swap', 'addliquidity'].includes(props.actionName)) {
            shouldOpenConfirmation = props.data?.length > 1;
          }

          isTransferConfirmationOpen.value = shouldOpenConfirmation;
        }
      },
      { immediate: true },
    );
    //TEST
    // setTimeout(()=> {
    //   txstatus.value = 'failed'
    // }, 10000)

    return {
      isTransferConfirmationOpen,
      emitHandler,
      txstatus,
      interstitialProceed,
      txResult,
      confirm,
      toggleTxHandlingModal,
      currentData,
      goBack,
      isTxHandlingModalOpen,
      nextTx,
      transaction,
      connectModalOpen,
      retry,
      hasMore,
      isFinal,
      feeWarning,
      errorDetails,
      acceptedWarning,
      goMoon,
      isDemoAccount,
    };
  },
});
</script>

<style lang="scss" scoped></style>
