<template>
  <template v-if="imgUrl !== ''">
    <img :src="imgUrl" :alt="validator.moniker" class="w-full h-full block rounded-full relative z-10" />
  </template>
  <template v-else>
    <div class="w-full h-full rounded-full relative z-10 flex items-center justify-center">
      <p class="font-medium">{{ monikerFirst }}</p>
    </div>
  </template>
</template>

<script lang="ts">
import axios from 'axios'
import { defineComponent, onMounted, ref, toRefs, watch } from 'vue'

import { checkStringIsKeybase, getFirstAlphabet } from '@/utils/basic'
export default defineComponent({
  name: 'ValidatorImg',
  props: {
    validator: {
      type: Object,
      required: true,
      default: () => {
        return {}
      },
    },
  },
  setup(props) {
    const { validator } = toRefs(props)
    const imgUrl = ref('')
    const monikerFirst = ref('')
    watch(
      () => validator.value,
      async (newValue) => {
        imgUrl.value = await fetchValidatorImg(newValue)
        monikerFirst.value = getFirstAlphabet(newValue.moniker)
      },
    )

    onMounted(async () => {
      imgUrl.value = await fetchValidatorImg(validator.value)
      monikerFirst.value = getFirstAlphabet(validator.value.moniker)
    })
    return {
      imgUrl,
      monikerFirst,
    }
  },
})

async function fetchValidatorImg(validator: Record<string, string>): Promise<string> {
  if (!checkStringIsKeybase(validator?.identity)) return ''
  try {
    const res = await axios.get(
      'https://keybase.io/_/api/1.0/user/lookup.json?key_suffix=' + validator.identity + '&fields=pictures',
    )
    const url = res.data?.them[0]?.pictures?.primary?.url ?? ''
    return url
  } catch (e) {
    return ''
  }
}
</script>

<style lang="scss" scoped></style>
