<template>
  <Modal :variant="'bottom'" :show-close-button="false" @close="emit('close')">
    <div class="status">
      <div class="status__icon">
        <Spinner :size="3.2" />
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

import Button from '@/components/ui/Button.vue';
import Modal from '@/components/ui/Modal.vue';
import Spinner from '@/components/ui/Spinner.vue';

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
  components: { Modal, Spinner, Button },
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
        warn: 'warn',
        error: 'error',
      },
      displayData: computed(() => {
        let displayInfo = {
          title: '',
          icon: '',
          subTitle: '',
          detail: '',
        };

        switch (props.status) {
          case 'keplr-sign':
            displayInfo.icon = displayData.iconType.pending;
            displayInfo.title = 'Sign transaction';
            displayInfo.subTitle = 'Opening Keplr';
            break;
          case 'keplr-open':
            displayInfo.icon = displayData.iconType.pending;
            displayInfo.title = 'Sign transaction';
            displayInfo.subTitle = 'Opening Keplr';
            displayInfo.detail = 'Having trouble opening Keplr?';
            break;
          case 'keplr-launch-error':
            displayInfo.icon = displayData.iconType.warn;
            displayInfo.title = 'Keplr cannot launch';
            displayInfo.detail = 'Keplr troubleshooting ↗️';
            break;
          case 'keplr-sign-error':
            displayInfo.icon = displayData.iconType.warn;
            displayInfo.title = 'Transaction not signed';
            displayInfo.detail = 'Keplr troubleshooting ↗️';
            break;
          case 'keplr-error':
            //TODO: error code
            displayInfo.icon = displayData.iconType.error;
            displayInfo.title = 'There was an error with Keplr';
            displayInfo.subTitle = 'Transaction failed';
            displayInfo.detail = 'Error code XXXX';
            break;
          case 'tx-wait':
            displayInfo.icon = displayData.iconType.pending;
            displayInfo.title = 'Please wait';
            displayInfo.subTitle = 'Transaction in progress';
            break;
          case 'tx-fail':
            displayInfo.icon = displayData.iconType.error;
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

    padding: 2.4rem 0;
  }

  &__detail {
    .spacer {
      height: 8.8rem;
    }
  }
}
</style>
