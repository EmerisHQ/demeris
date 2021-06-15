<template>
  <Modal :variant="'bottom'" :show-close-button="false" @close="emit('close')">
    <div class="status">
      <div class="status__icon">
        <SpinnerIcon v-if="displayData.iconType === iconType.pending" :size="3.2" />
        <div v-else-if="displayData.iconType === iconType.warning" class="status__icon-warning">
          <WarningIcon />
        </div>
        <div v-else class="status__icon-error">
          <ErrorIcon />
        </div>
      </div>
      <div class="status__title-sub s-0 w-normal">{{ displayData.subTitle }}</div>
      <div class="status__title s-2 w-bold">{{ displayData.title }}</div>

      <div class="status__detail">
        <div class="spacer" />
      </div>

      <Button :name="'Confirm and continue'" :status="'normal'" :click-function="setStep" />
    </div>
  </Modal>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, reactive, toRefs } from 'vue';

import ErrorIcon from '@/components/common/Icons/AlertIcon.vue';
import WarningIcon from '@/components/common/Icons/ExclamationIcon.vue';
import Button from '@/components/ui/Button.vue';
import Modal from '@/components/ui/Modal.vue';
import SpinnerIcon from '@/components/ui/Spinner.vue';

type Status =
  | 'keplr-sign'
  | 'keplr-open'
  | 'keplr-launch-error'
  | 'keplr-sign-error'
  | 'keplr-error'
  | 'tx-wait'
  | 'tx-fail';

export default defineComponent({
  name: 'SigningModal',
  components: { Modal, SpinnerIcon, WarningIcon, ErrorIcon, Button },
  props: {
    status: {
      type: String as PropType<Status>,
      default: 'keplr-sign',
    },
  },
  setup(props) {
    const displayData = reactive({
      iconType: {
        pending: 'pending',
        warn: 'warning',
        error: 'error',
      },
      displayData: computed(() => {
        let displayInfo = {
          iconType: '',
          title: '',
          subTitle: '',
          detail: '',
        };

        switch (props.status) {
          case 'keplr-sign':
            displayInfo.iconType = displayData.iconType.pending;
            displayInfo.title = 'Sign transaction';
            displayInfo.subTitle = 'Opening Keplr';
            break;
          case 'keplr-open':
            displayInfo.iconType = displayData.iconType.pending;
            displayInfo.title = 'Sign transaction';
            displayInfo.subTitle = 'Opening Keplr';
            displayInfo.detail = 'Having trouble opening Keplr?';
            break;
          case 'keplr-launch-error':
            displayInfo.iconType = displayData.iconType.warn;
            displayInfo.title = 'Keplr cannot launch';
            displayInfo.detail = 'Keplr troubleshooting ↗️';
            break;
          case 'keplr-sign-error':
            displayInfo.iconType = displayData.iconType.warn;
            displayInfo.title = 'Transaction not signed';
            displayInfo.detail = 'Keplr troubleshooting ↗️';
            break;
          case 'keplr-error':
            //TODO: error code
            displayInfo.iconType = displayData.iconType.error;
            displayInfo.title = 'There was an error with Keplr';
            displayInfo.subTitle = 'Transaction failed';
            displayInfo.detail = 'Error code XXXX';
            break;
          case 'tx-wait':
            displayInfo.iconType = displayData.iconType.pending;
            displayInfo.title = 'Please wait';
            displayInfo.subTitle = 'Transaction in progress';
            break;
          case 'tx-fail':
            displayInfo.iconType = displayData.iconType.error;
            displayInfo.title = 'Transaction failed';
            displayInfo.subTitle = 'ATOM -> LUNA on Cosmos Hub';
            displayInfo.detail = 'Your 551.56 ATOM could not be swapped to LUNA.';
            break;
        }

        return displayInfo;
      }),
    });
    return { ...toRefs(displayData) };
  },
});
</script>

<style lang="scss" scoped>
.status {
  text-align: center;

  &__icon {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2.4rem 0;

    &-warning {
      font-size: 4.2rem;
      color: var(--warning);
    }

    &-error {
      font-size: 3.2rem;
      color: var(--negative-text);
    }
  }

  &__detail {
    .spacer {
      height: 8.8rem;
    }
  }
}
</style>
