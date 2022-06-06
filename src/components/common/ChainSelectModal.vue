<template>
  <div class="chain-select-wrapper w-full h-full flex-1 flex flex-col items-stretch">
    <header class="w-full max-w-7xl mx-auto px-2">
      <TitleWithGoback :title="title" :func="func" :show-back-button="showBackButton" />
    </header>

    <div class="relative min-h-0 flex flex-col">
      <div class="scroll-container overflow-y-auto grow min-h-0 pt-1">
        <div class="mx-auto max-w-md mb-20">
          <div class="w-full mx-auto max-w-sm px-6 mb-6 text-center text-muted leading-copy">
            <template v-if="showSubtitle">
              {{
                $t('components.chainSelect.text1', {
                  asset: selectedDenomDisplay,
                  chainNo: chainsNumber,
                  chains: chainsNumber > 1 ? 'chains' : 'chain',
                })
              }}
              <br />
            </template>
            <slot name="description">
              {{ $t('components.chainSelect.text2') }}
            </slot>
          </div>
          <CoinList :data="filterAsset(assets, selectedDenom)" :type="'chain'" @select="coinListselectHandler" />
        </div>
      </div>
      <WhiteOverlay />
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useStore } from 'vuex';

import CoinList from '@/components/common/CoinList.vue';
import TitleWithGoback from '@/components/common/headers/TitleWithGoback.vue';
import WhiteOverlay from '@/components/common/WhiteOverlay.vue';
import { GlobalGetterTypes, RootStoreTyped } from '@/store';
import { getDisplayName } from '@/utils/actionHandler';

interface Props {
  assets: object;
  func: object;
  title: string;
  selectedDenom: string;
  showSubtitle?: boolean;
  showBackButton?: boolean;
}

const props = withDefaults(defineProps<Props>(), { showSubtitle: true, showBackButton: true });

const emit = defineEmits<{
  (e: 'select', payload: any): void;
}>();

const selectedDenomDisplay = ref(props.selectedDenom);
const chainsNumber = ref(0);
const typedstore = useStore() as RootStoreTyped;
onMounted(async () => {
  selectedDenomDisplay.value = await getDisplayName(
    props.selectedDenom,
    typedstore.getters[GlobalGetterTypes.API.getDexChain],
  );
});
watch(
  () => props.selectedDenom,
  async (newName) => {
    selectedDenomDisplay.value = await getDisplayName(newName, typedstore.getters[GlobalGetterTypes.API.getDexChain]);
  },
);
function filterAsset(assets, keyword) {
  const filteredList = assets.filter((asset) => {
    return asset.base_denom == keyword;
  });

  chainsNumber.value = filteredList.length;

  return filteredList;
}

function coinListselectHandler(payload) {
  payload.type = props.title;
  emit('select', payload);
}
</script>

<style lang="scss" scoped>
.scroll-container {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */

  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera*/
  }
}
</style>
