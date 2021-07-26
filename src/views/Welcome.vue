<template>
  <main class="welcome">
    <header class="welcome__header">
      <div class="welcome__header__logo">
        <Brandmark />
      </div>

      <div class="welcome__header__controls">
        <router-link to="/">
          <Button name="Try demo version" />
        </router-link>

        <a title="Emeris" class="welcome__header__controls__link" href="https://emeris.com" target="_blank">
          emeris.com ↗️
        </a>
      </div>
    </header>

    <div class="welcome__wrapper">
      <section class="welcome__main">
        <h2 class="welcome__main__subtitle">A new world for DeFi</h2>
        <h1 class="welcome__main__title">
          Your one-stop app <br />
          for decentralized <br />
          financial services.
        </h1>
        <p class="welcome__main__description">
          Emeris is the interchain portal: a simple-to-use, all-in-one dashboard, wallet and app store for the internet
          of blockchains.
        </p>
      </section>

      <aside class="welcome__aside">
        <div class="welcome__aside__connect">
          <ConnectKeplr :show-banner="false" @connect="onConnect">
            <template #title>
              <h2 class="welcome__aside__connect__title">Connect to Emeris</h2>
            </template>
            <template #description>
              Install Keplr in your browser and connect your wallet to start using Emeris. We will support other wallets
              in the near future.
            </template>
          </ConnectKeplr>
        </div>
      </aside>
    </div>

    <div class="welcome__polygon" />
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';

import ConnectKeplr from '@/components/account/ConnectKeplr.vue';
import Brandmark from '@/components/common/Brandmark.vue';
import Button from '@/components/ui/Button.vue';

export default defineComponent({
  name: 'Welcome',

  components: {
    Button,
    ConnectKeplr,
    Brandmark,
  },

  setup() {
    const router = useRouter();

    const onConnect = () => {
      router.push('/');
    };

    return {
      onConnect,
    };
  },
});
</script>

<style lang="scss" scoped>
.welcome {
  display: flex;
  flex-direction: column;
  height: 100vh;

  &__header {
    padding: 1rem 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;

    &__controls {
      display: flex;
      align-items: center;

      &__link {
        margin-left: 2rem;
      }
    }
  }

  &__wrapper {
    flex: 1 1 0%;
    display: flex;
    align-items: center;
    max-width: 1536px;
    margin: 0 auto;
    padding: 3rem 2rem;
    position: relative;
    z-index: 1;
  }

  &__main {
    flex: 1 1 0%;

    &__subtitle {
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    &__title {
      font-size: 3.1875rem;
      font-weight: 600;
      margin-top: 1.5rem;
      line-height: 1.21;
      letter-spacing: -0.043em;
    }

    &__description {
      margin-top: 3.5rem;
      color: var(--muted);
      line-height: 1.5;
    }
  }

  &__aside {
    flex: 1 1 0%;

    &__connect {
      width: 80%;
      min-height: 20rem;
      max-width: 27.5rem;
      margin: 0 auto;
      box-shadow: 32px 48px 96px -8px rgba(0, 0, 0, 0.14);
      background: rgba(255, 255, 255, 0.7);
      border-radius: 1.25rem;
      backdrop-filter: blur(42px);

      &__title {
        text-align: center;
        font-size: 2rem;
        font-weight: 600;
        line-height: 1;
      }
    }
  }

  &__polygon {
    width: 36%;
    height: 78%;
    content: '';
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-45%);
    background-image: url('~@/assets/images/gradient-light-2.png');
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    clip-path: polygon(0 10%, 100% 0, 100% 90%, 0% 100%);
  }
}
</style>
