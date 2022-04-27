<template>
  <IconButton
    :disabled="!state.can('COINS.SWITCH')"
    class="-ml-0.5 text-text bg-surface"
    :name="'UpsideDownIcon'"
    :type="'circle'"
    :icon-size="1"
    :status="'normal'"
    :data="handleClick"
  />
</template>

<script lang="ts" setup>
import IconButton from '@/components/ui/IconButton.vue';
import { ButtonFunctionData } from '@/types/util';

import { useSwapActor } from '../../state';

const { state, send } = useSwapActor();

const handleClick = { type: 'custom', function: () => send('COINS.SWITCH') } as ButtonFunctionData;
</script>
