<template>
  <div class="relative flex flex-col">
    <!-- STAKING TABLE -->
    <table class="staking-table -ml-6">
      <colgroup>
        <col v-for="(span, index) in tableColumns" :key="`table--staking__col-${index}`" :span="span" />
      </colgroup>

      <thead v-if="props.hasHeaders" class="hidden md:table-header-group text-muted"></thead>

      <tbody>
        <tr
          v-for="(chain, index) in stakedDenoms"
          :key="`staking-${index}`"
          class="assets-table__row group cursor-pointer"
          data-cy="asset-row"
        >
          <td class="py-5 align-middle group-hover:bg-fg transition">
            <div class="flex items-center">
              <CircleSymbol :key="`${chain.stakableBaseDenom}${index}`" :denom="chain.stakableBaseDenom" />
              <div class="ml-4 whitespace-nowrap overflow-hidden text-ellipsis min-w-0">
                <span class="font-medium">
                  <Denom :name="chain.stakableBaseDenom" />
                </span>
                <LPAsset :name="chain.stakableBaseDenom" />
              </div>
            </div>
          </td>

          <td class="py-5 align-middle text-right group-hover:bg-fg transition">
            <Price
              class="font-medium"
              :amount="{ denom: chain.stakableBaseDenom, amount: stakingAmountByChain(chain.name) + '' }"
              :label="$t('components.stakeTable.staked')"
            />
          </td>

          <td class="py-5 align-middle text-right group-hover:bg-fg transition">
            <Apr :chain="chain.name" />
          </td>

          <td class="align-middle text-right group-hover:bg-fg transition">
            <StakingRewardsAmountClaim
              :denom="chain.stakableBaseDenom"
              :label="$t('components.stakeTable.toClaim')"
              has-button
            />
          </td>
        </tr>
      </tbody>
    </table>
    <!-- END: STAKING TABLE -->
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';

import LPAsset from '@/components/assets/AssetsTable/LPAsset.vue';
import CircleSymbol from '@/components/common/CircleSymbol.vue';
import Denom from '@/components/common/Denom.vue';
import Price from '@/components/common/Price.vue';
import Apr from '@/components/stake/Apr.vue';
import StakingRewardsAmountClaim from '@/components/stake/StakingRewardsAmountClaim.vue';
import useAccount from '@/composables/useAccount';
import useDenomsFactory from '@/composables/useDenoms';

// Interfaces
interface Props {
  hasHeaders: boolean;
}

// Composables
const { stakingBalances, stakingAmountByChain } = useAccount();
const { getStakableBaseDenomFromChainName } = useDenomsFactory();

// Props
const props = withDefaults(defineProps<Props>(), {
  hasHeaders: false,
});

const tableColumns = ref(['1', '2', '3', '4']);

const stakedDenoms = computed(() => {
  const chainsSet = [...new Set(stakingBalances.value.map((item) => item.chain_name))];
  return chainsSet.map((chain) => ({ name: chain, stakableBaseDenom: getStakableBaseDenomFromChainName(chain) }));
});
</script>

<style lang="scss" scoped>
.staking-table {
  @apply w-[calc(100%+3rem)];

  td,
  th {
    &:first-child {
      @apply pl-6 rounded-tl-xl rounded-bl-xl;
    }

    &:last-child {
      @apply pr-6 rounded-tr-xl rounded-br-xl;
    }
  }
}
</style>
