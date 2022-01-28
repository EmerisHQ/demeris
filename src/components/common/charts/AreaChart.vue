<template>
  <div>
    <SkeletonLoader v-if="showLoading && chartData.series[0].data.length <= 0" width="100%" :height="`${height}px`" />
    <div v-if="chartData.series[0].data.length > 0">
      <apexchart class="w-full" :height="height" :options="chartData.options" :series="chartData.series"></apexchart>
      <div v-if="variant === 'full'" class="flex justify-between items-center">
        <p class="-text-1 text-muted">
          High ${{ highestPrice ? highestPrice.toFixed(2) : 0 }} / Low ${{ lowestprice ? lowestprice.toFixed(2) : 0 }}
        </p>
        <div>
          <a
            v-for="(item, index) in filterItems"
            :key="index"
            class="mx-2 rounded px-4 py-2 -text-1 cursor-pointer hover:bg-fg"
            :class="item.value === activeFilterItem ? 'bg-fg font-medium' : 'text-muted'"
            @click="setActiveFilter(item)"
          >
            {{ item.text }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import maxBy from 'lodash.maxby';
import minBy from 'lodash.minby';
import { defineComponent, PropType, ref, watch } from 'vue';

import SkeletonLoader from '@/components/common/loaders/SkeletonLoader.vue';
import { TokenPrices } from '@/types/api';

export default defineComponent({
  name: 'AreaChart',
  components: {
    SkeletonLoader,
  },
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
    showLoading: {
      type: Boolean,
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
        text: '1M',
        value: '30',
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
        tooltip: {
          x: {
            show: false,
          },
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
        colors: [],
        fill: {
          colors: [],
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
    let highestPrice = ref(0);
    let lowestprice = ref(0);
    let openingPrice = ref(0);
    let closingPrice = ref(0);

    const setActiveFilter = (filterObject): void => {
      activeFilterItem.value = filterObject.value;
      emit('filterChanged', activeFilterItem.value);
    };

    watch(
      () => props.dataStream as TokenPrices[],
      async (value) => {
        chartData.value.series[0].data = value;
        highestPrice.value = maxBy(value, 'y') ? maxBy(value, 'y').y : 0;
        lowestprice.value = minBy(value, 'y') ? minBy(value, 'y').y : 0;
        openingPrice.value = value[0] ? value[0].y : 0;
        closingPrice.value = value[value.length - 1] ? value[value.length - 1].y : 0;

        if (openingPrice.value < closingPrice.value) {
          chartData.value.options.colors[0] = '#00CF30';
          chartData.value.options.fill.colors[0] = '#90EE90';
        } else {
          chartData.value.options.colors[0] = '#FF3D56';
          chartData.value.options.fill.colors[0] = '#FF3D56';
        }
      },
      { immediate: true },
    );

    return {
      filterItems,
      chartData,
      activeFilterItem,
      highestPrice,
      lowestprice,
      setActiveFilter,
    };
  },
});
</script>
