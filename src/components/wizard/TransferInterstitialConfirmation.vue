<template>
  <div class="flex flex-col items-center text-center space-y-8">
    <div class="flex flex-col items-center" :class="{ 'flex-col-reverse': isSwapComponent }">
      <h1
        class="font-bold pt-8 whitespace-pre-line"
        :class="{
          'text-3': !isSwapComponent,
          'text-2 px-3 pt-28': isSwapComponent,
        }"
      >
        {{ title }}
      </h1>
      <p v-if="subtitle" class="text-1 text-muted mt-3">{{ subtitle }}</p>

      <img
        :src="imageBanner"
        name="Transfer"
        class=""
        :class="{ '-mb-10 max-w-sm': !isSwapComponent, 'absolute z-0 rounded-t-2xl top-0': isSwapComponent }"
      />
    </div>

    <p class="text-muted leading-copy max-w-md mx-auto" :class="{ 'px-6': isSwapComponent }">
      {{ description }}
    </p>

    <a
      v-if="action !== 'addliquidity'"
      href="https://blog.cosmos.network/deep-dive-how-will-ibc-create-value-for-the-cosmos-hub-eedefb83c7a0"
      target="_blank"
      class="font-medium hover:underline"
    >
      {{ $t('generic_cta.learnMore') }} &#x2197;
    </a>

    <div class="w-full max-w-sm mx-auto" :class="{ 'px-6': isSwapComponent }">
      <Button :name="$t('generic_cta.continue')" class="mb-8" :click-function="emitContinue" />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'

import TransferImage from '@/assets/images/transfer-interstitial.png'
import TransferSwapImage from '@/assets/images/transfer-interstitial-swap.png'
import Button from '@/components/ui/Button.vue'
import useAccount from '@/composables/useAccount'
import { GlobalDemerisGetterTypes } from '@/store'
import { TypedAPIStore } from '@/store'
import { BaseAction, IBCBackwardsData, IBCForwardsData, Step, TransferData } from '@/types/actions'
import { getBaseDenom, getDisplayName } from '@/utils/actionHandler'

