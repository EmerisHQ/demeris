<template>
  <div>
    <SkeletonLoader v-if="showLoading" width="100%" :height="`${height - 50}px`" class="mb-8" />
    <div v-if="hasData">
      <apexchart
        v-if="!showLoading"
        class="w-full"
        :height="height"
        :options="chartData.options"
        :series="chartData.series"
      ></apexchart>
      <div v-if="variant === 'full'" class="flex justify-between items-center -mt-4">
        <p class="-text-1 text-muted">
          {{ $t('pages.asset.highLow', { high: highestPrice, low: lowestPrice }) }}
        </p>
        <div>
          <a
            v-for="(item, index) in filterItems"
            :key="index"
            class="mx-1 rounded-lg px-4 py-2 -text-1 cursor-pointer"
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
import { computed, defineComponent, PropType, ref, watch } from 'vue';

import SkeletonLoader from '@/components/common/loaders/SkeletonLoader.vue';
import useTheme from '@/composables/useTheme';
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

    const theme = useTheme();

    const chartData = ref({
      options: {
        theme: {
          mode: 'dark',
        },
        tooltip: {
          enabled: true,
          x: {
            show: true,
          },
          y: {
            formatter: (value) => {
              return `$${value}`;
            },
            title: {
              formatter: (seriesName) => '',
            },
          },
          marker: {
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
          tooltip: {
            enabled: false,
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
            opacityFrom: 0.6,
            opacityTo: 0.1,
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
    let priceDiffPercent = ref('');

    const setActiveFilter = (filterObject): void => {
      activeFilterItem.value = filterObject.value;
      emit('filterChanged', activeFilterItem.value);
    };

    const hasData = computed(() => {
      return chartData.value.series[0].data.length > 0;
    });

    const emitPriceDiffObject = (openingPrice, closingPrice, indicator): void => {
      let rawPriceDiff = 0;
      if (indicator === 'gain') {
        rawPriceDiff = closingPrice - openingPrice;
        priceDiff.value = `$${rawPriceDiff.toFixed(2)}`;
        priceDiffPercent.value = `${((rawPriceDiff / openingPrice) * 100).toFixed(2)}%`;
      } else {
        rawPriceDiff = openingPrice - closingPrice;
        priceDiff.value = `-$${rawPriceDiff.toFixed(2)}`;
        priceDiffPercent.value = `-${((rawPriceDiff / openingPrice) * 100).toFixed(2)}%`;
      }

      emit('priceDiff', {
        diff: priceDiff.value,
        rawDiff: rawPriceDiff,
        indicator: indicator,
        percent: priceDiffPercent.value,
      });
    };

    // watch(
    //   () => [theme.value],
    //   () => {
    //     chartData.value.options.theme.mode = theme.value;
    //     emit('filterChanged', activeFilterItem.value);
    //   },
    // );

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
          chartData.value.options.colors[0] = theme.value === 'light' ? '#00CF30' : '#50CF49';
          chartData.value.options.fill.colors[0] = theme.value === 'light' ? '#00CF30' : '#50CF49';

          emitPriceDiffObject(openingPrice.value, closingPrice.value, 'gain');
        } else {
          chartData.value.options.colors[0] = theme.value === 'light' ? '#FE475F' : '#FF3D56';
          chartData.value.options.fill.colors[0] = theme.value === 'light' ? '#FE475F' : '#FF3D56';

          emitPriceDiffObject(openingPrice.value, closingPrice.value, 'loss');
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
      hasData,
      activeFilterItem,
      highestPrice,
      lowestPrice,
      setActiveFilter,
    };
  },
});
</script>
