<template>
  <div class="flex items-center py-8">
    <Button v-if="props.showBackButton" variant="link" @click="handleGoBackClick">
      <Icon :name="'ArrowLeftIcon'" :icon-size="1" />
    </Button>
    <div class="ml-4">{{ props.title }}</div>
  </div>
</template>

<script lang="ts" setup>
import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';

interface Props {
  title?: string;
  showBackButton?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: null,
  showBackButton: true,
});

interface Events {
  (e: 'go-back'): void;
}

const emit = defineEmits<Events>();

const handleGoBackClick = () => {
  emit('go-back');
};
</script>
