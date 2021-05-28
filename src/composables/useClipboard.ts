import { ComputedRef, ref, unref } from 'vue';

type ClipboardOptions = {
  resetAfter?: number;
};

export default function useClipboard(options?: ClipboardOptions) {
  const isSupported = Boolean(navigator && 'clipboard' in navigator);
  const hasCopied = ref(false);

  async function copy(value: string | ComputedRef<string>) {
    if (isSupported) {
      await navigator.clipboard.writeText(unref(value));
      hasCopied.value = true;

      setTimeout(() => (hasCopied.value = false), options?.resetAfter || 1000);
    }
  }

  return {
    isSupported,
    copy,
    hasCopied,
  };
}
