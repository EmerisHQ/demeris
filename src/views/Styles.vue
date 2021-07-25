<template>
  <AppLayout>
    <div>
      <h1 class="text-5 font-bold">Styles</h1>
      <p class="text-1 leading-copy mt-4 max-w-lg">
        This page serves as a reference for the common styles and classes used throughout the app.
      </p>
      <p class="text-1 leading-copy mt-4 max-w-lg">
        Many of the classes are straight from Tailwind, and some have been customized, using the same utility class
        approach with different class names and values.
      </p>
      <h2 class="text-4 font-bold mt-16">Typography</h2>
      <h3 class="text-3 font-bold mt-8">Font Size</h3>
      <ul class="mt-7">
        <li class="flex mt-4">
          <p class="flex-1 -text-2">Step -2</p>
          <code class="flex-1 font-mono">.-text-2</code>
        </li>
        <li class="flex mt-4">
          <p class="flex-1 -text-1">Step -1</p>
          <code class="flex-1 font-mono">.-text-1</code>
        </li>
        <li class="flex mt-4">
          <p class="flex-1 text-0">Step 0</p>
          <code class="flex-1 font-mono">.text-0</code>
        </li>
        <li class="flex mt-4">
          <p class="flex-1 text-1">Step 1</p>
          <code class="flex-1 font-mono">.text-1</code>
        </li>
        <li class="flex mt-4">
          <p class="flex-1 text-2">Step 2</p>
          <code class="flex-1 font-mono">.text-2</code>
        </li>
        <li class="flex mt-4">
          <p class="flex-1 text-3">Step 3</p>
          <code class="flex-1 font-mono">.text-3</code>
        </li>
        <li class="flex mt-4">
          <p class="flex-1 text-4">Step 4</p>
          <code class="flex-1 font-mono">.text-4</code>
        </li>
        <li class="flex mt-4">
          <p class="flex-1 text-5">Step 5</p>
          <code class="flex-1 font-mono">.text-5</code>
        </li>
      </ul>
      <h3 class="text-3 font-bold mt-16">Line Height</h3>
      <ul class="mt-7">
        <li class="flex mt-4">
          <p class="flex-1 text-0 leading-none theme-inverse bg-app text-text">None</p>
          <code class="flex-1 font-mono">.leading-none</code>
        </li>
        <li class="flex mt-4">
          <p class="flex-1 text-0 leading-title theme-inverse bg-app text-text">Title</p>
          <code class="flex-1 font-mono">.leading-title</code>
        </li>
        <li class="flex mt-4">
          <p class="flex-1 text-0 leading-copy theme-inverse bg-app text-text">Copy</p>
          <code class="flex-1 font-mono">.leading-copy</code>
        </li>
      </ul>
      <h3 class="text-3 font-bold mt-16">Font Weight</h3>
      <ul class="mt-7">
        <li class="flex mt-4">
          <p class="flex-1 text-0 font-normal">Normal</p>
          <code class="flex-1 font-mono">.font-normal</code>
        </li>
        <li class="flex mt-4">
          <p class="flex-1 text-0 font-medium">Medium</p>
          <code class="flex-1 font-mono">.font-medium</code>
        </li>
        <li class="flex mt-4">
          <p class="flex-1 text-0 font-bold">Bold</p>
          <code class="flex-1 font-mono">.font-bold</code>
        </li>
      </ul>
    </div>
  </AppLayout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import AppLayout from '@/layouts/AppLayout.vue';

export default defineComponent({
  components: {
    AppLayout,
  },
});
</script>
