<template>
  <section class="w-full rounded-xl h-[200px] bg-fg p-6 flex flex-col justify-between">
    <div>
      <h4 class="text-1 font-medium mb-3.5">{{ $t('components.swap.disabledTitle') }}</h4>
      <p class="text-muted -text-1 leading-normal">{{ $t('components.swap.disabledMessage') }}</p>
    </div>
    <a
      href="https://support.emeris.com/en/collections/3445330-contact"
      class="font-[500]"
      target="_blank"
      rel="noopener noreferrer"
      >{{ $t('components.swap.contactEmerisSupport') }}</a
    >
  </section>
</template>

<script lang="ts" setup></script>
