<template>
  <div class="send">
    <header class="send__header">
      <button
        v-if="showBackButton"
        :disabled="['move', 'send'].includes(step)"
        class="send__header__button"
        @click="goBack"
      >
        <Icon name="ArrowLeftIcon" :icon-size="1" />
      </button>

      <nav v-if="transferType" class="send__steps">
        <span
          v-for="label of allSteps[transferType]"
          :key="label"
          class="send__steps__item"
          :class="{ 'send__steps__item--active': step === label }"
        >
          {{ label }}
        </span>
      </nav>

      <button class="send__header__button close-button" @click="onClose">
        <Icon name="CloseIcon" :icon-size="1" />
      </button>
    </header>

    <main class="send__wrapper">
      <template v-if="!transferType">
        <h2 class="send__title text-2">Who are you sending to?</h2>

        <div class="send__type">
          <router-link
            :to="{ name: 'Send', params: { type: 'address' } }"
            class="send__type__button shadow-card rounded-2xl"
          >
            <div class="send__type__button__icon">
              <Icon name="SendIcon" :icon-size="1" />
            </div>

            <h4 class="send__type__button__title font-bold">Send to address</h4>

            <p class="send__type__button__description -text-1">
              Send assets to someone else or another account with a crypto address.
            </p>
          </router-link>

          <router-link
            :to="{ name: 'Send', params: { type: 'move' } }"
            class="send__type__button shadow-card rounded-2xl"
          >
            <div class="send__type__button__icon">
              <Icon name="SwapLRIcon" :icon-size="1" />
            </div>

            <h4 class="send__type__button__title font-bold">Move assets</h4>

            <p class="send__type__button__description -text-1">
              Move assets between your addresses on different chains.
            </p>
          </router-link>
        </div>
      </template>

      <div v-else class="send__content">
        <SendForm v-if="transferType === 'address'" v-model:step="step" :balances="balances" />
        <MoveForm v-if="transferType === 'move'" v-model:step="step" :balances="balances" />
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import MoveForm from '@/components/transfer/MoveForm';
import SendForm from '@/components/transfer/SendForm';
import Icon from '@/components/ui/Icon.vue';
import useAccount from '@/composables/useAccount';

type TransferType = 'address' | 'move';

export default {
  name: 'Send',
  components: { SendForm, MoveForm, Icon },

  setup() {
    const router = useRouter();
    const route = useRoute();
    const transferType = computed(() => route.params.type as TransferType);
    const step = ref(undefined);

    const { balances } = useAccount();

    const showBackButton = computed(() => {
      return !!transferType.value;
    });

    const allSteps = {
      address: ['recipient', 'amount', 'review', 'send'],
      move: ['amount', 'review', 'move'],
    };

    const currentStepIndex = computed(() => allSteps[transferType.value]?.indexOf(step.value));

    const goBack = () => {
      if (currentStepIndex.value > 0) {
        step.value = allSteps[transferType.value][currentStepIndex.value - 1];
        return;
      }

      step.value = undefined;
      router.back();
    };

    const onClose = () => {
      router.push('/');
    };

    return { balances, transferType, step, allSteps, goBack, showBackButton, onClose };
  },
};
</script>

<style lang="scss" scoped>
.send {
  position: relative;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 2rem 2.5rem;
    background: var(--bg);

    &__button {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 0.5rem;
      padding: 0.375rem;

      &:disabled {
        cursor: not-allowed;
        color: var(--inactive);
      }
    }

    .close-button {
      margin-left: auto;
    }
  }

  &__steps {
    flex: 1 1 0%;
    display: flex;
    align-items: center;
    justify-content: center;

    &__item {
      margin-right: 3rem;
      text-transform: capitalize;
      color: var(--inactive);
      font-weight: 600;
      cursor: default;

      &--active {
        color: var(--text);
      }
    }
  }

  &__wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 2rem;
  }

  &__content {
    width: 100%;
    max-width: 27.5rem;
  }

  &__type {
    display: flex;
    margin-top: 3rem;

    &__button {
      width: 17rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;

      & + & {
        margin-left: 0.75rem;
      }

      &__icon {
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 1.25rem;
        background: var(--fg);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      &__title {
        margin-top: 1.5rem;
        margin-bottom: 0.5rem;
      }

      &__description {
        text-align: center;
        color: var(--muted);
      }
    }
  }
}
</style>
