<template>
  <div>
    <SkeletonLoader v-if="showLoading && chartData.series[0].data.length <= 0" width="100%" :height="`${height}px`" />
    <div v-if="chartData.series[0].data.length > 0">
      <apexchart class="w-full" :height="height" :options="chartData.options" :series="chartData.series"></apexchart>
      <div v-if="variant === 'full'" class="flex justify-between items-center">
        <p class="-text-1 text-muted">
          {{ $t('pages.asset.highLow', { high: highestPrice, low: lowestPrice }) }}
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
    },
    height: {
      type: String,
      default: '320',
    },
    dataStream: {
      type: Array as PropType<TokenPrices[]>,
      required: true,
    },
    showLoading: {
      type: Boolean,
    },
  },
  emits: ['filterChanged', 'priceDiff'],
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
          enabled: true,
          x: {
            show: false,
          },
        },
        chart: {
          type: 'area',
          toolbar: {
            show: false,
          },
          zoom: {
            enabled: false,
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
          data: ref(null),
        },
      ],
    });

    const activeFilterItem = ref('max');
    let highestPrice = ref('');
    let lowestPrice = ref('');
    let openingPrice = ref(0);
    let closingPrice = ref(0);
    let priceDiff = ref('');
    let priceDiffIndicator = ref('');
    let priceDiffPercent = ref('');

    const setActiveFilter = (filterObject): void => {
      activeFilterItem.value = filterObject.value;
      emit('filterChanged', activeFilterItem.value);
    };

    watch(
      () => [props.dataStream, props.variant],
      async () => {
        chartData.value.series[0].data = props.dataStream;

        const high = (maxBy(props.dataStream, 'y') ? maxBy(props.dataStream, 'y').y : 0).toFixed(2);
        highestPrice.value = '$' + high.toString();

        const low = (minBy(props.dataStream, 'y') ? minBy(props.dataStream, 'y').y : 0).toFixed(2);
        lowestPrice.value = '$' + low.toString();

        openingPrice.value = props.dataStream[0] ? props.dataStream[0].y : 0;
        closingPrice.value = props.dataStream[props.dataStream.length - 1]
          ? props.dataStream[props.dataStream.length - 1].y
          : 0;

        if (openingPrice.value <= closingPrice.value) {
          chartData.value.options.colors[0] = '#00CF30';
          chartData.value.options.fill.colors[0] = '#90EE90';
          priceDiff.value = `$${openingPrice.value - closingPrice.value}`;
          priceDiffIndicator.value = 'gain';
          priceDiffPercent.value = `${((openingPrice.value - closingPrice.value) / openingPrice.value) * 100}%`;
          emit('priceDiff', {
            diff: priceDiff.value,
            indicator: priceDiffIndicator.value,
            percent: priceDiffPercent.value,
          });
        } else {
          chartData.value.options.colors[0] = '#FF3D56';
          chartData.value.options.fill.colors[0] = '#FF3D56';
          priceDiff.value = `$${closingPrice.value - openingPrice.value}`;
          priceDiffIndicator.value = 'loss';
          priceDiffPercent.value = `${((closingPrice.value - openingPrice.value) / openingPrice.value) * 100}%`;
          emit('priceDiff', {
            diff: priceDiff.value,
            indicator: priceDiffIndicator.value,
            percent: priceDiffPercent.value,
          });
        }

        if (props.variant === 'mini') {
          chartData.value.options.tooltip.enabled = false;
        }
      },
      { immediate: true },
    );

    return {
      filterItems,
      chartData,
      activeFilterItem,
      highestPrice,
      lowestPrice,
      setActiveFilter,
    };
  },
});
</script>
