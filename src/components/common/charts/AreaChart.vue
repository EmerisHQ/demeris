<template>
  <div>
    <apexchart class="w-full" height="320" :options="chartData.options" :series="chartData.series"></apexchart>
    <div v-if="variant === 'full'" class="text-right">
      <a
        v-for="(item, index) in filterItems"
        :key="index"
        class="mx-2 rounded px-4 py-2 -text-1 cursor-pointer hover:bg-fg"
        @click="setActiveFilter(item)"
      >
        {{ item.text }}
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  name: 'AreaChart',
  props: {
    variant: {
      type: String,
      default: 'full',
      required: false,
    },
    dataStream: {
      type: Array as PropType<any[]>,
      required: true,
      default: () => [],
    },
  },
  setup() {
    return {
      filterItems: [
        {
          text: '1D',
          value: 'day',
        },
        {
          text: '1W',
          value: 'week',
        },
        {
          text: '1M',
          value: 'month',
        },
        {
          text: '1Y',
          value: 'year',
        },
        {
          text: 'All',
          value: 'all',
        },
      ],
      chartData: {
        options: {
          chart: {
            type: 'area',
            toolbar: {
              show: false,
            },
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
      },
      activeFilterItemValue: null,
    };
  },
  mounted() {
    this.chartData.series[0].data = this.dataStream;
  },
  methods: {
    setActiveFilter(filterObject): void {
      this.activeFilterItemValue = filterObject.value;
    },
  },
});
</script>
