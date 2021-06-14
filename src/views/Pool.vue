<template>
  <AppLayout>
    <div class="pool">
      <div class="pool__main">
        <section class="pool__main__stats">
          <div class="pool__main__stats__header">
            <h2 class="pool__main__stats__name s-2">{{ formatPoolName(pool) }}</h2>
            <div class="pool__main__stats__pair">
              <div class="pool__main__stats__pair__avatar token-a" />
              <div class="pool__main__stats__pair__avatar token-b" />
            </div>
          </div>
          <span class="pool__main__stats__subtitle">Gravity DEX Pool</span>
          <h1 class="pool__main__stats__supply">$130,040,429</h1>
        </section>

        <section class="pool__main__assets">
          <h2 class="pool__main__assets__title s-2">Underlying assets</h2>

          <table class="pool__main__assets__table">
            <thead>
              <tr>
                <th>Asset</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Allocation</th>
              </tr>
            </thead>
          </table>
        </section>

        <section class="pool__main__pools">
          <div class="pool__main__pools__header">
            <h2 class="s-2">Other pools</h2>
            <button>See all</button>
          </div>
        </section>
      </div>

      <div class="pool__aside">Equity</div>
    </div>
  </AppLayout>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import usePools from '@/composables/usePools';
import AppLayout from '@/layouts/AppLayout.vue';

export default defineComponent({
  name: 'Pool',

  components: {
    AppLayout,
  },

  setup() {
    const router = useRouter();
    const route = useRoute();

    const { poolById, formatPoolName } = usePools();

    const pool = computed(() => {
      return poolById(+route.params.id);
    });

    return {
      router,
      route,
      pool,
      formatPoolName,
    };
  },
});
</script>

<style lang="scss" scoped>
.pool {
  display: flex;
  margin-bottom: 2rem;
  font-size: 1.6rem;
  padding-bottom: 4rem;

  &__main {
    display: flex;
    flex-direction: column;
    width: 60%;

    &__stats {
      &__header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
      }

      &__name {
        line-height: 1.5;
      }

      &__subtitle {
        color: var(--muted);
      }

      &__supply {
        font-size: 5.1rem;
        font-weight: 700;
        line-height: 1.5;
      }

      &__pair {
        display: inline-flex;

        &__avatar {
          width: 3.4rem;
          height: 3.4rem;
          background: rgba(0, 0, 0, 0.1);
          border-radius: 2.6rem;

          & + & {
            margin-left: -1rem;
          }
        }
      }
    }

    &__assets {
      margin-top: 6.4rem;

      &__table {
        margin-top: 3.2rem;
      }
    }

    &__pools {
      &__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }
  }

  &__aside {
    display: flex;
    align-items: flex-start;
    justify-content: flex-end;
    margin-left: 3.2rem;
  }
}
</style>