export default defineComponent({
  components: {
    Button,
  },
  props: {
    isSwapComponent: {
      type: Boolean,
      default: false,
    },
    action: {
      type: String as PropType<BaseAction['name']>,
      default: 'swap',
    },
    steps: {
      type: Object as PropType<Step[]>,
      required: true,
    },
  },

  emits: ['continue'],

  setup(props, { emit }) {
    const apistore = useStore() as TypedAPIStore
    const { nativeBalances } = useAccount()
    const { t } = useI18n({ useScope: 'global' })
    const denoms = ref([])
    const chains = ref([])

    const imageBanner = computed(() => (props.isSwapComponent ? TransferSwapImage : TransferImage))

    const currentAction = computed(() => {
      if (props.action === 'move') {
        return 'transfer'
      }
      return props.action
    })

    const hasMultiple = computed(() => {
      if (currentAction.value === 'addliquidity') {
        return props.steps.length > 2
      }

      return props.steps.length > 1
    })

    const title = computed(() => {
      let result = ''

      switch (currentAction.value) {
        case 'transfer':
          result = t('components.transferToHub.transfer')
          break
        case 'addliquidity':
          result = t('components.transferToHub.addLiquidity')
          break
        case 'swap':
          result = t('components.transferToHub.swap')
          break
        case 'stake':
        case 'multistake':
          result = t('components.transferToHub.stake', { denom: denoms.value[0], chain: chains.value[0] })
          break
      }

      return result
    })

    const subtitle = computed(() => {
      let result = ''

      if (currentAction.value === 'transfer') {
        const backwardData = props.steps[0].transactions[0].data as IBCBackwardsData
        let fromChain = apistore.getters[GlobalDemerisGetterTypes.API.getDisplayChain]({
          name: backwardData.from_chain,
        })
        let toChain = apistore.getters[GlobalDemerisGetterTypes.API.getDisplayChain]({ name: backwardData.to_chain })

        if (props.steps[0].transactions.length > 1 && props.steps[0].transactions[1].name.startsWith('ibc')) {
          const forwardData = props.steps[0].transactions[1].data as IBCForwardsData
          toChain = apistore.getters[GlobalDemerisGetterTypes.API.getDisplayChain]({ name: forwardData.to_chain })
        }

        return t('components.transferToHub.transferSubtitle', { from: fromChain, to: toChain })
      }

      return result
    })

    const description = computed(() => {
      let description = ''

      if (!denoms.value.length) {
        return description
      }

      switch (currentAction.value) {
        case 'addliquidity':
          if (hasMultiple.value) {
            description = t('components.transferToHub.addLiquidityDescriptionMultiple', {
              denomA: denoms.value[0],
              denomB: denoms.value[1],
            })
          } else {
            description = t('components.transferToHub.addLiquidityDescription', { denom: denoms.value[0] })
          }
          break
        case 'swap':
          description = t('components.transferToHub.swapDescription', { denom: denoms.value[0] })
          break
        case 'stake':
        case 'multistake':
          description = t('components.transferToHub.stakeDescription', {
            denom: denoms.value[0],
            chain: chains.value[0],
          })
          break
        case 'transfer':
          if (props.steps[0].transactions.length > 1 && props.steps[0].transactions[1].name.startsWith('ibc')) {
            const backwardData = props.steps[0].transactions[0].data as IBCBackwardsData
            const forwardData = props.steps[0].transactions[1].data as IBCForwardsData

            const fromChain = apistore.getters[GlobalDemerisGetterTypes.API.getDisplayChain]({
              name: backwardData.from_chain,
            })
            const toChain = apistore.getters[GlobalDemerisGetterTypes.API.getDisplayChain]({
              name: forwardData.to_chain,
            })
            const asset = nativeBalances.value.find((item) => item.base_denom === backwardData.base_denom)
            const nativeChain = apistore.getters[GlobalDemerisGetterTypes.API.getDisplayChain]({
              name: asset.on_chain,
            })

            const translateKeyPath =
              props.steps[0].transactions.length > 2 ? 'transferDescriptionMultipleMemo' : 'transferDescriptionMultiple'

            description = t(`components.transferToHub.${translateKeyPath}`, {
              denom: denoms.value[0],
              fromChain,
              toChain,
              nativeChain,
            })
          } else {
            description = t('components.transferToHub.transferDescription')
          }
          break
      }

      return description
    })

    const emitContinue = () => {
      emit('continue')
    }

    watch(
      props.steps,
      async () => {
        let stepDenoms = []
        const dexChain = apistore.getters[GlobalDemerisGetterTypes.API.getDexChain]

        stepDenoms = props.steps
          .map((step) => {
            const transaction = step.transactions[0]
            if (!transaction.name.startsWith('ibc')) {
              return
            }
            const chain = (transaction.data as IBCForwardsData).from_chain || dexChain
            const tochain = (transaction.data as IBCForwardsData).to_chain || dexChain

            const denom = (transaction.data as TransferData).amount.denom
            return { chain, denom, tochain }
          })
          .filter(Boolean)
        ;(chains.value = stepDenoms.map((item) => {
          const displayChain = apistore.getters[GlobalDemerisGetterTypes.API.getDisplayChain]({
            name: item.tochain,
          })
          return displayChain
        })),
          (denoms.value = await Promise.all(
            stepDenoms.map(async (item) => {
              const denom = await getBaseDenom(item.denom, item.chain)
              const displayDenom = await getDisplayName(denom, item.chain)
              return displayDenom
            }),
          ))
      },
      { immediate: true },
    )

    return {
      imageBanner,
      currentAction,
      title,
      subtitle,
      description,
      emitContinue,
    }
  },
})
</script>

<style lang="scss" scoped></style>
