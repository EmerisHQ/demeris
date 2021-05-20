<script lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

interface ButtonFunctionData {
  type: 'custom' | 'router-link' | 'link-go-out' | 'link-current-page';
  url?: string;
  function?: Function;
}

export default function () {
  const router = useRouter();

  function buttonFunction(data: ButtonFunctionData) {
    if (data.type === 'custom') {
      data.function();
    } else if (data.type === 'router-link') {
      router.push({
        path: data.url,
      });
    } else if (data.type === 'link-go-out') {
      window.open(data.url, '_blank');
    } else if (data.type === 'link-current-page') {
      window.location.href = data.url;
    }
  }

  return {
    buttonFunction,
  };
}
</script>