<template>
  <div class="relative flex flex-col">
    <!-- STAKING TABLE -->
    <table class="assets-table -ml-6">
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
              <CircleSymbol
                :key="`${getStakableBaseDenomFromChainName(chain)}${index}`"
                :denom="getStakableBaseDenomFromChainName(chain)"
              />
              <div class="ml-4 whitespace-nowrap overflow-hidden text-ellipsis min-w-0">
                <span class="font-medium">
                  <Denom :name="getStakableBaseDenomFromChainName(chain)" />
                </span>
                <LPAsset :name="getStakableBaseDenomFromChainName(chain)" />
              </div>
            </div>
          </td>

          <td class="py-5 align-middle text-right group-hover:bg-fg transition">
            <Price
              class="font-medium"
              :amount="{ denom: getStakableBaseDenomFromChainName(chain), amount: stakingAmountByChain(chain) + '' }"
              :label="$t('components.stakeTable.staked')"
            />
          </td>

          <td class="py-5 align-middle text-right group-hover:bg-fg transition">
            <Apr :chain="chain" />
          </td>

          <td class="py-5 align-middle text-right group-hover:bg-fg transition">
            <StakingRewardsAmount
              :denom="getStakableBaseDenomFromChainName(chain)"
              :label="$t('components.stakeTable.toClaim')"
            />
          </td>

          <td class="py-5 align-middle text-right group-hover:bg-fg transition">
            <Button variant="primary" size="sm"> | {{ $t('components.stakeTable.claim') }} </Button>
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
import StakingRewardsAmount from '@/components/stake/StakingRewardsAmount.vue';
import Button from '@/components/ui/Button.vue';
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

const stakedDenoms = computed(() => [...new Set(stakingBalances.value.map((item) => item.chain_name))]);

const tableColumns = ref(['1', '2', '3', '4']);
</script>
