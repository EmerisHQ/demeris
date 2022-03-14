<template>
  <div>
    <SkeletonLoader v-if="showLoading" width="100%" :height="`${height - 17}px`" class="mb-8" />
    <div v-if="hasData">
      <apexchart
        v-if="!showLoading"
        class="w-full chart"
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
import { ChartPrices } from '@/types/util';

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
      type: Array as PropType<ChartPrices>,
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
              formatter: () => '',
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
          animations: {
            enabled: true,
            easing: 'linear',
            dynamicAnimation: {
              speed: 250,
            },
          },
          zoom: {
            enabled: false,
          },
          background: 'transparent',
        },
        stroke: {
          // curve: 'straight',
          width: 2,
        },
        xaxis: {
          labels: {
            show: false,
          },
          tooltip: {
            enabled: false,
            theme: false,
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
            opacityFrom: 0.1,
            opacityTo: 0,
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

    const activeFilterItem = ref('1');
    let highestPrice = ref('');
    let lowestPrice = ref('');
    let openingPrice = ref(0);
    let closingPrice = ref(0);
    let priceDiff = ref('');
    let priceDiffPercent = ref('');

    const setActiveFilter = (filterObject): void => {
      activeFilterItem.value = filterObject.value;
      emit('filterChanged', activeFilterItem.value, false);
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

    const gainColor = computed(() => {
      return 'var(--chart-positive)';
    });

    const lossColor = computed(() => {
      return 'var(--chart-negative)';
    });

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
          chartData.value.options.colors[0] = gainColor.value;
          chartData.value.options.fill.colors[0] = gainColor.value;

          emitPriceDiffObject(openingPrice.value, closingPrice.value, 'gain');
        } else {
          chartData.value.options.colors[0] = lossColor.value;
          chartData.value.options.fill.colors[0] = lossColor.value;

          emitPriceDiffObject(openingPrice.value, closingPrice.value, 'loss');
        }

        if (props.variant === 'mini') {
          chartData.value.options.tooltip.enabled = false;
        }
      },
      { immediate: true },
    );

    return {
      theme,
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

<style lang="scss">
.chart {
  --chart-positive: var(--positive);
  --chart-negative: var(--negative);
}
.dark .chart {
  --chart-positive: var(--positive-text);
}

.apexcharts-tooltip {
  background: var(--surface-image) !important;
  box-shadow: theme('boxShadow.button') !important;
  color: theme('colors.text') !important;
  border-radius: theme('borderRadius.lg');
  border: none !important;
  padding: theme('spacing[3]') theme('spacing.4') !important;
  font-size: theme('fontSize.-1') !important;
  line-height: theme('lineHeight.copy') !important;
}

.apexcharts-tooltip-title {
  background: none !important;
  border-bottom: none !important;
  margin-bottom: 0 !important;
  padding: 0 !important;
  font-size: inherit !important;
  font-family: inherit !important;
  line-height: inherit !important;
  @apply text-muted;
}

.apexcharts-tooltip-text {
  font-size: inherit !important;
  font-family: inherit !important;
  font-weight: theme('fontWeight.bold') !important;
  line-height: inherit !important;
  padding: 0 !important;
}

.apexcharts-tooltip-series-group {
  font-size: inherit !important;
  padding: 0 !important;
  justify-content: center !important;
}

.apexcharts-tooltip-y-group {
  padding: 0 !important;
}
</style>
