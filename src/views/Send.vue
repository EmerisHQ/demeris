<template>
  <div class="send">
    <header class="send__header">
      <button v-if="showBackButton" class="send__header__button" @click="goBack">
        <Icon name="ArrowLeftIcon" :icon-size="1.6" />
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
        <Icon name="CloseIcon" :icon-size="1.6" />
      </button>
    </header>

    <main class="send__wrapper">
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

      <div v-else class="send__content">
        <SendForm v-if="transferType === 'address'" v-model:step="step" />
        <MoveForm v-if="transferType === 'move'" v-model:step="step" />
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

type TransferType = 'address' | 'move';

export default {
  name: 'Send',
  components: { SendForm, MoveForm, Icon },

  setup() {
    const router = useRouter();
    const route = useRoute();
    const transferType = computed(() => route.params.type as TransferType);
    const step = ref(undefined);

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

    return { transferType, step, allSteps, goBack, showBackButton, onClose };
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
  }

  &__steps {
    flex: 1 1 0%;
    display: flex;
    align-items: center;
    justify-content: center;

    &__item {
      margin-right: 4.8rem;
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
    margin-top: 3.1rem;
  }

  &__content {
    width: 100%;
    max-width: 44rem;
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
