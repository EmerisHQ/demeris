<template>
  <CurrencyDisplay :value="totalLiquidityPrice" show-dash />
</template>

<script setup lang="ts">
import CurrencyDisplay from '@/components/ui/CurrencyDisplay.vue';
import usePool from '@/composables/usePool';
import { Pool } from '@/types/actions';

interface Props {
  pool: Pool;
}

const props = defineProps<Props>();

const { totalLiquidityPrice } = usePool(props.pool.id);
</script>
