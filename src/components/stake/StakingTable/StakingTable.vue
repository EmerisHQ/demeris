<template>
  <div class="relative flex flex-col">
    <!-- STAKING TABLE -->
    <table class="staking-table -ml-6">
      <colgroup>
        <col v-for="(width, index) in tableColumns" :key="`table--staking__col-${index}`" :width="width" />
      </colgroup>

      <thead v-if="props.showHeaders" class="hidden md:table-header-group text-muted">
        <tr>
          <th class="align-middle -text-1 font-normal py-4 pr-0 sticky top-0 z-20 bg-app text-left">
            {{ $t('context.staking.asset') }}
          </th>
          <th class="align-middle -text-1 font-normal py-4 pr-0 sticky top-0 z-20 bg-app text-right">
            {{ $t('context.staking.staked') }}
          </th>
          <th class="align-middle -text-1 font-normal py-4 pr-0 sticky top-0 z-20 bg-app text-right">
            {{ $t('context.staking.apr') }}
          </th>
          <th class="align-middle -text-1 font-normal py-4 pr-0 sticky top-0 z-20 bg-app text-right">
            {{ $t('context.staking.claimable') }}
          </th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="(chain, index) in stakedDenoms"
          :key="`staking-${index}`"
          class="assets-table__row group cursor-pointer"
          data-cy="asset-row"
          @click="handleClick(chain.stakableBaseDenom)"
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
            <Price class="font-medium" :amount="{ denom: chain.stakableBaseDenom, amount: `${chain.stakingAmount}` }" />
          </td>

          <td class="py-5 align-middle text-right group-hover:bg-fg transition">
            <Apr :chain="chain.name" />
          </td>

          <td class="align-middle text-right group-hover:bg-fg transition">
            <StakingRewardsAmountClaim :denom="chain.stakableBaseDenom" has-button />
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
import usePrice from '@/composables/usePrice';

// Interfaces
interface Props {
  showHeaders: boolean;
}

// Composables
const { stakingBalances, stakingAmountByChain } = useAccount();
const { getStakableBaseDenomFromChainName } = useDenomsFactory();
const { getRawPrice } = usePrice();

// Props
const props = withDefaults(defineProps<Props>(), {
  showHeaders: false,
});

const emit = defineEmits(['row-click']);

const tableColumns = ref(['20%', '15%', '25%', '40%']);

const stakedDenoms = computed(() => {
  const chainSet = [...new Set(stakingBalances.value.map((item) => item.chain_name))];
  return chainSet
    .map((chain) => ({
      name: chain,
      stakableBaseDenom: getStakableBaseDenomFromChainName(chain),
      stakingAmount: stakingAmountByChain(chain),
      stakingAmountFiat: getRawPrice(getStakableBaseDenomFromChainName(chain), stakingAmountByChain(chain)),
    }))
    .sort((a, b) => (a.stakingAmountFiat.isGreaterThan(b.stakingAmountFiat) ? -1 : 1));
});

const handleClick = (assetName) => {
  emit('row-click', { denom: assetName });
};
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

  thead {
    th {
      &:last-child {
        @apply pr-32;
      }
    }
  }
}
</style>
