<template>
  <div>
    <apexchart class="w-full" :height="height" :options="chartData.options" :series="chartData.series"></apexchart>
    <div v-if="variant === 'full'" class="text-right">
      <a
        v-for="(item, index) in filterItems"
        :key="index"
        class="mx-2 rounded px-4 py-2 -text-1 cursor-pointer hover:bg-fg"
        :class="item.value === activeFilterItem ? 'bg-fg' : ''"
        @click="setActiveFilter(item)"
      >
        {{ item.text }}
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from 'vue';

import { TokenPrices } from '@/types/api';

export default defineComponent({
  name: 'AreaChart',
  props: {
    variant: {
      type: String,
      default: 'full',
      required: false,
    },
    height: {
      type: String,
      default: '320',
      required: false,
    },
    dataStream: {
      type: Array as PropType<any[]>,
      required: true,
      default: () => [],
    },
  },
  emits: ['filterChanged'],
  setup(props, { emit }) {
    const filterItems = ref([
      {
        text: '1D',
        value: '1',
      },
      {
        text: '1W',
        value: '7',
      },
      {
        text: '2W',
        value: '14',
      },
      {
        text: '1M',
        value: '30',
      },
      {
        text: '3M',
        value: '90',
      },
      {
        text: '1Y',
        value: '365',
      },
      {
        text: 'All',
        value: 'max',
      },
    ]);

    const chartData = ref({
      options: {
        theme: {
          mode: 'dark',
        },
        chart: {
          type: 'area',
          toolbar: {
            show: false,
          },
          background: 'transparent',
        },
        stroke: {
          curve: 'straight',
          width: 2,
        },
        xaxis: {
          labels: {
            show: false,
          },
          axisBorder: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
        },
        dataLabels: {
          enabled: false,
        },
        colors: ['#00CF30'],
        fill: {
          colors: ['#90EE90'],
          gradient: {
            type: 'vertical',
            shade: 'light',
            opacityFrom: 0.7,
            opacityTo: 0.3,
          },
        },
        yaxis: {
          show: false,
        },
        grid: {
          show: false,
        },
      },
      series: [
        {
          name: 'Price',
          data: [],
        },
      ],
    });

    const activeFilterItem = ref('1');

    const setActiveFilter = (filterObject): void => {
      activeFilterItem.value = filterObject.value;
      emit('filterChanged', activeFilterItem.value);
    };

    watch(
      () => props.dataStream as TokenPrices[],
      async (value) => {
        chartData.value.series[0].data = value;
      },
      { immediate: true },
    );

    return {
      filterItems,
      chartData,
      activeFilterItem,
      setActiveFilter,
    };
  },
});
</script>
