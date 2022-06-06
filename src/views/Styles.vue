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
      <h2 class="text-4 font-bold mt-20">Typography</h2>
      <h3 class="text-3 font-bold mt-8">Font Size</h3>
      <ul class="mt-7">
        <li class="flex mt-4 gap-6">
          <p class="flex-1 -text-2">Step -2</p>
          <code class="flex-1 font-mono">.-text-2</code>
        </li>
        <li class="flex mt-4 gap-6">
          <p class="flex-1 -text-1">Step -1</p>
          <code class="flex-1 font-mono">.-text-1</code>
        </li>
        <li class="flex mt-4 gap-6">
          <p class="flex-1 text-0">Step 0</p>
          <code class="flex-1 font-mono">.text-0</code>
        </li>
        <li class="flex mt-4 gap-6">
          <p class="flex-1 text-1">Step 1</p>
          <code class="flex-1 font-mono">.text-1</code>
        </li>
        <li class="flex mt-4 gap-6">
          <p class="flex-1 text-2">Step 2</p>
          <code class="flex-1 font-mono">.text-2</code>
        </li>
        <li class="flex mt-4 gap-6">
          <p class="flex-1 text-3">Step 3</p>
          <code class="flex-1 font-mono">.text-3</code>
        </li>
        <li class="flex mt-4 gap-6">
          <p class="flex-1 text-4">Step 4</p>
          <code class="flex-1 font-mono">.text-4</code>
        </li>
        <li class="flex mt-4 gap-6">
          <p class="flex-1 text-5">Step 5</p>
          <code class="flex-1 font-mono">.text-5</code>
        </li>
      </ul>
      <h3 class="text-3 font-bold mt-20">Line Height</h3>
      <ul class="mt-7">
        <li class="flex items-start mt-4 gap-6">
          <p class="flex-1 text-0 leading-none theme-inverse bg-app text-text">None</p>
          <code class="flex-1 font-mono">.leading-none</code>
        </li>
        <li class="flex items-start mt-4 gap-6">
          <p class="flex-1 text-0 leading-title theme-inverse bg-app text-text">Title</p>
          <code class="flex-1 font-mono">.leading-title</code>
        </li>
        <li class="flex items-start mt-4 gap-6">
          <p class="flex-1 text-0 leading-copy theme-inverse bg-app text-text">Copy</p>
          <code class="flex-1 font-mono">.leading-copy</code>
        </li>
      </ul>
      <h3 class="text-3 font-bold mt-20">Font Weight</h3>
      <ul class="mt-7">
        <li class="flex mt-4 gap-6">
          <p class="flex-1 text-0 font-normal">Normal</p>
          <code class="flex-1 font-mono">.font-normal</code>
        </li>
        <li class="flex mt-4 gap-6">
          <p class="flex-1 text-0 font-medium">Medium</p>
          <code class="flex-1 font-mono">.font-medium</code>
        </li>
        <li class="flex mt-4 gap-6">
          <p class="flex-1 text-0 font-bold">Bold</p>
          <code class="flex-1 font-mono">.font-bold</code>
        </li>
      </ul>
      <h2 class="text-4 font-bold mt-20">Buttons</h2>
      <h3 class="text-3 font-bold mt-8">Variants</h3>
      <ul class="flex items-center mt-7 gap-8">
        <li><Button variant="primary" name="Primary" /></li>
        <li><Button variant="secondary" name="Secondary" /></li>
        <li><Button variant="link" name="Link" /></li>
        <li><Button variant="link" href="emeris.com" name="External link" /></li>
      </ul>
      <h3 class="text-3 font-bold mt-8">Sizes</h3>
      <ul class="flex items-center mt-7 gap-8">
        <li><Button variant="primary" name="Medium" size="md" /></li>
        <li><Button variant="secondary" name="Medium" size="md" /></li>
        <li><Button variant="link" name="Medium" size="md" /></li>
      </ul>
      <ul class="flex items-center mt-4 gap-8">
        <li><Button variant="primary" name="Small" size="sm" /></li>
        <li><Button variant="secondary" name="Small" size="sm" /></li>
        <li><Button variant="link" name="Small" size="sm" /></li>
      </ul>
      <h3 class="text-3 font-bold mt-20">Disabled</h3>
      <ul class="flex items-center mt-7 gap-8">
        <li><Button variant="primary" disabled name="Disabled" /></li>
        <li><Button variant="secondary" disabled name="Disabled" /></li>
        <li><Button variant="link" disabled name="Disabled" /></li>
      </ul>
      <h3 class="text-3 font-bold mt-20">Loading</h3>
      <ul class="flex items-center mt-7 gap-8">
        <li><Button variant="primary" status="loading" /></li>
        <li><Button variant="primary" status="loading" name="Loading" /></li>
        <li><Button variant="secondary" status="loading" /></li>
        <li><Button variant="secondary" status="loading" name="Loading" /></li>
        <li><Button variant="link" status="loading" /></li>
        <li><Button variant="link" status="loading" name="Loading" /></li>
      </ul>
      <h3 class="text-3 font-bold mt-20">Icons</h3>
      <ul class="flex items-center mt-7 gap-8">
        <li>
          <Button variant="primary" name="Left icon"><AlertIcon /></Button>
        </li>
        <li>
          <Button variant="secondary" name="Left icon"><AlertIcon /></Button>
        </li>
        <li>
          <Button variant="link" name="Left icon"><AlertIcon /></Button>
        </li>
      </ul>
      <h2 class="text-4 font-bold mt-20">Fields</h2>
      <h3 class="text-3 font-bold mt-8">Inputs</h3>
      <ul class="mt-7">
        <li class="mt-4">
          <Input placeholder="Default" />
        </li>
        <li class="mt-4">
          <Input placeholder="Icon left">
            <template #start>
              <AlertIcon />
            </template>
          </Input>
        </li>
        <li class="mt-4">
          <Input placeholder="Icon right">
            <template #end>
              <AlertIcon />
            </template>
          </Input>
        </li>
        <li class="mt-4">
          <Input placeholder="Hint icon" hint="My hint message" />
        </li>
      </ul>
      <h3 class="text-3 font-bold mt-8">Address field</h3>
      <div class="mt-7 max-w-md">
        <Address />
      </div>
      <div class="mt-7 max-w-md">
        <Address address="cosmos1vy8r9tje0zpp3rs75ga0gv7743h57yud9tgw8f" chain-name="Cosmos Hub" />
      </div>
      <div class="mt-7 max-w-md">
        <Address address="cosmos1vy8r9tje0zpp3rs75ga0gv7743h57yud9tgw8f" chain-name="Cosmos Hub" readonly />
      </div>
      <h2 class="text-4 font-bold mt-20">Alerts</h2>
      <h3 class="text-3 font-bold mt-8">Inline</h3>
      <ul class="mt-7 max-w-sm">
        <li class="mt-4"><Alert status="error" message="Error alert" /></li>
        <li class="mt-4"><Alert status="warning" message="Warning alert" /></li>
        <li class="mt-4"><Alert status="info" message="Info alert" /></li>
      </ul>
      <h2 class="text-4 font-bold mt-20">Validator symbols</h2>
      <ul class="flex items-center mt-7 gap-8">
        <li><ValidatorBadge :validator="validator1" size="xs" /></li>
        <li><ValidatorBadge :validator="validator1" size="sm" /></li>
        <li><ValidatorBadge :validator="validator1" size="md" /></li>
        <li><ValidatorBadge :validator="validator1" size="lg" /></li>
        <li><ValidatorBadge :validator="validator1" size="xl" /></li>
      </ul>
      <ul class="flex items-center mt-7 gap-8">
        <li><ValidatorBadge :validator="validator2" size="xs" /></li>
        <li><ValidatorBadge :validator="validator2" size="sm" /></li>
        <li><ValidatorBadge :validator="validator2" size="md" /></li>
        <li><ValidatorBadge :validator="validator2" size="lg" /></li>
        <li><ValidatorBadge :validator="validator2" size="xl" /></li>
      </ul>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import AlertIcon from '@/components/common/Icons/AlertIcon.vue';
import ValidatorBadge from '@/components/common/ValidatorBadge.vue';
import Address from '@/components/ui/Address.vue';
import Alert from '@/components/ui/Alert.vue';
import Button from '@/components/ui/Button.vue';
import Input from '@/components/ui/Input.vue';
import AppLayout from '@/layouts/AppLayout.vue';

const validator1 = ref({ moniker: 'Valerie' });
const validator2 = ref({
  moniker: 'Jailed Valerie',
  jailed: true,
});
</script>
