import { ref } from 'vue'

export default function useModal() {
  const isOpen = ref(false)
  function toggleModal() {
    isOpen.value = !isOpen.value
  }

  return {
    isOpen,
    toggleModal,
  }
}
