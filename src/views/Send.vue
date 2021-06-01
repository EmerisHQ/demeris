<template>
  <AppLayout>
    <div class="send">
      <ul v-if="transferType" class="send__steps">
        <li v-for="label of allSteps[transferType]" :key="label" class="send__steps__item">
          {{ label }}
        </li>
      </ul>

      <template v-if="!transferType">
        <h2 class="send__title s-2">Who are you sending to?</h2>

        <div class="send__type">
          <router-link :to="{ name: 'Send', params: { type: 'address' } }" class="send__type__button elevation-card">
            <div class="send__type__button__icon">
              <Icon name="SendIcon" :icon-size="1.6" />
            </div>
            <h4 class="send__type__button__title w-bold">Send to address</h4>
            <p class="send__type__button__description s-minus">
              Send assets to someone else or another account with a crypto address.
            </p>
          </router-link>

          <router-link :to="{ name: 'Send', params: { type: 'move' } }" class="send__type__button elevation-card">
            <div class="send__type__button__icon">
              <Icon name="SwapLRIcon" :icon-size="1.6" />
            </div>
            <h4 class="send__type__button__title w-bold">Move assets</h4>
            <p class="send__type__button__description s-minus">
              Move assets between your addresses on different chains.
            </p>
          </router-link>
        </div>
      </template>

      <div v-else-if="transferType === 'address'" class="send__content">
        <SendForm v-model:step="step" />
      </div>
    </div>
  </AppLayout>
</template>

<script lang="ts">
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';

import SendForm from '@/components/transfer/SendForm/SendForm.vue';
import Icon from '@/components/ui/Icon.vue';
import AppLayout from '@/layouts/AppLayout.vue';

type TransferType = 'move' | 'address';

export default {
  name: 'Send',
  components: { AppLayout, SendForm, Icon },

  setup() {
    const route = useRoute();
    const transferType = computed(() => route.params.type as TransferType);
    const step = ref(undefined);

    const allSteps = {
      address: ['Recipient', 'Amount', 'Review', 'Send'],
      move: ['Amount', 'Review', 'Move'],
    };

    return { transferType, step, allSteps };
  },
};
</script>

<style lang="scss" scoped>
.send {
  display: flex;
  flex-direction: column;
  align-items: center;

  &__steps {
    display: none;

    &__item {
      margin-right: 2rem;
      margin-bottom: 4rem;
    }
  }

  &__content {
    width: 100%;
    max-width: 42rem;
  }

  &__type {
    display: flex;
    margin-top: 4.8rem;

    &__button {
      width: 27rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3.2rem;

      & + & {
        margin-left: 1.2rem;
      }

      &__icon {
        width: 4rem;
        height: 4rem;
        border-radius: 2rem;
        background: var(--fg);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      &__title {
        margin-top: 2.4rem;
        margin-bottom: 0.8rem;
      }

      &__description {
        text-align: center;
        color: var(--muted);
      }
    }
  }
}
</style>
