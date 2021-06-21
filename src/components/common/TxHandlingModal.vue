<template>
  <Modal :variant="'bottom'" :show-close-button="false" @close="emitClose">
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
      <div class="status__title-sub w-normal" :class="status === 'keplr-error' ? 's-minus' : 's-0'">
        {{ displayData.subTitle }}
      </div>
      <div class="status__title s-2 w-bold">{{ displayData.title }}</div>

      <div class="status__detail">
        <div v-if="status === 'tx-wait' || status === 'keplr-sign'" class="spacer" />
        <div v-else-if="status === 'keplr-open'" class="status__detail-text s-0 w-medium l-solid">
          {{ displayData.detail1 }}
        </div>
        <a
          v-else-if="status === 'keplr-launch-error' || status === 'keplr-sign-error'"
          href="https://faq.keplr.app/"
          target="_blank"
          class="status__detail-link s-0 w-medium l-solid"
        >
          {{ displayData.detail }}
        </a>
        <div v-else class="status__detail-text-weak">{{ displayData.detail1 }}</div>
      </div>

      <Button
        v-if="displayData.blackButton"
        :name="displayData.blackButton"
        :status="'normal'"
        :click-function="blackButtonFunc"
        :style="{ marginBottom: `${displayData.blackButton && displayData.whiteButton ? '2.4rem' : ''}` }"
      />
      <Button
        v-if="displayData.whiteButton"
        :name="displayData.whiteButton"
        :status="'normal'"
        :click-function="cancel"
        :is-outline="true"
      />

      <div v-if="displayData.detail2">
        <a
          href="https://faq.keplr.app/"
          target="_blank"
          class="s-0 w-medium l-solid"
          style="padding: 4rem 0 1.6rem; display: block"
        >
          {{ displayData.detail2 }}
        </a>
      </div>
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
  | 'tx-fail'
  | 'transferring';

export default defineComponent({
  name: 'TxHandlingModal',
  components: { Modal, SpinnerIcon, WarningIcon, ErrorIcon, Button },
  props: {
    status: {
      type: String as PropType<Status>,
      default: 'transferring',
    },
    blackButtonFunc: {
      type: Function,
      default: () => {
        return;
      },
    },
    whiteButtonFunc: {
      type: Function,
      default: () => {
        return;
      },
    },
  },
  emits: ['close'],
  setup(props, { emit }) {
    const displayData = reactive({
      iconType: {
        pending: 'pending',
        warning: 'warning',
        error: 'error',
        none: 'none',
      },
      displayData: computed(() => {
        let displayInfo = {
          iconType: '',
          title: '',
          subTitle: '',
          detail1: '',
          detail2: '',
          blackButton: '',
          whiteButton: '',
        };

        switch (props.status) {
          case 'keplr-sign':
            displayInfo.iconType = displayData.iconType.pending;
            displayInfo.title = 'Sign transaction';
            displayInfo.subTitle = 'Opening Keplr';
            displayInfo.whiteButton = 'Cancel';
            break;
          case 'keplr-open':
            displayInfo.iconType = displayData.iconType.pending;
            displayInfo.title = 'Sign transaction';
            displayInfo.subTitle = 'Opening Keplr';
            displayInfo.detail1 = 'Having trouble opening Keplr?';
            displayInfo.blackButton = 'Open Keplr';
            displayInfo.whiteButton = 'Cancel';
            break;
          case 'keplr-launch-error':
            displayInfo.iconType = displayData.iconType.warning;
            displayInfo.title = 'Keplr cannot launch';
            displayInfo.detail1 = 'Keplr troubleshooting ↗️';
            displayInfo.blackButton = 'Try again';
            break;
          case 'keplr-sign-error':
            displayInfo.iconType = displayData.iconType.warning;
            displayInfo.title = 'Transaction not signed';
            displayInfo.detail1 = 'Keplr troubleshooting ↗️';
            displayInfo.blackButton = 'Open keplr';
            break;
          case 'keplr-error':
            //TODO: error code
            displayInfo.iconType = displayData.iconType.error;
            displayInfo.title = 'There was an error with Keplr';
            displayInfo.subTitle = 'Transaction failed';
            displayInfo.detail1 = 'Error code XXXX';
            displayInfo.blackButton = 'Try again';
            displayInfo.detail2 = 'Get support ↗️';
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
            displayInfo.detail1 = 'Your 551.56 ATOM could not be swapped to LUNA.';
            break;
          case 'transferring':
            displayInfo.iconType = displayData.iconType.none;
            displayInfo.title = 'Transferring';
            displayInfo.subTitle = 'Please wait';
            displayInfo.detail1 = 'Your 551.56 ATOM could not be swapped to LUNA.';
            break;
        }

        return displayInfo;
      }),
    });

    function emitClose() {
      emit('close');
    }

    function cancel() {
      alert('cancel');
      emitClose();
    }
    return { ...toRefs(displayData), cancel, emitClose };
  },
});
</script>

<style lang="scss" scoped>
.status {
  text-align: center;

  &__title-sub {
    color: var(--muted);
  }

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

    &-text,
    &-link {
      padding: 4rem 0 3.2rem;
    }

    &-text {
      color: var(--text);
    }

    &-text-weak {
      color: var(--muted);
      padding: 1.6rem 0 3.2rem;
    }

    &-link {
      display: block;
    }
  }
}
</style>
