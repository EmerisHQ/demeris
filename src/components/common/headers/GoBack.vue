<template>
  <div class="flex items-center py-8">
    <Button v-if="showBackButton" variant="link" @click="handleGoBackClick">
      <Icon :name="'ArrowLeftIcon'" :icon-size="1" />
    </Button>
    <div class="ml-4">{{ title }}</div>
  </div>
</template>
<script setup lang="ts">
import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';

interface Props {
  title?: string;
  showBackButton?: boolean;
}

withDefaults(defineProps<Props>(), {
  title: '',
  showBackButton: true,
});

const emit = defineEmits<{
  (e: 'go-back'): void;
}>();

const handleGoBackClick = () => {
  emit('go-back');
};
</script>
