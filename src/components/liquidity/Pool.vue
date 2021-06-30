<template>
  <router-link :to="{ name: 'Pool', params: { id: pool.id } }" class="pool">
    <div class="pool__main">
      <div class="pool__main__token-pair">
        <span class="pool__main__token-pair__token token-a" />
        <span class="pool__main__token-pair__token token-b" />
      </div>

      <div class="pool__main__trending">
        <span class="pool__main__trending__icon">
          <TrendingUpIcon />
        </span>
        <span class="pool__main__trending__value"> 18% </span>
      </div>
    </div>

    <div class="pool__footer">
      <p class="pool__footer__pair">{{ pairName }}</p>
      <span class="pool__footer__price">$1,544.05</span>
    </div>
  </router-link>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType, ref } from 'vue';

import usePools from '@/composables/usePools';
import { Pool } from '@/types/actions';

import TrendingUpIcon from '../common/Icons/TrendingUpIcon.vue';

export default defineComponent({
  name: 'Pool',

  components: { TrendingUpIcon },

  props: {
    pool: {
      type: Object as PropType<Pool>,
      required: true,
    },
  },

  setup(props) {
    const pairName = ref('-/-');
    const { formatPoolName } = usePools();
    onMounted(async () => {
      pairName.value = await formatPoolName(props.pool as Pool);
    });

    return { pairName };
  },
});
</script>

<style lang="scss" scoped>
.pool {
  display: flex;
  flex-direction: column;
  border-radius: 1.6rem;
  padding: 2.4rem;
  box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.08);
  font-size: 1.6rem;

  &__main {
    flex: 1;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;

    &__token-pair {
      display: inline-flex;
      align-items: center;

      &__token {
        width: 3.2rem;
        height: 3.2rem;
        border-radius: 9999px;

        &.token-a {
          background-color: #f7f7f7;
        }

        &.token-b {
          margin-left: -0.8rem;
          background-color: #e5e5e5;
        }
      }
    }

    &__trending {
      display: inline-flex;
      font-weight: 600;
      color: rgb(6, 126, 61);

      &__icon {
        width: 1.6rem;
        height: 1.6rem;
      }

      &__value {
        margin-left: 0.2rem;
      }
    }
  }

  &__footer {
    display: flex;
    flex-direction: column;

    &__pair {
      font-weight: 600;
      text-transform: uppercase;
      margin-bottom: 0.2rem;
    }
  }
}
</style>
