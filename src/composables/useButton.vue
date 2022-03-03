<script lang="ts">
import { useRouter } from 'vue-router'

import { ButtonFunctionData } from '@/types/setups'
export default function () {
  const router = useRouter()

  function buttonFunction(data: ButtonFunctionData) {
    if (data.type === 'custom') {
      data.function()
    } else if (data.type === 'router-link') {
      router.push({
        path: data.url,
      })
    } else if (data.type === 'link-go-out') {
      // open new page
      window.open(data.url, '_blank')
    } else if (data.type === 'link-current-page') {
      // replace current page
      window.location.href = data.url
    }
  }

  return {
    buttonFunction,
  }
}
</script>
